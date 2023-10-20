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
		const rightRect = this.rightPanelEl?.getBoundingClientRect();
		let rerender = false;

		let newLeftWidth = this.leftPanel?.width ?? 0;
		let newRightWidth = this.rightPanel?.width ?? 0;

		if (this.leftPanel && this.leftPanelEl) {
			const leftRect = this.leftPanelEl.getBoundingClientRect();
			const leftWidth = Math.round(ev.clientX - leftRect.left - this.offsetLeft);
			newLeftWidth = Math.max(Math.min(this.leftPanel.maxWidth, leftWidth), this.leftPanel.minWidth);

			if (newLeftWidth > this.leftPanel.maxWidth) {
				//console.log('hit maximum width on left panel');
			}
			else if (newLeftWidth <= this.leftPanel.minWidth) {
				//console.log('hit minimum width on left panel');
			}
			else {
				console.log(newLeftWidth);

				this.leftPanel.width = newLeftWidth;
				rerender = true;
			}
		}


		if (this.rightPanel && rightRect && this.offsetRight !== undefined) {
			const rightWidth = Math.round(rightRect.right - ev.clientX - this.offsetRight);
			newRightWidth = Math.max(Math.min(this.rightPanel.maxWidth, rightWidth), this.rightPanel.minWidth);

			if (newRightWidth > this.rightPanel.maxWidth)
				return;

			if (newRightWidth <= this.rightPanel.minWidth) {
				//console.log('hit minimum width on right panel');

				// Find which panel to perform resizing on.
				const panelStack: T[] = [];
				let panelIncr = 0;
				let nextPanel: T | undefined;
				do {
					nextPanel = this.panels[this.panels.indexOf(this.rightPanel) + panelIncr];
					if (nextPanel)
						panelStack.push(nextPanel);

					panelIncr ++;
				} while (nextPanel && Math.round(nextPanel.width) <= nextPanel.minWidth);

				panelStack.pop();

				// Exit if there are no further right panels.
				if (!nextPanel)
					return;

				const nextPanelId = this.identifier(nextPanel);

				// Find the panel by its id, and exit if it does not exist,
				const nextPanelEl = this.getElementById(nextPanelId);
				if (!nextPanelEl)
					return;

				// Use the current skipped panels combined with and x amount of resize spacer
				// widths, plus the previous right offset, to calculate the new offset.
				const nextPanelRect = nextPanelEl?.getBoundingClientRect();

				const offset = this.offsetRight + (
					panelStack.reduce((acc, cur) => acc += cur.width, 0) + panelStack.length
					* this.spacerWidth
				);

				// Find size to resize panel to, using same equation as previously.
				const nextRightWidth = Math.round(nextPanelRect.right - (ev.clientX + offset));
				// Make sure the size does not exceed min/max.
				nextPanel.width = Math.max(Math.min(nextPanel.maxWidth, nextRightWidth), nextPanel.minWidth);

				// Check if new combined width exceeds old combined with.
				// If it does, remove the extra from the right side.
				const newTotalWidth = this.panels.reduce((acc, cur) => acc += cur.width, 0);
				if (newTotalWidth !== originalWidth) {
					const diff = newTotalWidth - originalWidth;
					const nextPanelBefore = nextPanel.width;
					nextPanel.width = Math.max(Math.min(nextPanel.maxWidth, nextPanel.width - diff), nextPanel.minWidth);

					const nextPanelDiff = nextPanel.width - nextPanelBefore;
					const remainingDiff = diff - nextPanelDiff;
					this.leftPanel!.width -= remainingDiff;
				}

				this.requestUpdate();

				return;
			}

			this.rightPanel.width = newRightWidth;
			rerender = true;
		}

		if (rerender)
			this.requestUpdate();
	};

	protected mouseup = () => {
		window.removeEventListener('mousemove', this.mousemove);
		window.removeEventListener('mouseup', this.mouseup);
	};

}
