import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ForgeFile } from './filesystem/forge-file.js';
import { MimicDB } from './filesystem/mimic-db.js';
import { openDirectory } from './open-directory.js';

@customElement('m-forge')
export class ForgeCmp extends LitElement {
	public override async connectedCallback() {
		super.connectedCallback();

		MimicDB.setup('forge-filesystem', setup => {
			setup
				.createCollection(ForgeFile, ForgeFile.dbIdentifier)
				.createIndex('id', 'id')
				.createIndex('name', 'name')
				.createIndex('path', 'path', { unique: true })
				.mutate(() => {});
		});

		const connection = MimicDB.connect('forge-filesystem');
		const file = new ForgeFile({
			directory: '/',
			name: 'test',
			extension: 'js',
			content: 'hello I am content2',
		});

		const result = await connection
			.collection(ForgeFile)
			.getByIndex('name', 'test');

		if (result) {
			result.content = crypto.randomUUID();
			await connection.collection(ForgeFile).put(result);
		}

		console.log(result);
	}

	protected async handleSetOutputDirectory() {
		const something = await openDirectory('read');
		console.log(something);
	}

	protected override render() {
		return html`
		<button @click=${this.handleSetOutputDirectory}>
			Set file output directory
		</button>
		`;
	}

	public static override styles = [
		css`

		`,
	];
}
