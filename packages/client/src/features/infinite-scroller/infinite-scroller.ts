import { AegisElement, query, queryId } from '@roenlie/lit-aegis';
import { debounce, withDebounce } from '@roenlie/mimic-core/timing';
import { css, type CSSResultGroup, html } from 'lit';
import { when } from 'lit/directives/when.js';


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
	@query('s-scroll-thumb', true) protected thumbQry: HTMLElement;

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

	protected preventScrollEvent: boolean;

	/** This must be an array, as part of the core logic is reversing the order. */
	protected buffers: [BufferElement, BufferElement];
	protected firstIndex: number;
	protected scrollDisabled: boolean;
	protected mayHaveMomentum: boolean;
	protected initDone: boolean;

	protected debounceUpdateClones = debounce(() => {
		this.buffers[0].updated = false;
		this.buffers[1].updated = false;

		this.updateClones();
	}, 200);

	protected debounceScroll = debounce(() => {
		const scrollerRect = this.scrollerQry.getBoundingClientRect();
		const firstBufferVisible = this.isVisible(this.buffers[0], scrollerRect);
		const secondBufferVisible = this.isVisible(this.buffers[1], scrollerRect);

		if (!firstBufferVisible && !secondBufferVisible)
			this.position = this.position; // eslint-disable-line no-self-assign
	}, 200);

	/** This must be set to true for the scroller to initialized. */
	#active = false;
	public get active(): boolean { return this.#active; }
	public set active(active) {
		if (this.#active || !active)
			return;

		this.createPool();
		this.#active = true;
	}

	public get bufferOffset(): number {
		return this.buffers[0].offsetTop;
	}

	#itemHeight: number;
	public get itemHeight(): number {
		if (!this.#itemHeight) {
			const itemHeight = getComputedStyle(this)
				.getPropertyValue('--_infinite-scroller-item-height');

			// Use background-position temp inline style for unit conversion
			const tmpStyleProp = 'background-position';
			this.fullHeightQry.style.setProperty(tmpStyleProp, itemHeight);
			const itemHeightPx = getComputedStyle(this.fullHeightQry).getPropertyValue(tmpStyleProp);
			this.fullHeightQry.style.removeProperty(tmpStyleProp);
			this.#itemHeight = parseFloat(itemHeightPx);
		}

		return this.#itemHeight;
	}

	protected get bufferHeight(): number {
		return this.itemHeight * this.bufferSize;
	}

	public get position(): number {
		return (this.scrollerQry.scrollTop - this.buffers[0].translateY)
			/ this.itemHeight + this.firstIndex;
	}

	/** Current scroller position as index. Can be a fractional number. */
	public set position(index: number) {
		this.preventScrollEvent = true;
		if (index > this.firstIndex && index < this.firstIndex + this.bufferSize * 2) {
			this.scrollerQry.scrollTop = this.itemHeight
				* (index - this.firstIndex)
				+ this.buffers[0].translateY;
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

		const bufferEls = this.shadowRoot!.querySelectorAll('.buffer');
		this.buffers = [ ...bufferEls ] as typeof this.buffers;
		this.fullHeightQry.style.height = `${ this.initialScroll * 2 }px`;
		this.scrollerQry.addEventListener('scroll',
			this.handleScroll.bind(this), { passive: true });

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
		this.buffers[0].updated = false;
		this.buffers[1].updated = false;

		this.updateClones();
		this.debounceUpdateClones.cancel();
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
		this.buffers[index].translateY = this.buffers[up ? 0 : 1].translateY + this.bufferHeight * (up ? -1 : 1);
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
		if (this.minIndex !== undefined && this.maxIndex !== undefined) {
			const itemLength = this.maxIndex - this.minIndex;
			const contentHeight = this.itemHeight * itemLength;
			const viewportHeight = this.offsetHeight;

			const viewableRatio = viewportHeight / contentHeight; // 1/3 or 0.333333333n
			const scrollBarArea = viewportHeight * 2;             // 150px
			const thumbHeight = scrollBarArea * viewableRatio;    // 50px

			this.thumbQry.style.height = thumbHeight + 'px';

			const top = Math.max(0, (viewportHeight - thumbHeight) / itemLength * this.position);

			this.thumbQry.dataset['top'] = top + '';
			this.thumbQry.style.transform = `translate3d(0, ${ top }px, 0)`;
		}

		if (this.scrollDisabled)
			return;

		if (this.minIndex !== undefined && this.position < this.minIndex) {
			this.position = this.minIndex;

			return this.blockScroll();
		}

		if (this.maxIndex !== undefined && this.position > this.maxIndex) {
			this.position = this.maxIndex;

			return this.blockScroll();
		}

		const scrollTop = this.scrollerQry.scrollTop;
		if (scrollTop < this.bufferHeight || scrollTop > this.initialScroll * 2 - this.bufferHeight) {
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

		this.debounceScroll();
	}

	protected reset() {
		this.scrollDisabled = true;
		this.scrollerQry.scrollTop = this.initialScroll;
		this.buffers[0].translateY = this.initialScroll - this.bufferHeight;
		this.buffers[1].translateY = this.initialScroll;

		for (const buffer of this.buffers)
			buffer.style.transform = `translate3d(0, ${ buffer.translateY }px, 0)`;

		this.buffers[0].updated = false;
		this.buffers[1].updated = false;

		this.updateClones(true);
		this.debounceUpdateClones();

		this.scrollDisabled = false;
	}

	protected createPool() {
		const container = this.getBoundingClientRect();
		let id = 0;

		for (const buffer of this.buffers) {
			for (let i = 0; i < this.bufferSize; i++) {
				const slotName = `infinite-scroller-item-content-${ id++ }`;

				const itemWrapper = document.createElement('div') as ItemWrapperElement;
				itemWrapper.setAttribute('slot', slotName);
				itemWrapper.instance = {} as HTMLElement;

				const slot = document.createElement('slot') as SlotElement;
				slot._itemWrapper = itemWrapper;
				slot.setAttribute('name', slotName);

				buffer.appendChild(slot);
				this.appendChild(itemWrapper);

				// Only stamp the visible instances first
				if (this.isVisible(itemWrapper, container))
					this.ensureStampedInstance(itemWrapper);
			}
		}

		requestAnimationFrame(() => this.finishInit());
	}

	protected ensureStampedInstance(itemWrapper: ItemWrapperElement) {
		if (itemWrapper.firstElementChild)
			return;

		const tmpInstance = itemWrapper.instance;

		itemWrapper.instance = this.createElement();
		itemWrapper.style.display = 'contents';
		itemWrapper.appendChild(itemWrapper.instance);

		for (const prop of Object.keys(tmpInstance))
			itemWrapper.instance[prop] = tmpInstance[prop]!;
	}

	protected updateClones(viewPortOnly?: boolean) {
		this.firstIndex = ~~((this.buffers[0].translateY - this.initialScroll) / this.itemHeight)
			+ this.initialIndex;

		const scrollerRect = viewPortOnly
			? this.scrollerQry.getBoundingClientRect()
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

	protected handleScrollMousedown(ev: MouseEvent) {
		ev.preventDefault();

		const rect = this.thumbQry.getBoundingClientRect();
		const offsetY = ev.y - rect.y;

		const mousemove = (ev: MouseEvent) => {
			const rect = this.thumbQry.getBoundingClientRect();
			const distance = ev.y - rect.y - offsetY;

			const itemLength = this.maxIndex! - this.minIndex!;
			const contentHeight = this.itemHeight * itemLength;
			const viewportHeight = this.offsetHeight;

			const viewableRatio = viewportHeight / contentHeight;    // 1/3 or 0.333333333n
			const scrollBarArea = viewportHeight * 2;                // 150px
			const thumbHeight = scrollBarArea * viewableRatio;       // 50px

			const scrollTrackSpace = contentHeight - viewportHeight; // (600 - 200) = 400
			const scrollThumbSpace =  viewportHeight - thumbHeight;  // (200 - 50) = 150
			const scrollJump = scrollTrackSpace / scrollThumbSpace;  // (400 / 150 ) = 2.666666666666667

			const jumpDistance = scrollJump * distance;
			const positionChange = jumpDistance / this.itemHeight;
			this.position = Math.max(0, this.position + positionChange);
		};
		const mouseup = () => {
			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('mouseup', mouseup);
		};

		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
	}

	protected override render(): unknown {
		return html`
		<div id="scroller">
			<div class="buffer"></div>
			<div class="buffer"></div>
			<div id="fullHeight"></div>
		</div>
		${ when(this.minIndex !== undefined && this.maxIndex !== undefined, () => html`
		<s-scroll-bar>
			<s-scroll-thumb
				@mousedown=${ this.handleScrollMousedown }
			></s-scroll-thumb>
		</s-scroll-bar>
		`) }
		`;
	}

	public static override styles: CSSResultGroup = css`
		:host {
			--_infinite-scroller-item-height: 100px;
			--_infinite-scroller-buffer-width: 100%;
			--_infinite-scroller-buffer-offset: 0;
			--_infinite-scroller-thumb: rgb(80 80 80 / 50%);

			overflow: hidden;
			position: relative;
			display: grid;
			grid-template-columns: 1fr auto;
		}
		s-scroll-bar {
			display: block;
			width: 16px;
		}
		s-scroll-thumb {
			position: absolute;
			display: block;
			width: 100%;
			background-color: var(--_infinite-scroller-thumb);
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

			display: grid;
			grid-auto-rows: var(--_infinite-scroller-item-height);
		}
		@keyframes fadein {
			from { opacity: 0; }
			to { opacity: 1; }
		}
	`;

}


export const isFirefox = /Firefox/u.test(navigator.userAgent);
