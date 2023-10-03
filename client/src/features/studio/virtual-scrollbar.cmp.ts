import { isPromise } from '@roenlie/mimic-core/async';
import { debounce } from '@roenlie/mimic-core/timing';
import { watch } from '@roenlie/mimic-lit/decorators';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { eventOptions, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { queryId } from '../../app/queryId.js';
import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-virtual-scrollbar')
export class VirtualScrollbar extends MimicElement {

	@property() public placement: 'start' | 'end' = 'end';
	@property() public direction: 'vertical' | 'horizontal' = 'horizontal';
	@property({ type: Object }) public reference: HTMLElement | Promise<HTMLElement>;
	@state() protected resolvedRef?: HTMLElement;
	@state() protected show = false;
	@queryId('thumb') protected thumbEl: HTMLElement;
	@queryId('scrollbar') protected scrollbarEl: HTMLElement;
	@queryId('scrollbar-wrapper') protected wrapperEl: HTMLElement;

	protected resetScrollOrigin = debounce(() => this.scrollOrigin = undefined, 50);
	protected scrollOrigin?: 'reference' | 'scrollbar' = undefined;
	protected unlistenReference?: () => void;

	protected readonly resizeObs = new ResizeObserver(([ entry ]) => {
		if (!entry)
			return;

		const reference = this.resolvedRef;
		const wrapper = this.wrapperEl;
		const scrollbar = this.scrollbarEl;
		if (!reference || !wrapper || !scrollbar)
			return;

		if (this.direction === 'vertical') {
			wrapper.style.height = (reference?.offsetHeight ?? 0) + 'px';
			scrollbar.style.height = (reference?.scrollHeight ?? 0) + 'px';
		}

		if (this.direction === 'horizontal') {
			wrapper.style.width = (reference?.offsetWidth ?? 0) + 'px';
			scrollbar.style.width = (reference?.scrollWidth ?? 0) + 'px';
		}
	});

	public override disconnectedCallback() {
		super.disconnectedCallback();
		this.unlistenReference?.();
		this.resizeObs.disconnect();
	}

	@watch('reference') protected async onReference() {
		if (!this.reference)
			return;

		this.resolvedRef = isPromise(this.reference)
			? await this.reference
			: this.reference;

		const ref = this.resolvedRef;

		this.unlistenReference?.();
		this.resizeObs.disconnect();
		this.resizeObs.observe(this.resolvedRef);

		const pointerMoveListener = (ev: PointerEvent) => {
			const path = ev.composedPath();
			const pathHasReference = path.some(el => el === ref);
			if (!pathHasReference) {
				globalThis.removeEventListener('pointermove', pointerMoveListener);
				this.show = false;

				return;
			}

			this.show = true;
		};

		const pointerEnterListener = () => {
			globalThis.removeEventListener('pointermove', pointerMoveListener);
			globalThis.addEventListener('pointermove', pointerMoveListener);
		};

		const scrollListener = () => {
			if (this.scrollOrigin === 'scrollbar')
				return;

			this.scrollOrigin = 'reference';
			this.resetScrollOrigin();

			const scrollbar = this.wrapperEl;
			const ref = this.resolvedRef;
			if (!scrollbar || !ref)
				return;

			scrollbar.scrollLeft = ref.scrollLeft;
			scrollbar.scrollTop = ref.scrollTop;

			this.syncPosition();
		};

		ref.addEventListener('scroll', scrollListener);
		ref.addEventListener('pointerenter', pointerEnterListener);

		this.unlistenReference = () => {
			ref.removeEventListener('scroll', scrollListener);
			ref.removeEventListener('pointerenter', pointerEnterListener);
			ref.removeEventListener('pointermove', pointerMoveListener);
		};

		if (!ref.querySelector('#scroll-removal')) {
			const scrollRemoval = document.createElement('style');
			scrollRemoval.id = 'scroll-removal';
			scrollRemoval.innerHTML = `
			${ ref.tagName.toLowerCase() }::-webkit-scrollbar {
				display: none;
			}
			`;

			ref.appendChild(scrollRemoval);
		}
	}

	@eventOptions({ passive: true })
	protected onScrollbarScroll() {
		if (this.scrollOrigin === 'reference')
			return;

		this.scrollOrigin = 'scrollbar';
		this.resetScrollOrigin();

		const scrollbar = this.wrapperEl;
		if (!scrollbar || !this.resolvedRef)
			return;

		if (this.direction === 'horizontal')
			this.resolvedRef.scrollLeft = scrollbar.scrollLeft;
		if (this.direction === 'vertical')
			this.resolvedRef.scrollTop = scrollbar.scrollTop;

		this.syncPosition();
	}

	protected syncPosition() {
		const bar = this.wrapperEl;
		const reference = this.resolvedRef;
		if (!reference || !bar)
			return;

		const x = (reference?.scrollLeft ?? 0) + 'px';
		const y = (reference?.scrollTop ?? 0) + 'px';
		bar.style.translate = x + ' ' + y;
	}

	protected override render() {
		return html`
		<s-scrollbar-wrapper
			id="scrollbar-wrapper"
			class=${ classMap({
				show:             this.show,
				[this.direction]: true,
				[this.placement]: true,
			}) }
			@scroll=${ this.onScrollbarScroll }
			@mousedown=${ (ev: Event) => ev.preventDefault() }
		>
			<s-scrollbar id="scrollbar"></s-scrollbar>
		</s-scrollbar-wrapper>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			position: relative;
			display: contents;
		}
		:host([direction="vertical"]) s-scrollbar-wrapper {
			overflow-x: hidden;
			overflow-y: scroll;
		}
		:host([direction="vertical"]) s-scrollbar {
			width: 0.1px;
		}
		s-scrollbar-wrapper {
			cursor: grab;
			display: block;
			position: absolute;
			overflow-x: scroll;
			opacity: 0;
			transition: opacity 0.2s ease-out;
		}
		s-scrollbar-wrapper.show {
			opacity: 1;
		}
		s-scrollbar-wrapper:active {
			cursor: grabbing;
		}
		s-scrollbar-wrapper::-webkit-scrollbar {
			height: 6px;
			width: 6px;
		}
		s-scrollbar-wrapper::-webkit-scrollbar-thumb {
			border-radius: 1px;
			background: rgb(0 0 0 / 50%);
		}
		s-scrollbar {
			display: block;
			height: 0.1px;
		}
		s-thumb {
			position: absolute;
			display: block;
			background-color: hotpink;
		}
		.vertical s-thumb {
			width: 50px;
		}
		.horizontal s-thumb {
			height: 50px;
		}
		.vertical {
			top: 0;
			bottom: 0;
		}
		.vertical.start {
			left: 0;
		}
		.vertical.end {
			right: 0;
		}
		.horizontal {
			left: 0;
			right: 0;
		}
		.horizontal.start {
			top: 0;
		}
		.horizontal.end {
			bottom: 0;
		}
		`,
	];

}
