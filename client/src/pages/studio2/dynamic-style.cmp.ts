import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';


export type StyleObject = Record<string, Record<string, string | number>>;


@customElement('dynamic-style')
export class DynamicStyle extends MimicElement {

	@property({ type: Object }) public styles: StyleObject = {};
	#styleString = '';

	protected override createRenderRoot() {
		return this;
	}

	protected override willUpdate(props: Map<PropertyKey, unknown>) {
		super.willUpdate(props);

		if (props.has('styles') && this.styles)
			this.#styleString = this.transformStyles(this.styles);
	}

	protected transformStyles(styles: StyleObject) {
		let str = '';

		for (const [ selector, props ] of Object.entries(styles)) {
			str += selector + '{';

			for (const [ key, value ] of Object.entries(props))
				str += key + ':' + value + ';';

			str += '}\n';
		}

		return str;
	}

	protected override render() {
		return html`
		<style>
			dynamic-style { display: contents; }
			${ this.#styleString }
		</style>
		`;
	}

}
