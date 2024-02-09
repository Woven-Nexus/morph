import { AegisElement, customElement, state } from '@roenlie/lit-aegis';
import { MMButton } from '@roenlie/mimic-elements/button';
import { MMIcon } from '@roenlie/mimic-elements/icon';
import { MMTooltip } from '@roenlie/mimic-elements/tooltip';
import { DynamicStyle } from '@roenlie/mimic-elements/utilities';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html } from 'lit';
import { query, queryAll } from 'lit/decorators.js';
import { join, normalize, parse, sep } from 'posix-path-browser';

import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';
import explorerStyles from './explorer.css' with { type: 'css' };
import { type AccordianAction, ExplorerAccordianCmp } from './explorer-accordian.cmp.js';
import { FileExplorerCmp } from './file-explorer.cmp.js';

MMIcon.register();
MMButton.register();
MMTooltip.register();
ExplorerAccordianCmp.register();
FileExplorerCmp.register();


@customElement('m-explorer')
export class ExplorerCmp extends AegisElement {

	@state() protected project = 'test';
	@state() protected files: ForgeFile[] = [];
	@query('m-file-explorer') protected fileExplorerEl: FileExplorerCmp;
	@queryAll('m-explorer-accordian') protected accordianEls: NodeListOf<HTMLElement>;

	protected fileExplorerActions: AccordianAction[] = [
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
	];

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

		let fileToFocus = '';

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

			file.editing = false;
			file.name = parsed.name;
			file.extension = parsed.ext;
			file.directory =  normalize(parsed.dir
				? join(file.directory, parsed.dir)
				: file.directory);

			fileTransactions.push(collection.add(file));
			fileToFocus = file.id;
		}

		await Promise.allSettled(fileTransactions);

		this.files = await collection.getAll();
		this.updateComplete
			.then(() => this.fileExplorerEl.updateComplete)
			.then(() => this.fileExplorerEl.setActiveItem(fileToFocus));
	}

	protected handleNewFile() {
		if (this.files.some(file => file.editing))
			return;

		let activeDir = '/';

		const item = this.fileExplorerEl.activeItem;
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

		window.addEventListener('mousedown', (ev) => {
			const path = ev.composedPath() as HTMLElement[];
			if (!path.some(el => el === this.fileExplorerEl))
				this.handleFilesFocusout();
		}, { once: true });
	}

	protected handleAccordianToggle(ev: Event) {
		const target = (ev.composedPath() as HTMLElement[])
			.find(el => el.localName === 'm-explorer-accordian') as ExplorerAccordianCmp | undefined;

		if (target) {
			target.expanded = !target.expanded;
			this.requestUpdate();
		}
	}

	protected handleSelectItem(ev: CustomEvent<ForgeFile>) {
		this.fileExplorerEl.setActiveItem(ev.detail.id);
	}

	protected dynamicStyle = new DynamicStyle();
	protected get dynamicStyles() {
		const style = this.dynamicStyle;
		style.selector('s-explorer-content')
			.property('grid-template-rows', [ ...this.accordianEls ].map((el) =>
				el.hasAttribute('expanded') ? 'minmax(32px, 1fr)' : 'minmax(32px, 0fr)').join(' '));

		return style.toString();
	}

	protected override render(): unknown {
		return html`
		<style>${ this.dynamicStyles }</style>

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

		<s-explorer-content
			@expand=${ this.handleAccordianToggle }
			@collapse=${ this.handleAccordianToggle }
		>
			<m-explorer-accordian
				expanded
				id="file-explorer"
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
			>
				<m-file-explorer
					.items=${ this.files }
					@select-item=${ this.handleSelectItem }
					@input-focusout=${ this.handleFilesFocusout }
				></m-file-explorer>
			</m-explorer-accordian>

			<m-explorer-accordian
				header="Other"
			></m-explorer-accordian>
		</s-explorer-content>
		`;
	}

	public static override styles = [ sharedStyles, explorerStyles ];

}