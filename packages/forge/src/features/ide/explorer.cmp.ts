import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { html } from 'lit';
import explorerStyles from './explorer.css' with { type: 'css' };
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { MMButton } from '@roenlie/mimic-elements/button';
import { ExaccordianCmp } from './exaccordian.cmp.js';
import { MMTooltip } from '@roenlie/mimic-elements/tooltip';
import { ForgeFileDB, ForgeFile } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';

MMIcon.register();
MMButton.register();
MMTooltip.register();
ExaccordianCmp.register();

@customElement('m-explorer')
export class ExplorerCmp extends AegisElement {
	@state() protected files: ForgeFile[] = [];

	public override async connectedCallback() {
		super.connectedCallback();

		this.files = await MimicDB.connect(ForgeFileDB)
			.collection(ForgeFile)
			.getAll();
	}

	protected async handleFilesFocusout() {
		const collection = MimicDB.connect(ForgeFileDB).collection(ForgeFile);
		const files = this.files.filter(file => file.editing && file.name);

		await Promise.all(
			files.map(async file => {
				file.editing = false;
				await collection.add(file);
			}),
		);

		this.files = await collection.getAll();
	}

	protected handleNewFile() {
		this.files = [
			...this.files,
			ForgeFile.create({
				content: '',
				directory: '',
				extension: '',
				name: '',
				editing: true,
			}),
		];
	}

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
			expanded
			header="files"
			.actions=${[
				{
					label: 'New File...',
					icon: 'https://icons.getbootstrap.com/assets/icons/file-earmark-plus.svg',
					action: () => this.handleNewFile(),
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
			.items=${this.files}
			@input-focusout=${this.handleFilesFocusout}
		></m-exaccordian>
		`;
	}
	public static override styles = [sharedStyles, explorerStyles];
}

