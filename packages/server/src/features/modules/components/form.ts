import { template } from '../../../utilities/template.js';
import { css, html } from '../../../utilities/template-tag.js';
import type { IModule } from '../database/modules-table.js';


export const form = async (module?: IModule) => {
	const fields: {
		key: keyof IModule;
		hidden?: true;
		type: 'input' | 'checkbox'
	}[] = [
		{ key: 'module_id', type: 'input', hidden: true },
		{ key: 'namespace', type: 'input' },
		{ key: 'name', type: 'input' },
		{ key: 'description', type: 'input' },
		{ key: 'active', type: 'checkbox' },
	];

	return template({
		name:     'form',
		template: module ? html`
		<form
			hx-boost="true"
			hx-push-url="false"
			hx-target="main"
			hx-swap="innerHTML"
		>
			<div class="inputs">
				${ fields.map(field => html`
				<label style=${ field.hidden ? 'display:none;' : '' }>
					<span>${ field.key }</span>
					${ field.type === 'input' ? html`
					<input
						name="${ field.key }"
						value="${ module[field.key] ?? '' }"
					>
					` : html`
					<input
						name="${ field.key }"
						type="checkbox"
						${ module[field.key] ? 'checked' : '' }
						value="${ module[field.key] ?? '' }"
					>
					` }
				</label>
				`) }
			</div>

			<div class="actions">
				${ module.module_id ? html`
				<button hx-post="/modules/save">
					Save
				</button>

				<button
					hx-confirm="Are you sure you wish to delete this module?"
					hx-delete="/modules/delete"
				>
					Delete
				</button>
				` : html`
				<button hx-post="/modules/insert">
					Insert
				</button>
				` }
			</div>

			<monaco-editor
				id="code"
				name="code"
				value="${ module.code }"
				language="typescript"
			></monaco-editor>
		</form>
		` : html`
		<span style="place-self:center;">Select file to start editing.</span>
		`,
		style: css`
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
		`,
		script:    () => {},
		immediate: true,
	});
};
