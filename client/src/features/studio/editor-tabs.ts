import { range } from '@roenlie/mimic-core/array';
import { emitEvent, type EventOf } from '@roenlie/mimic-core/dom';
import { curryDebounce, debounce } from '@roenlie/mimic-core/timing';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, html } from 'lit';
import { eventOptions, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { queryId } from '../../app/queryId.js';
import { sharedStyles } from '../styles/shared-styles.js';


/**
 * @csspart tab - the tab element.
 * @csspart tabs - container for tabs.
 * @fires m-tab-click emitted when clicking on a tab, detail contains the tab key.
 */
@customElement('m-editor-tabs')
export class EditorTabs extends MimicElement {

	@property() public activeTab = '';
	@property({ type: Array }) public tabs: {key: string, value: string}[] = [];
	@property({ reflect: true }) public direction: 'vertical' | 'horizontal' = 'horizontal';
	@property({ reflect: true }) public placement: 'start' | 'end' = 'end';
	@queryId('tabs') protected tabsEl?: HTMLElement;
	@queryId('scrollbar') protected scrollbarEl: HTMLElement;

	protected resizeObs = new ResizeObserver(() => this.requestUpdate());
	protected resetScrollOrigin = debounce(() => this.scrollOrigin = undefined, 50);
	protected scrollOrigin?: 'tabs' | 'scrollbar' = undefined;

	public override connectedCallback(): void {
		super.connectedCallback();
		this.resizeObs.observe(this);
	}

	protected onTabClick(ev: EventOf) {
		const tab = (ev.composedPath() as HTMLElement[])
			.find(el => el.tagName === 'S-TAB');

		emitEvent(this, 'm-tab-click', { detail: tab?.id });
	}

	protected onTabWheel(ev: WheelEvent) {
		if (this.direction === 'vertical')
			return;

		const scrollbar = this.scrollbarEl;
		if (scrollbar) {
			ev.preventDefault();
			scrollbar.scrollLeft += ev.deltaY;
		}
	}

	@eventOptions({ passive: true })
	protected onTabScroll() {
		if (this.scrollOrigin === 'scrollbar')
			return;

		this.scrollOrigin = 'tabs';
		this.resetScrollOrigin();

		const tabs = this.tabsEl, scrollbar = this.scrollbarEl;
		if (!scrollbar || !tabs)
			return;

		scrollbar.scrollLeft = tabs.scrollLeft;
		scrollbar.scrollTop = tabs.scrollTop;
		this.requestUpdate();
	}

	@eventOptions({ passive: true })
	protected onScrollbarScroll() {
		if (this.scrollOrigin === 'tabs')
			return;

		this.scrollOrigin = 'scrollbar';
		this.resetScrollOrigin();

		const tabs = this.tabsEl, scrollbar = this.scrollbarEl;
		if (!scrollbar || !tabs)
			return;

		tabs.scrollLeft = scrollbar.scrollLeft;
		tabs.scrollTop = scrollbar.scrollTop;
		this.requestUpdate();
	}

	protected override render(): unknown {
		const tabsEl = this.tabsEl;
		const scrollbarStyles: Record<string, string | number> = {};
		const scrollthumbStyles: Record<string, string | number> = {};

		if (this.direction === 'vertical') {
			const scrollContainerTop = (tabsEl?.scrollTop ?? 0) + 'px';
			const scrollContainerHeight = (tabsEl?.offsetHeight ?? 0) + 'px';
			const scrollbarHeight = (tabsEl?.scrollHeight ?? 0) + 'px';

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
			const scrollContainerLeft = (tabsEl?.scrollLeft ?? 0) + 'px';
			const scrollContainerWidth = (tabsEl?.offsetWidth ?? 0) + 'px';
			const scrollbarWidth = (tabsEl?.scrollWidth ?? 0) + 'px';

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
		<s-tabs
			part="tabs"
			id="tabs"
			@wheel=${ this.onTabWheel }
			@scroll=${ this.onTabScroll }
		>
			<s-scrollbar
				id="scrollbar"
				style=${ styleMap(scrollbarStyles) }
				@scroll=${ this.onScrollbarScroll }
				@mousedown=${ (ev: Event) => ev.preventDefault() }
			>
				<s-scrollthumb
					style=${ styleMap(scrollthumbStyles) }
				></s-scrollthumb>
			</s-scrollbar>

			${ map(this.tabs, ({ key, value }) => html`
			<s-tab
				part="tab"
				id=${ key }
				class=${ classMap({ active: key === this.activeTab }) }
				@click=${ this.onTabClick }
			>
				<span>${ value }</span>
			</s-tab>
			`) }
		</s-tabs>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			--_border-top:            var(--m-border-top,           initial);
			--_border-right:          var(--m-border-right,         initial);
			--_border-bottom:         var(--m-border-bottom,        initial);
			--_border-left:           var(--m-border-left,          initial);
			--_tab-background:        var(--m-tab-background,       initial);
			--_active-border-top:     var(--m-active-border-top,    initial);
			--_active-border-right:   var(--m-active-border-right,  initial);
			--_active-border-bottom:  var(--m-active-border-bottom, initial);
			--_active-border-left:    var(--m-active-border-left,   initial);
			--_active-tab-background: var(--m-active-tab-background,initial);
		}
		`,
		css`
		:host([direction="vertical"]) s-tabs {
			grid-auto-flow: row;
			overflow-x: hidden;
			overflow-y: scroll;
			min-width: 100px;
		}
		:host([direction="vertical"]) s-scrollbar {
			overflow-x: hidden;
			overflow-y: scroll;
		}
		:host([direction="vertical"]) s-scrollthumb {
			width: 1px;
		}
		:host([direction="vertical"]) s-tab {
			margin-bottom: -3px;
		}
		:host([direction="vertical"]) s-tab:first-of-type {
			border-top: none;
		}
		:host([direction="vertical"]) s-tab:last-of-type {
			border-bottom: none;
		}
		:host([direction="horizontal"]) s-tab {
			margin-right: -3px;
		}
		:host([direction="horizontal"]) s-tab:first-of-type {
			border-left: none;
		}
		:host([direction="horizontal"]) s-tab:last-of-type {
			border-right: none;
		}
		:host {
			overflow: hidden;
			display: grid;
		}
		s-tabs {
			position: relative;
			display: grid;
			grid-auto-flow: column;
			grid-auto-rows: max-content;
			grid-auto-columns: max-content;
			min-height: 40px;
			font-size: 12px;
			overflow: hidden;
			overflow-x: scroll;
		}
		s-tabs::-webkit-scrollbar {
			display: none;
		}
		s-scrollbar {
			cursor: grab;
			display: block;
			position: absolute;
			overflow-x: scroll;
			opacity: 0;
			transition: opacity 0.2s ease-out;
		}
		s-scrollbar:active {
			cursor: grabbing;
		}
		s-tabs:hover s-scrollbar {
			opacity: 1;
		}
		s-scrollbar::-webkit-scrollbar {
			height: 4px;
			width: 4px;
		}
		s-scrollthumb {
			display: block;
			height: 1px;
		}
		s-tab {
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			padding-inline: 8px;
			height: 40px;
			min-width: 100px;
			max-width: 150px;
			overflow: hidden;
			border-top: var(--_border-top);
			border-right: var(--_border-right);
			border-bottom: var(--_border-bottom);
			border-left: var(--_border-left);
			background-color: var(--_tab-background);
		}
		s-tab span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		s-tab.active {
			border-top: var(--_active-border-top);
			border-right: var(--_active-border-right);
			border-bottom: var(--_active-border-bottom);
			border-left: var(--_active-border-left);
			background-color: var(--_active-tab-background);
		}
		`,
	];

}