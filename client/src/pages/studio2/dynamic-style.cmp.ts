import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { html } from 'lit';
import { property } from 'lit/decorators.js';


@customElement('dynamic-style')
export class DynamicStyle extends MimicElement {

	@property({ type: Object }) public styles: Record<string, Record<string, string | number>> = {};
	#styleString = '';

	protected override createRenderRoot() {
		return this;
	}

	protected override willUpdate(props: Map<PropertyKey, unknown>) {
		super.willUpdate(props);
		if (props.has('styles'))
			this.#styleString = this.transformStyles(this.styles);
	}

	protected transformStyles(styles: Record<string, Record<string, string | number>>) {
		return Object.entries(styles).map(([ selector, props ]) => {
			const propsString = Object.entries(props).map(([ key, value ]) => {
				return key + ':' + value + ';';
			}).join('\n');

			return selector + '{\n' + propsString + '\n}';
		}).join('\n');
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
