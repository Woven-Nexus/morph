export interface Panel {
	minWidth: number;
	maxWidth: number;
	width: number;
}


export class PanelResizer<T extends Panel> {

	protected controller: AbortController;
	protected leftPanel?: T;
	protected rightPanel?: T;
	protected previousX = 0;

	constructor(
		protected panels: T[],
		protected elements: () => (NodeListOf<HTMLElement> | HTMLElement[]),
		protected identifier: (panel?: T) => string,
		protected requestUpdate: () => void,
		protected totalWidth?: () => number,
	) { }

	public mousedown = (ev: MouseEvent) => {
		ev.preventDefault();
		this.previousX = ev.clientX;

		const target = ev.target as HTMLElement;
		const leftPanelId = target.dataset['leftPanelId'] ?? '';
		const rightPanelId = target.dataset['rightPanelId'] ?? '';

		this.leftPanel = this.panels.find(p => this.identifier(p) === leftPanelId);
		this.rightPanel = this.panels.find(p => this.identifier(p) === rightPanelId);

		this.controller = new AbortController();
		window.addEventListener('mousemove', this.mousemove, { signal: this.controller.signal });
		window.addEventListener('mouseup', this.mouseup, { signal: this.controller.signal });
	};

	protected mouseup = () => {
		this.controller.abort();
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

		this.constrainTotalWidth();
		this.onResize?.();

		this.previousX = ev.clientX;
		this.requestUpdate();
	};

	public constrainTotalWidth() {
		if (this.totalWidth === undefined)
			return;

		const currentWidth = this.panels.reduce((acc, cur) => acc += cur.width, 0);
		const totalWidth = this.totalWidth();

		// If there is a minimum total width required, spread the extra missing width from Left to right
		if (currentWidth < totalWidth) {
			let remainingWidth = totalWidth - currentWidth;

			for (const panel of this.panels) {
				if (remainingWidth <= 0)
					break;

				const before = panel.width;
				panel.width = this.validateWidth(panel, panel.width + remainingWidth);
				const diff = panel.width - before;
				remainingWidth -= diff;
			}
		}

		// If there is a maximum width required, remove the extra width from right to left.
		if (currentWidth > totalWidth) {
			let excessWidth = currentWidth - totalWidth;

			for (const panel of this.panels.toReversed()) {
				if (excessWidth <= 0)
					break;

				const before = panel.width;
				panel.width = this.validateWidth(panel, panel.width - excessWidth);
				const diff = before - panel.width;
				excessWidth -= diff;
			}
		}
	}

	public onResize?(): void;

	protected findLeftTarget(initialPanel: T) {
		const elements = this.elements();
		const initialIndex = this.findInitialIndex(initialPanel);

		let panel: T | undefined;
		for (let i = initialIndex; i >= -1; i--) {
			const element = elements[i];
			panel = this.panels.find(p => this.identifier(p) === element?.id);
			if (!panel || panel.width > panel.minWidth)
				break;
		}

		return panel;
	}

	protected findRightTarget(initialPanel: T) {
		const elements = this.elements();
		const initialIndex = this.findInitialIndex(initialPanel);

		let panel: T | undefined;
		for (let i = initialIndex; i < elements.length + 1; i++) {
			const element = elements[i];
			panel = this.panels.find(p => this.identifier(p) === element?.id);
			if (!panel || panel.width > panel.minWidth)
				break;
		}

		return panel;
	}

	protected validateWidth(panel: T, width: number) {
		return Math.max(Math.min(panel.maxWidth, width), panel.minWidth);
	}

	protected findInitialIndex(panel: T) {
		const elements = this.elements();
		const panelId = this.identifier(panel);

		let initialIndex = -1;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i]!;
			if (element.id === panelId) {
				initialIndex = i;
				break;
			}
		}

		return initialIndex;
	}

}
