import { Signal, SignalWatcher } from '@lit-labs/preact-signals';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { IModule } from '../../models/modules-model.js';


@customElement('m-modules-form')
export class ModulesForm extends SignalWatcher(LitElement) {

	@property({ type: Object })
	public selectedModule: Signal<IModule | undefined>;

	@state() protected fields: any[] = [];
	public override connectedCallback(): void {
		super.connectedCallback();

		const unsub = this.selectedModule.subscribe((value) => {
			if (!value)
				return;

			unsub();

			if (!document.head.querySelector('#monaco-styles')) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/vendor/@roenlie-monaco-editor-wc/dist/style.css';

				document.head.appendChild(link);
			}

			import('@roenlie/monaco-editor-wc');
		});
	}

	protected override render() {
		if (!this.selectedModule.value) {
			return html`
			<span style="place-self:center;">
				Select file to start editing.
			</span>
			`;
		}

		return html`

		<form>
			<div class="inputs">
				${ this.fields.map(field => html`
				<label style=${ field.hidden ? 'display:none;' : '' }>
					<span>${ field.key }</span>
					${ field.type === 'input' ? html`
					<input
						name="${ field.key }"
						value="${ this.selectedModule.value?.[field.key] ?? '' }"
					>
					` : html`
					<input
						name="${ field.key }"
						type="checkbox"
						${ this.selectedModule.value?.[field.key] ? 'checked' : '' }
						value="${ this.selectedModule.value?.[field.key] ?? '' }"
					>
					` }
				</label>
				`) }
			</div>

			<div class="actions">
				${ this.selectedModule.value?.module_id ? html`
				<button void-post="/modules/save">
					Save
				</button>

				<button
					void-confirm="Are you sure you wish to delete this module?"
					void-post="/modules/delete"
				>
					Delete
				</button>
				` : html`
				<button void-post="/modules/insert">
					Insert
				</button>
				` }
			</div>

			<monaco-editor
				id="code"
				name="code"
				language="typescript"
				.value=${ this.selectedModule.value?.code ?? '' }
			></monaco-editor>
		</form>
		`;
	}


	public static override styles = css`
	:host {
		overflow: hidden;
		display: grid;
	}
	form {
		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr max-content;
		grid-template-rows: max-content 1fr;
		row-gap: 8px;
	}
	.inputs {
		display: grid;
		gap: 8px;
		grid-template-columns: max-content 1fr;

		& label {
			grid-column: span 2;
			display: grid;
			grid-template-columns: subgrid;
			align-items: center;
		}

		[type="checkbox"] {
			justify-self: start;
		}

	}
	.actions {
		border-left: 2px solid white;
	}
	.inputs, .actions {
		padding-top: 24px;
		padding-bottom: 8px;
		padding-inline: 24px;
		border-bottom: 2px solid white;
	}
	monaco-editor {
		grid-column: span 2;
	}
	`;

}
