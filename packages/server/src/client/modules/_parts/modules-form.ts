import type { IModule } from '../../../../models/modules-model.js';
import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';


export class ModulesForm implements VoidElement {

	public tagName = 'm-modules-form';
	public styleUrls = [ '/modules/assets/modules-form.css' ];
	public scriptUrls: string | string[];
	public render({ module }: { module?: IModule; }): Promise<string> {
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

		if (!module) {
			return html`
			<span style="place-self:center;">
				Select file to start editing.
			</span>
			`;
		}

		return html`
		<form void-boosted void-target="modules-sidebar,modules-form">
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
			>${ module.code }
			</monaco-editor>
		</form>
		`;
	}

}


export const modulesForm = voidElement(ModulesForm);
