import { AegisElement, queryAll, queryId } from '@roenlie/lit-aegis';
import { withDebounce } from '@roenlie/mimic-core/timing';
import { css, type CSSResultGroup, html, render } from 'lit';

import { Debouncer } from './debouncer.js';
import { isFirefox } from './is-firefox.js';
import { timeOut } from './timeout.js';
import { generateUniqueId } from './unique-id.js';


interface BufferElement extends HTMLElement {
	translateY: number;
	updated: boolean;
	children: HTMLCollectionOf<SlotElement>;
}


interface SlotElement extends HTMLSlotElement {
	_itemWrapper: ItemWrapperElement;
}


interface ItemWrapperElement extends HTMLDivElement {
	instance: HTMLElement & Record<PropertyKey, any>;
}


export abstract class InfiniteScroller extends AegisElement {

	@queryId('scroller', true) protected scrollerQry: HTMLElement;
	@queryId('fullHeight', true) protected fullHeightQry: HTMLElement;
	@queryAll('.buffer') protected bufferQry: NodeListOf<BufferElement>;

	/**
	 * Count of individual items in each buffer.
	 * The scroller has 2 buffers altogether so bufferSize of 20
	 * will result in 40 buffered DOM items in total.
	 * Changing after initialization not supported.
	 */
	public bufferSize = 20;

	/**
	 * The amount of initial scroll top.
	 * Needed in order for the user to be able to scroll backwards.
	 */
	protected initialScroll = 50000;

	/** The index/position mapped at _initialScroll point. */
	protected initialIndex = 0;

	/** lowest index list will scroll to. */
	protected minIndex?: number;

	/** highest index list will scroll to. */
	protected maxIndex?: number;

	protected itemHeightVal: number;
	protected preventScrollEvent: boolean;
	protected buffers: [BufferElement, BufferElement];
	protected firstIndex: number;
	protected scrollDisabled: boolean;
	protected mayHaveMomentum: boolean;
	protected initDone: boolean;
	protected debouncerUpdateClones: Debouncer;
	protected debouncerScrollFinish: Debouncer;
	protected activated = false;

	public get active(): boolean {
		return this.activated;
	}

	public set active(active) {
		if (active && !this.activated) {
			this.createPool();
			this.activated = true;
		}
	}

	public get bufferOffset(): number {
		return this.buffers[0].offsetTop;
	}

	public get itemHeight(): number {
		if (!this.itemHeightVal) {
			const itemHeight = getComputedStyle(this).getPropertyValue('--_infinite-scroller-item-height');
			// Use background-position temp inline style for unit conversion
			const tmpStyleProp = 'background-position';
			this.fullHeightQry.style.setProperty(tmpStyleProp, itemHeight);
			const itemHeightPx = getComputedStyle(this.fullHeightQry).getPropertyValue(tmpStyleProp);
			this.fullHeightQry.style.removeProperty(tmpStyleProp);
			this.itemHeightVal = parseFloat(itemHeightPx);
		}

		return this.itemHeightVal;
	}

	private get _bufferHeight(): number {
		return this.itemHeight * this.bufferSize;
	}

	public get position(): number {
		return (this.scrollerQry.scrollTop - this.buffers[0].translateY) / this.itemHeight + this.firstIndex;
	}

	/** Current scroller position as index. Can be a fractional number. */
	public set position(index: number) {
		this.preventScrollEvent = true;
		if (index > this.firstIndex && index < this.firstIndex + this.bufferSize * 2) {
			this.scrollerQry.scrollTop = this.itemHeight * (index - this.firstIndex) + this.buffers[0].translateY;
		}
		else {
			this.initialIndex = ~~index;
			this.reset();
			this.scrollDisabled = true;
			this.scrollerQry.scrollTop += (index % 1) * this.itemHeight;
			this.scrollDisabled = false;
		}

		if (this.mayHaveMomentum) {
			// Stop the possible iOS Safari momentum with -webkit-overflow-scrolling: auto;
			this.scrollerQry.classList.add('notouchscroll');
			this.mayHaveMomentum = false;

			setTimeout(() => {
				// Restore -webkit-overflow-scrolling: touch; after a small delay.
				this.scrollerQry.classList.remove('notouchscroll');
			}, 10);
		}
	}

