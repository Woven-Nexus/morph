import { html } from '../../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../assets/void/void-element.js';
import { modulesForm } from './modules-form.js';
import { modulesSidebar } from './modules-sidebar.js';


export class ModulesBody implements VoidElement {

	public tagName = 'm-modules-body';
	public styleUrls = [ '/modules/assets/modules-body.css' ];
	public scriptUrls: string | string[];
	public render(): Promise<string> {
		return html`
		<aside>
			<button
				void-get="/modules/new"
				void-target="modules-sidebar,modules-form"
			>
				New
			</button>
			${ modulesSidebar({
				attrs: { 'void-id': 'modules-sidebar' },
			}) }
		</aside>
		<main>
			${ modulesForm({
				attrs: { 'void-id': 'modules-form' },
			}) }
		</main>
		`;
	}

}


export const modulesBody = voidElement(ModulesBody);
