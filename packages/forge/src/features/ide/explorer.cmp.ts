import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';
import explorerStyles from './explorer.css' with { type: 'css' };
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { MMButton } from '@roenlie/mimic-elements/button';
import { ExaccordianCmp } from './exaccordian.cmp.js';
import { MMTooltip } from '@roenlie/mimic-elements/tooltip';

MMIcon.register();
MMButton.register();
MMTooltip.register();
ExaccordianCmp.register();

@customElement('m-explorer')
export class ExplorerCmp extends AegisElement {
	protected override render(): unknown {
		return html`
		<s-explorer-header>
			<span>
				EXPLORER
			</span>
			<mm-button
				type="icon"
				variant="text"
				size="small"
				shape="rounded"
			>
				<mm-icon
					style="font-size:18px;"
					url="https://icons.getbootstrap.com/assets/icons/three-dots.svg"
				></mm-icon>
			</mm-button>
		</s-explorer-header>
		<m-exaccordian
			header="files"
			.actions=${[
				{
					label: 'New File...',
					icon: 'https://icons.getbootstrap.com/assets/icons/file-earmark-plus.svg',
					action: () => {},
				},
				{
					label: 'New Folder...',
					icon: 'https://icons.getbootstrap.com/assets/icons/folder-plus.svg',
					action: () => {},
				},
				{
					label: 'Collapse Folders in Explorer',
					icon: 'https://icons.getbootstrap.com/assets/icons/dash-square.svg',
					action: () => {},
				},
			]}
		></m-exaccordian>
		`;
	}
	public static override styles = [sharedStyles, explorerStyles];
}