	protected override firstUpdated(props: Map<PropertyKey, unknown>) {
		super.firstUpdated(props);

		this.buffers = [ ...this.bufferQry ] as typeof this.buffers;
		this.fullHeightQry.style.height = `${ this.initialScroll * 2 }px`;
		this.scrollerQry.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

		// Firefox interprets elements with overflow:auto as focusable
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1069739
		if (isFirefox)
			this.scrollerQry.tabIndex = -1;
	}

	/**
	 * Force the scroller to update clones after a reset, without
	 * waiting for the debouncer to resolve.
	 */
	public forceUpdate() {
		if (this.debouncerUpdateClones) {
			this.buffers[0].updated = false;
			this.buffers[1].updated = false;

			this.updateClones();
			this.debouncerUpdateClones.cancel();
		}
	}

	protected abstract createElement(): HTMLElement
	protected abstract updateElement(element: HTMLElement, index: number): void

	protected finishInit() {
		if (this.initDone)
			return;

		// Once the first set of items start fading in, stamp the rest
		for (const buffer of this.buffers) {
			for (const slot of buffer.children)
				this.ensureStampedInstance(slot._itemWrapper);
		}

		if (!this.buffers[0].translateY)
			this.reset();

		this.initDone = true;
		this.dispatchEvent(new CustomEvent('init-done'));
	}

	protected translateBuffer(up: boolean) {
		const index = up ? 1 : 0;
		this.buffers[index].translateY = this.buffers[index ? 0 : 1].translateY + this._bufferHeight * (index ? -1 : 1);
		this.buffers[index].style.transform = `translate3d(0, ${ this.buffers[index].translateY }px, 0)`;
		this.buffers[index].updated = false;
		this.buffers.reverse();
	}

	protected blockScroll = withDebounce(
		() => { this.scrollerQry.style.setProperty('overflow', 'hidden'); },
		() => { this.scrollerQry.style.removeProperty('overflow'); },
		100,
	);

	protected handleScroll() {
		if (this.scrollDisabled)
			return;

		if (this.minIndex !== undefined) {
			if (this.position < this.minIndex) {
				this.position = this.minIndex;

				return this.blockScroll();
			}
		}

		if (this.maxIndex) {
			if (this.position > this.maxIndex) {
				this.position = this.maxIndex;

				return this.blockScroll();
			}
		}

		const scrollTop = this.scrollerQry.scrollTop;
		if (scrollTop < this._bufferHeight || scrollTop > this.initialScroll * 2 - this._bufferHeight) {
			// Scrolled near the end/beginning of the scrollable area -> reset.
			// ~~ is a double Bitwise NOT operator.
			// It is used as a faster substitute for Math.floor() for positive numbers.
			this.initialIndex = ~~this.position;
			this.reset();
		}

		// Check if we scrolled enough to translate the buffer positions.
		const offset = this.itemHeight + this.bufferOffset;
		const upperThresholdReached = scrollTop > this.buffers[1].translateY + offset;
		const lowerThresholdReached = scrollTop < this.buffers[0].translateY + offset;

		if (upperThresholdReached || lowerThresholdReached) {
			this.translateBuffer(lowerThresholdReached);
			this.updateClones();
		}

		if (!this.preventScrollEvent) {
			this.dispatchEvent(new CustomEvent('custom-scroll', { bubbles: false, composed: true }));
			this.mayHaveMomentum = true;
		}

		this.preventScrollEvent = false;

		this.debouncerScrollFinish = Debouncer.debounce(
			this.debouncerScrollFinish, timeOut.after(200), () => {
				const scrollerRect = this.scrollerQry.getBoundingClientRect();
				const firstBufferVisible = this.isVisible(this.buffers[0], scrollerRect);
				const secondBufferVisible = this.isVisible(this.buffers[1], scrollerRect);

				if (!firstBufferVisible && !secondBufferVisible)
					this.position = this.position; // eslint-disable-line no-self-assign
			},
		);
	}

