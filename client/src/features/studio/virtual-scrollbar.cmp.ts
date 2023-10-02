import { debounce } from '@roenlie/mimic-core/timing';
import { watch } from '@roenlie/mimic-lit/decorators';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { eventOptions, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { queryId } from '../../app/queryId.js';
import { sharedStyles } from '../styles/shared-styles.js';


@customElement('m-virtual-scrollbar')
export class VirtualScrollbar extends MimicElement {

	@property() public placement: 'start' | 'end' = 'end';
	@property() public direction: 'vertical' | 'horizontal' = 'horizontal';
	@property({ type: Object }) public reference: HTMLElement;
	@state() protected show = false;
	@queryId('scrollbar') protected scrollbarEl: HTMLElement;

	protected resetScrollOrigin = debounce(() => this.scrollOrigin = undefined, 50);
	protected scrollOrigin?: 'reference' | 'scrollbar' = undefined;
	protected unlistenReference?: () => void;

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();
		this.unlistenReference?.();
	}

	@watch('reference') protected onReference() {
		if (!this.reference)
			return;

		this.unlistenReference?.();

		const pointerMoveListener = (ev: PointerEvent) => {
			const path = ev.composedPath();
			const pathHasReference = path.some(el => el === this.reference);
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

			const ref = this.reference;
			const scrollbar = this.scrollbarEl;
			if (!scrollbar || !ref)
				return;

			scrollbar.scrollLeft = ref.scrollLeft;
			scrollbar.scrollTop = ref.scrollTop;
			this.requestUpdate();
		};

		this.reference.addEventListener('scroll', scrollListener);
		this.reference.addEventListener('pointerenter', pointerEnterListener);

		this.unlistenReference = () => {
			this.reference.removeEventListener('scroll', scrollListener);
			this.reference.removeEventListener('pointerenter', pointerEnterListener);
			this.reference.removeEventListener('pointermove', pointerMoveListener);
		};
	}

	@eventOptions({ passive: true })
	protected onScrollbarScroll() {
		if (this.scrollOrigin === 'reference')
			return;

		this.scrollOrigin = 'scrollbar';
		this.resetScrollOrigin();

		const scrollbar = this.scrollbarEl;
		if (!scrollbar || !this.reference)
			return;

		this.reference.scrollLeft = scrollbar.scrollLeft;
		this.reference.scrollTop = scrollbar.scrollTop;
		this.requestUpdate();
	}

	protected override render(): unknown {
		const reference = this.reference;
		const scrollbarStyles: Record<string, string | number> = {};
		const scrollthumbStyles: Record<string, string | number> = {};

		if (this.direction === 'vertical') {
			const scrollContainerTop = (reference?.scrollTop ?? 0) + 'px';
			const scrollContainerHeight = (reference?.offsetHeight ?? 0) + 'px';
			const scrollbarHeight = (reference?.scrollHeight ?? 0) + 'px';

			scrollbarStyles['top'] = scrollContainerTop;
			scrollbarStyles['bottom'] = 0;
			scrollbarStyles['height'] = scrollContainerHeight;

			scrollthumbStyles['height'] = scrollbarHeight;

			if (this.placement === 'start')
				scrollbarStyles['left'] = 0;

			if (this.placement === 'end')
				scrollbarStyles['right'] = 0;
		}

		if (this.direction === 'horizontal') {
			const scrollContainerLeft = (reference?.scrollLeft ?? 0) + 'px';
			const scrollContainerWidth = (reference?.offsetWidth ?? 0) + 'px';
			const scrollbarWidth = (reference?.scrollWidth ?? 0) + 'px';

			scrollbarStyles['left'] = scrollContainerLeft;
			scrollbarStyles['right'] = 0;
			scrollbarStyles['width'] = scrollContainerWidth;

			scrollthumbStyles['width'] = scrollbarWidth;

			if (this.placement === 'start')
				scrollbarStyles['top'] = 0;
			if (this.placement === 'end')
				scrollbarStyles['bottom'] = 0;
		}

		return html`
		<s-scrollbar
			id="scrollbar"
			style=${ styleMap(scrollbarStyles) }
			class=${ classMap({ show: this.show }) }
			@scroll=${ this.onScrollbarScroll }
			@mousedown=${ (ev: Event) => ev.preventDefault() }
		>
			<s-scrollthumb style=${ styleMap(scrollthumbStyles) }
			></s-scrollthumb>
		</s-scrollbar>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			position: relative;
			display: contents;
		}
		:host([direction="vertical"]) s-scrollbar {
			overflow-x: hidden;
			overflow-y: scroll;
		}
		:host([direction="vertical"]) s-scrollthumb {
			width: 1px;
		}
		s-scrollbar {
			cursor: grab;
			display: block;
			position: absolute;
			overflow-x: scroll;
			opacity: 0;
			transition: opacity 0.2s ease-out;
		}
		s-scrollbar.show {
			opacity: 1;
		}
		s-scrollbar:active {
			cursor: grabbing;
		}
		s-scrollbar::-webkit-scrollbar {
			height: 6px;
			width: 6px;
		}
		s-scrollbar::-webkit-scrollbar-thumb {
			border-radius: 1px;
			background: rgb(0 0 0 / 50%);
		}
		s-scrollthumb {
			display: block;
			height: 1px;
		}
		`,
	];

}
