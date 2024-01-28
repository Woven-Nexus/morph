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

		this.files.forEach(file => console.log((file.content as string).length));
	}

	protected async handleFilesFocusout() {
		const collection = MimicDB.connect(ForgeFileDB).collection(ForgeFile);
		const files = this.files.filter(file => file.editing && file.name);

		const fileTransactions: Promise<any>[] = [];

		for (const file of files) {
			const parsed = parse(file.name as string);

			if (parsed.dir) {
				parsed.dir.split(sep).forEach((dir, i, arr) => {
					if (!dir)
						return;

					const folder = ForgeFile.create({
						project:   this.project,
						directory: join(file.directory as string, ...arr.slice(0, i)),
						name:      dir,
						extension: '',
						content:   '',
						editing:   false,
					});

					collection.tryAdd(folder);
				});
			}

			if (parsed.ext) {
				file.extension = parsed.ext;
				file.name = parsed.name;
			}

			file.editing = false;
			file.directory = join(file.directory as string, parsed.dir);
			file.directory = normalize(file.directory);

			fileTransactions.push(collection.add(file));
		}

		await Promise.all(fileTransactions);

		this.files = await collection.getAll();
	}

	protected handleNewFile() {
		if (this.files.some(file => file.editing))
			return;

		this.files = [
			...this.files,
			ForgeFile.create({
				project:   this.project,
				directory: '/',
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
					action: () => {},
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
