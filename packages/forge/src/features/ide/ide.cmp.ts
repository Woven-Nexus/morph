import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { html } from 'lit';
import { ForgeFile, ForgeFileDB } from '../filesystem/forge-file.js';
import { MimicDB } from '../filesystem/mimic-db.js';
import { ExplorerCmp } from './explorer.cmp.js';
import ideStyles from './ide.css' with { type: 'css' };
import { WorkspaceCmp } from './workspace.cmp.js';
import { NavCmp } from './nav.cmp.js';

NavCmp.register();
WorkspaceCmp.register();
ExplorerCmp.register();

MimicDB.setup('forge-filesystem', setup => {
	setup
		.createCollection(ForgeFile, ForgeFile.dbIdentifier)
		.createIndex('id', 'id')
		.createIndex('name', 'name')
		.createIndex('path', 'path', { unique: true })
		.mutate(() => {});
});

@customElement('m-ide')
export class IdeCmp extends AegisElement {
	public override async connectedCallback() {
		super.connectedCallback();

		const connection = MimicDB.connect(ForgeFileDB);
	}

	protected override render() {
		return html`
		<m-nav
			id="nav"
		>
		</m-nav>

		<s-primary-sidebar
			id="primary-sidebar"
		>
			<m-explorer></m-explorer>
		</s-primary-sidebar>

		<s-workspace
			id="workspace"
		>
			<m-workspace></m-workspace>
		</s-workspace>

		<s-panel
			id="panel"
		>

		</s-panel>

		<s-secondary-sidebar
			id="secondary-sidebar"
		>
		</s-secondary-sidebar>

		<s-status-bar
			id="status-bar"
		>

		</s-status-bar>
		`;
	}

	public static override styles = [sharedStyles, ideStyles];
}
