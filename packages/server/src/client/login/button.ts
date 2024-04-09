import { type RequestHandler, urlencoded } from 'express';

import { html } from '../../utilities/template-tag.js';
import { type VoidElement, voidElement } from '../../utilities/void-element.js';


export const post: RequestHandler[] = [
	urlencoded({ extended: false }),
	async (req, res) => {
		res.send(await voidButton({ index: Math.random() * 100 }));
	},
];

export class VoidButton implements VoidElement {

	public tagName = 'm-button';
	public styleUrl = '';
	public scriptUrl = '';
	public render(props: {index: number}): Promise<string> {
		return html`
		<form void-boosted>
			<fieldset>
				<label>
					Hello
				</label>
				<input
					id="hello"
					name="hello"
					value=""
				>
			</fieldset>

			<button
				void-id="button"
				void-post="/login/button"
				void-target="host"
			>
				I AM A BUTTON ${ props.index }
			</button>
		</form>
		`;
	}

}


export const voidButton = voidElement(VoidButton);
