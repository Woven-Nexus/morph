// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Signal, signal } from '@lit-labs/preact-signals';
import { debounce } from '@roenlie/mimic-core/timing';
import type { LitElement, ReactiveController } from 'lit';

import { roundToNearest } from '../../../app/round-to-nearest.js';
import { scrollElementTo } from '../../../app/scroll-element-to.js';


export class BoardConfig {

	public tileSize = signal(200);
	public boardSize = signal(30);
	public showHoverOutline = signal(false);
	public hoverGridRow = signal(0);
	public hoverGridColumn = signal(0);
	public abortController = new AbortController;
	public boardHost: LitElement;
	public board?: HTMLElement;

	public get styles() {
		if (!this.board)
			return {};

		return {
			[this.board.tagName.toLowerCase()]: {
				'--_game-size':       this.boardSize.value,
				'--_tile-size':       this.tileSize.value + 'px',
				'--_hover-grid-top':  (this.hoverGridRow.value * this.tileSize.value) + 'px',
				'--_hover-grid-left': (this.hoverGridColumn.value * this.tileSize.value) + 'px',
			},
		};
	}

	public connect(boardHost: LitElement, board: HTMLElement) {
		this.boardHost = boardHost;
		this.board = board;
		this.boardHost.addController(this.controller);
	}

	protected controller: ReactiveController = {
		hostConnected: () => {
			setTimeout(() => this.initialize());
		},
		hostDisconnected: () => {
			this.abortController.abort();
			this.boardHost.removeController(this.controller);
		},
	};

	protected async initialize() {
		this.boardHost.addEventListener('wheel', this.handleZoomWheel, { signal: this.abortController.signal });
		this.boardHost.addEventListener('mousemove', this.handleHoverOutline, { signal: this.abortController.signal });
		this.board?.addEventListener('mousedown', this.handleGameDragToMove, { signal: this.abortController.signal });
		this.boardHost.requestUpdate();

		await this.boardHost.updateComplete;
		this.boardHost.scrollTop = (this.boardHost.scrollHeight - this.boardHost.offsetHeight) / 2 - this.tileSize.value / 2;
		this.boardHost.scrollLeft = (this.boardHost.scrollWidth - this.boardHost.offsetWidth) / 2 - this.tileSize.value / 2;
	}

	protected handleGameDragToMove = (ev: MouseEvent) => {
		ev.preventDefault();
		const previousXY: [number | undefined, number | undefined] = [ undefined, undefined ];
		let xDiff = 0;
		let yDiff = 0;

		const mousemove = (ev: MouseEvent) => {
			if (ev.buttons < 1)
				return mouseup();

			xDiff = previousXY[0] ? ev.clientX - previousXY[0] : 0;
			yDiff = previousXY[1] ? ev.clientY - previousXY[1] : 0;

			previousXY[0] = ev.clientX;
			previousXY[1] = ev.clientY;

			this.boardHost.scrollLeft -= xDiff;
			this.boardHost.scrollTop -= yDiff;
		};

		const mouseup = () => {
			scrollElementTo(this.boardHost, {
				x:        this.boardHost.scrollLeft - (xDiff * 10),
				y:        this.boardHost.scrollTop - (yDiff * 10),
				duration: 300,
			});

			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('mouseup', mouseup);
			previousXY[0] = undefined;
			previousXY[1] = undefined;
			xDiff = 0;
			yDiff = 0;
		};

		window.addEventListener('mousemove', mousemove);
		window.addEventListener('mouseup', mouseup);
	};

	protected handleZoomWheel = async (ev: WheelEvent) => {
		if (!ev.ctrlKey)
			return;

		ev.preventDefault();

		const topScroll = this.boardHost.scrollHeight;
		const leftScroll = this.boardHost.scrollWidth;

		if (ev.deltaY < 0)
			this.tileSize.value = roundToNearest(this.tileSize.value * 1.1, 5);
		else
			this.tileSize.value = roundToNearest(this.tileSize.value * 0.9, 5);

		this.showHoverOutline.value = false;
		this.debounceShowHoverOutline();

		await this.boardHost.updateComplete;

		this.boardHost.scrollTop -= (topScroll - this.boardHost.scrollHeight) / 2;
		this.boardHost.scrollLeft -= (leftScroll - this.boardHost.scrollWidth) / 2;
	};

	protected handleHoverOutline = (ev: MouseEvent) => {
		const boardRect = this.board?.getBoundingClientRect();
		if (!boardRect)
			return;

		const x = ev.clientX - boardRect.x;
		const y = ev.clientY - boardRect.y;
		const rowIndex = Math.floor(y / this.tileSize.value);
		const columnIndex = Math.floor(x / this.tileSize.value);

		this.hoverGridRow.value = rowIndex;
		this.hoverGridColumn.value = columnIndex;
	};

	protected debounceShowHoverOutline = debounce(() => this.showHoverOutline.value = true, 500);


}
