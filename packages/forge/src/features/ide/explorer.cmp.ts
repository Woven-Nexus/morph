import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { MMButton } from '@roenlie/mimic-elements/button';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { MMTooltip } from '@roenlie/mimic-elements/tooltip';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html } from 'lit';
import { join, normalize, parse, sep } from 'posix-path-browser';

import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';
import { ExaccordianCmp } from './exaccordian.cmp.js';
import explorerStyles from './explorer.css' with { type: 'css' };

MMIcon.register();
MMButton.register();
MMTooltip.register();
ExaccordianCmp.register();


@customElement('m-explorer')
export class ExplorerCmp extends AegisElement {

	@state() protected project = 'test';
	@state() protected files: ForgeFile[] = [];

	public override async connectedCallback() {
		super.connectedCallback();

		this.files = (await MimicDB.connect(ForgeFileDB).collection(ForgeFile)
			.getAll())
			.filter(file => file.project === this.project);
	}

	protected async handleFilesFocusout() {
		const collection = MimicDB.connect(ForgeFileDB).collection(ForgeFile);
		const files = this.files.filter(file => file.editing && file.name);
		const fileTransactions: Promise<any>[] = [];

		for (const file of files) {
			const parsed = parse(file.name);
			if (parsed.dir) {
				parsed.dir.split(sep).forEach((dir, i, arr) => {
					if (!dir)
						return;

					const folder = ForgeFile.create({
						project:   this.project,
						directory: join(file.directory, ...arr.slice(0, i)),
						name:      dir,
						extension: '',
						content:   '',
						editing:   false,
					});

					fileTransactions.push(collection.tryAdd(folder));
				});
			}

			if (parsed.ext) {
				file.extension = parsed.ext;
				file.name = parsed.name;
			}

			file.editing = false;
			file.directory =  parsed.dir
				? join(file.directory, parsed.dir)
				: file.directory;

			file.directory = normalize(file.directory);

			fileTransactions.push(collection.add(file));
		}

		await Promise.allSettled(fileTransactions);

		this.files = await collection.getAll();
		console.log('ze files', this.files);
	}

	protected handleNewFile() {
		if (this.files.some(file => file.editing))
			return;

		const exAccordianEl = this.shadowRoot?.querySelector('m-exaccordian');
		let activeDir = '/';

		const item = exAccordianEl?.activeItem;
		if (item) {
			if (item.data.extension)
				activeDir = item.data.directory;
			else
				activeDir = item.data.path;
		}

		this.files = [
			...this.files,
			ForgeFile.create({
				project:   this.project,
				directory: activeDir,
				extension: '',
				name:      '',
				editing:   true,
				content:   '',
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
			.actions=${ [
				{
					label:  'New File...',
					icon:   'https://icons.getbootstrap.com/assets/icons/file-earmark-plus.svg',
					action: () => this.handleNewFile(),
				},
				{
					label:  'New Folder...',
					icon:   'https://icons.getbootstrap.com/assets/icons/folder-plus.svg',
					action: () => this.handleNewFile(),
				},
				{
					label:  'Collapse Folders in Explorer',
					icon:   'https://icons.getbootstrap.com/assets/icons/dash-square.svg',
					action: () => {},
				},
			] }
			.items=${ this.files as any }
			@input-focusout=${ this.handleFilesFocusout }
		></m-exaccordian>
		`;
	}

	public static override styles = [ sharedStyles, explorerStyles ];

}
