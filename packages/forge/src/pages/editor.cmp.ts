import { AegisElement, customElement } from '@roenlie/lit-aegis';
import { html } from 'lit';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { ForgeFile } from '../features/filesystem/forge-file.js';
import { MimicDB } from '../features/filesystem/mimic-db.js';
import { ExplorerCmp } from '../features/ide/explorer.cmp.js';
import { WorkspaceCmp } from '../features/ide/workspace.cmp.js';
import editorStyles from './editor.css' with { type: 'css' };

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

@customElement('m-editor-page', true)
export class EditorPageCmp extends AegisElement {
	public static page = true;

	protected override render(): unknown {
		return html`
		<s-primary-sidebar id="primary-sidebar">
			<m-explorer></m-explorer>
		</s-primary-sidebar>

		<s-workspace id="workspace">
			<m-workspace></m-workspace>
		</s-workspace>

		<s-panel id="panel">
		</s-panel>

		<s-secondary-sidebar id="secondary-sidebar">
		</s-secondary-sidebar>

		<s-status-bar id="status-bar">
		</s-status-bar>
		`;
	}
	public static override styles = [sharedStyles, editorStyles];
}
