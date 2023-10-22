import { roundToNearest } from '../../app/round-to-nearest.js';

interface Panel {
	minWidth: number;
	maxWidth: number;
	width: number;
}


export class PanelResizer<T extends Panel> {

	protected leftPanel?: T;
	protected rightPanel?: T;
	protected previousX = 0;

	constructor(
		protected panels: T[],
		protected identifier: (panel?: T) => string,
		protected getElementById: (id: string) => (HTMLElement | null),
		protected requestUpdate: () => void,
	) { }

	public mousedown = (ev: MouseEvent) => {
		ev.preventDefault();
		this.previousX = ev.clientX;

		const target = ev.target as HTMLElement;

		const leftPanelId = target.dataset['panelId']!;
		this.leftPanel = this.panels.find(p => this.identifier(p) === leftPanelId);

		const leftPanelIndex = this.panels.findIndex(p => this.identifier(p) === leftPanelId)!;
		this.rightPanel = this.panels[leftPanelIndex + 1];

		window.addEventListener('mousemove', this.mousemove);
		window.addEventListener('mouseup', this.mouseup);
	};

	protected mousemove = (ev: MouseEvent) => {
		const absDistance = Math.abs(ev.clientX - this.previousX);
		const direction = ev.clientX > this.previousX ? 'right' : 'left';
		if (absDistance === 0)
			return;

		if (direction === 'left') {
			let overflow = false;
			let rightModifier = 0;
			let leftWidth = 0;
			let rightWidth = 0;
			let leftTarget: T | undefined;

			if (this.rightPanel && this.rightPanel.width >= this.rightPanel.maxWidth)
				return;

			if (this.leftPanel) {
				leftTarget = this.findLeftTarget(this.leftPanel);
				if (!leftTarget)
					return;

				const distance = !this.rightPanel ? absDistance * 2 : absDistance;
				const expectedWidth = leftTarget.width - distance;
				const actualWidth = this.validateWidth(leftTarget, expectedWidth);

				rightModifier = expectedWidth - actualWidth;
				leftWidth = actualWidth;
			}

			if (this.rightPanel) {
				const expectedWidth = this.rightPanel.width + absDistance + rightModifier;
				const actualWidth = this.validateWidth(this.rightPanel, expectedWidth);
				overflow = !!(expectedWidth - actualWidth);
				rightWidth = actualWidth;
			}

			if (overflow)
				return;
			if (leftTarget)
				leftTarget.width = leftWidth;
			if (this.rightPanel)
				this.rightPanel.width = rightWidth;
		}
		else if (direction === 'right') {
			let overflow = false;
			let leftModifier = 0;
			let leftWidth = 0;
			let rightWidth = 0;
			let rightTarget: T | undefined;

			if (this.leftPanel && this.leftPanel.width >= this.leftPanel.maxWidth)
				return;

			if (this.rightPanel) {
				rightTarget = this.findRightTarget(this.rightPanel);
				if (!rightTarget)
					return;

				const expectedWidth = rightTarget.width - absDistance;
				const actualWidth = this.validateWidth(rightTarget, expectedWidth);

				leftModifier = expectedWidth - actualWidth;
				rightWidth = actualWidth;
			}

			if (this.leftPanel) {
				const distance = !this.rightPanel ? absDistance * 2 : absDistance;
				const expectedWidth = this.leftPanel.width + distance + leftModifier;
				const actualWidth = this.validateWidth(this.leftPanel, expectedWidth);
				overflow = !!(expectedWidth - actualWidth);
				leftWidth = actualWidth;
			}

			if (overflow)
				return;
			if (rightTarget)
				rightTarget.width = rightWidth;
			if (this.leftPanel)
				this.leftPanel.width = leftWidth;
		}

		this.previousX = ev.clientX;
		this.requestUpdate();
	};

	protected mouseup = () => {
		window.removeEventListener('mousemove', this.mousemove);
		window.removeEventListener('mouseup', this.mouseup);
	};

	protected findLeftTarget(initialPanel: T) {
		const stack: T[] = [];
		for (let i = this.panels.indexOf(initialPanel); i >= -1; i--) {
			const panel = this.panels[i]!;
			if (!panel)
				return;

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

		return panel;
	}

	protected findRightTarget(initialPanel: T) {
		const stack: T[] = [];
		for (let i = this.panels.indexOf(initialPanel); i < this.panels.length + 1; i++) {
			const panel = this.panels[i]!;
			if (!panel)
				return;

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

		return panel;
	}

	protected validateWidth(panel: T, width: number) {
		return Math.max(Math.min(panel.maxWidth, width), panel.minWidth);
	}

}
