import { roundToNearest } from '../../app/round-to-nearest.js';

interface Panel {
	minWidth: number;
	maxWidth: number;
	width: number;
}


export class PanelResizer<T extends Panel> {

	protected offsetLeft = 0;
	protected offsetRight = 0;
	protected spacerWidth = 0;
	protected leftPanel?: T;
	protected leftPanelId: string;
	protected rightPanelId: string;
	protected rightPanel?: T;
	protected leftPanelEl?: HTMLElement;
	protected rightPanelEl?: HTMLElement;
	protected targetLeftPanel?: HTMLElement;
	protected targetRightPanel?: HTMLElement;

	constructor(
		protected panels: T[],
		protected identifier: (panel?: T) => string,
		protected getElementById: (id: string) => (HTMLElement | null),
		protected requestUpdate: () => void,
	) { }

	public mousedown = (ev: MouseEvent) => {
		ev.preventDefault();

		const target = ev.target as HTMLElement;
		this.spacerWidth = target.getBoundingClientRect().width;

		const leftPanelId = target.dataset['panelId']!;
		this.leftPanel = this.panels.find(p => this.identifier(p) === leftPanelId);
		this.leftPanelId = this.identifier(this.leftPanel);

		const leftPanelIndex = this.panels.findIndex(p => this.identifier(p) === leftPanelId)!;
		this.rightPanel = this.panels[leftPanelIndex + 1];
		this.rightPanelId = this.identifier(this.rightPanel);

		this.leftPanelEl = this.getElementById(leftPanelId) ?? undefined;
		if (this.leftPanelEl)
			this.offsetLeft = ev.clientX - this.leftPanelEl.getBoundingClientRect().right;

		this.rightPanelEl = this.getElementById(this.rightPanelId) ?? undefined;
		if (this.rightPanelEl)
			this.offsetRight = this.rightPanelEl.getBoundingClientRect().left - ev.clientX;

		window.addEventListener('mousemove', this.mousemove);
		window.addEventListener('mouseup', this.mouseup);
	};

	protected mousemove = (ev: MouseEvent) => {
		const originalWidth = this.panels.reduce((acc, cur) => acc += cur.width, 0);
		const newLeftWidth = this.getSuggestedLeftWidth(ev.clientX);
		const newRightWidth = this.getSuggestedRightWidth(ev.clientX);

		// Terminate resize if left or right exceeds maximum width.
		if ((newLeftWidth ?? 0) > (this.leftPanel?.maxWidth ?? Infinity) ||
			(newRightWidth ?? 0) > (this.rightPanel?.maxWidth ?? Infinity))
			return;

		if (newLeftWidth !== undefined && this.leftPanel) {
			if (newLeftWidth <= this.leftPanel.minWidth) {
				this.leftPanel.width = this.leftPanel.minWidth;

				const target = this.findLeftTarget(this.leftPanel);
				if (!target)
					return;

				const { panel, panelEl, panelRect, offset } = target;

				//console.log(panelEl);

				const nextLeftWidth = Math.round(ev.clientX - panelRect.left - offset);
				panel.width = this.validateWidth(panel, nextLeftWidth);

				const newTotalWidth = this.panels.reduce((acc, cur) => acc += cur.width, 0);
				if (this.rightPanel && newTotalWidth !== originalWidth) {
					const diff = newTotalWidth - originalWidth;
					const nextPanelBefore = panel.width;
					panel.width = this.validateWidth(panel, panel.width - diff);
					console.log('why!?', panel.width);


					const nextPanelDiff = panel.width - nextPanelBefore;
					const remainingDiff = diff - nextPanelDiff;

					this.rightPanel.width = this.validateWidth(this.rightPanel, this.rightPanel.width - remainingDiff);
				}

				return this.requestUpdate();
			}
			else {
				this.leftPanel.width = newLeftWidth;
			}
		}

		if (newRightWidth !== undefined && this.rightPanel) {
			if (newRightWidth <= this.rightPanel.minWidth) {
				this.rightPanel.width = this.rightPanel.minWidth;

				// Find which panel to perform resizing on.
				const target = this.findRightTarget(this.rightPanel);
				if (!target)
					return;

				const { panel, panelRect, offset } = target;

				// Find size to resize panel to, using same equation as previously.
				const nextRightWidth = Math.round(panelRect.right - (ev.clientX + offset));

				// Make sure the size does not exceed min/max.
				panel.width = this.validateWidth(panel, nextRightWidth);

				// Check if new combined width exceeds old combined with.
				// If it does, remove the extra from the right side.
				const newTotalWidth = this.panels.reduce((acc, cur) => acc += cur.width, 0);
				if (this.leftPanel && newTotalWidth !== originalWidth) {
					const diff = newTotalWidth - originalWidth;

					const nextPanelBefore = panel.width;
					panel.width = this.validateWidth(panel, panel.width - diff);
					const nextPanelDiff = panel.width - nextPanelBefore;
					const remainingDiff = diff - nextPanelDiff;

					this.leftPanel.width -= remainingDiff;
				}

				return this.requestUpdate();
			}
			else {
				this.rightPanel.width = newRightWidth;
			}
		}

		this.requestUpdate();
	};