	protected reset() {
		this.scrollDisabled = true;
		this.scrollerQry.scrollTop = this.initialScroll;
		this.buffers[0].translateY = this.initialScroll - this._bufferHeight;
		this.buffers[1].translateY = this.initialScroll;

		for (const buffer of this.buffers)
			buffer.style.transform = `translate3d(0, ${ buffer.translateY }px, 0)`;

		this.buffers[0].updated = false;
		this.buffers[1].updated = false;

		this.updateClones(true);

		this.debouncerUpdateClones = Debouncer.debounce(this.debouncerUpdateClones, timeOut.after(200), () => {
			this.buffers[0].updated = false;
			this.buffers[1].updated = false;

			this.updateClones();
		});

		this.scrollDisabled = false;
	}

	protected createPool() {
		const container = this.getBoundingClientRect();
		this.buffers.forEach((buffer) => {
			for (let i = 0; i < this.bufferSize; i++) {
				const itemWrapper = document.createElement('div') as ItemWrapperElement;
				itemWrapper.style.height = `${ this.itemHeight }px`;
				itemWrapper.instance = {} as HTMLElement;

				const slotName = `infinite-scroller-item-content-${ generateUniqueId() }`;

				const slot = document.createElement('slot') as SlotElement;
				slot.setAttribute('name', slotName);
				slot._itemWrapper = itemWrapper;
				buffer.appendChild(slot);

				itemWrapper.setAttribute('slot', slotName);
				this.appendChild(itemWrapper);

				// Only stamp the visible instances first
				if (this.isVisible(itemWrapper, container))
					this.ensureStampedInstance(itemWrapper);
			}
		});

		requestAnimationFrame(() => this.finishInit());
	}

	protected ensureStampedInstance(itemWrapper: ItemWrapperElement) {
		if (itemWrapper.firstElementChild)
			return;

		const tmpInstance = itemWrapper.instance;

		itemWrapper.instance = this.createElement();
		itemWrapper.appendChild(itemWrapper.instance);

		for (const prop of Object.keys(tmpInstance))
			itemWrapper.instance[prop] = tmpInstance[prop]!;
	}

	protected updateClones(viewPortOnly?: boolean) {
		this.firstIndex = ~~((this.buffers[0].translateY - this.initialScroll) / this.itemHeight) + this.initialIndex;

		const scrollerRect = viewPortOnly ?
			this.scrollerQry.getBoundingClientRect()
			: undefined;

		for (let i = 0; i < this.buffers.length; i++) {
			const buffer = this.buffers[i]!;
			if (buffer.updated)
				continue;

			const firstIndex = this.firstIndex + this.bufferSize * i;

			for (let i = 0; i < buffer.children.length; i++) {
				const slot = buffer.children[i]!;

				const itemWrapper = slot._itemWrapper;
				if (!viewPortOnly || scrollerRect && this.isVisible(itemWrapper, scrollerRect))
					this.updateElement(itemWrapper.instance, firstIndex + i);
			}

			buffer.updated = true;
		}
	}

	protected isVisible(element: HTMLElement, container: DOMRect) {
		const rect = element.getBoundingClientRect();

		return rect.bottom > container.top && rect.top < container.bottom;
	}

	protected override render(): unknown {
		return html`
		<div id="scroller">
			<div class="buffer"></div>
			<div class="buffer"></div>
			<div id="fullHeight"></div>
		</div>
		`;
	}


	public static override styles: CSSResultGroup = css`
		:host {
			--_infinite-scroller-item-height: 100px;
			--_infinite-scroller-buffer-width: 100%;
			--_infinite-scroller-buffer-offset: 0;

			overflow: hidden;
			display: block;
		}
		#scroller {
			position: relative;
			height: 100%;
			overflow: auto;
			outline: none;
			-webkit-overflow-scrolling: touch;
			overflow-x: hidden;
		}
		#scroller.notouchscroll {
			-webkit-overflow-scrolling: auto;
		}
		#scroller::-webkit-scrollbar {
			display: none;
		}
		.buffer {
			box-sizing: border-box;
			position: absolute;
			top: var(--_infinite-scroller-buffer-offset);
			width: var(--_infinite-scroller-buffer-width);
			animation: fadein 0.2s;
		}
		@keyframes fadein {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	`;

}