	protected mouseup = () => {
		window.removeEventListener('mousemove', this.mousemove);
		window.removeEventListener('mouseup', this.mouseup);
	};

	protected getSuggestedLeftWidth(cursorX: number) {
		if (!this.leftPanelEl || !this.leftPanel)
			return;

		const leftRect = this.leftPanelEl.getBoundingClientRect();
		const leftWidth = Math.round(cursorX - leftRect.left - this.offsetLeft);
		const newLeftWidth = Math.max(Math.min(this.leftPanel.maxWidth, leftWidth), this.leftPanel.minWidth);

		console.log({ leftWidth });


		return newLeftWidth;
	}

	protected getSuggestedRightWidth(cursorX: number) {
		if (!this.rightPanelEl || !this.rightPanel)
			return;

		const rightRect = this.rightPanelEl.getBoundingClientRect();
		const rightWidth = Math.round(rightRect.right - cursorX - this.offsetRight);
		const newRightWidth = Math.max(Math.min(this.rightPanel.maxWidth, rightWidth), this.rightPanel.minWidth);

		return newRightWidth;
	}

	protected findLeftTarget(initialPanel: T) {
		const stack: T[] = [];

		for (let i = this.panels.indexOf(initialPanel); i > 0; i--) {
			const panel = this.panels[i]!;
			if (panel.width <= panel.minWidth) {
				stack.push(panel);
				continue;
			}

			stack.push(panel);
			break;
		}

		const panel = stack.pop();
		if (!panel)
			return;

		const panelId = this.identifier(panel);
		const panelEl = this.getElementById(panelId)!;
		const panelRect = panelEl.getBoundingClientRect();

		const offset = this.offsetRight + (
			stack.reduce((acc, cur) => acc += cur.width, 0)
			+ stack.length * this.spacerWidth
		);

		return { panel, stack, panelId, panelEl, panelRect, offset };
	}

	protected findRightTarget(initialPanel: T) {
		const stack: T[] = [];
		for (let i = this.panels.indexOf(initialPanel); i < this.panels.length; i++) {
			const panel = this.panels[i]!;
			if (panel.width <= panel.minWidth) {
				stack.push(panel);
				continue;
			}

			stack.push(panel);
			break;
		}

		const panel = stack.pop();
		if (!panel)
			return;

		const panelId = this.identifier(panel);
		const panelEl = this.getElementById(panelId)!;
		const panelRect = panelEl.getBoundingClientRect();

		const offset = this.offsetRight + (
			stack.reduce((acc, cur) => acc += cur.width, 0)
			+ stack.length * this.spacerWidth
		);

		return { panel, stack, panelId, panelEl, panelRect, offset };
	}

	protected validateWidth(panel: T, width: number) {
		return Math.max(Math.min(panel.maxWidth, width), panel.minWidth);
	}

}
