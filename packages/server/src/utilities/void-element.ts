/* eslint-disable lit/binding-positions */
import { html } from './template-tag.js';


export interface VoidElement {

	tagName: string;
	styleUrl: string;
	scriptUrl: string;
	render(props: Record<keyof any, any>): Promise<string>;

}

type ParamObject<T extends (...args: any) => any> = Parameters<T>[number];


export const voidElement = <T extends VoidElement>(cls: new () => T) => {
	const {
		tagName,
		styleUrl,
		scriptUrl,
		render,
	} = new cls();

	const concatAttrs = (
		attributes: Record<string, string | number | boolean> = {},
	) => {
		let attrs = '';
		const entries = Object.entries(attributes);
		for (const [ key, value ] of entries) {
			if (!value)
				continue;

			if (attrs)
				attrs += ' ';

			if (value === true) {
				attrs += key;
				continue;
			}

			attrs += `${ key }="${ value }"`;
		}
	};

	return (config: {
		attrs?: Record<string, string | number>,
		props?: ParamObject<T['render']>
	} = {}) => {
		return html`
		<${ tagName } ${ concatAttrs(config.attrs) }>
			<template shadowrootmode="open">
				${ render(config.props ?? {}) }
				<link rel="stylesheet" href="${ styleUrl }">
				<script type="module" src="${ scriptUrl }"></script>
				<void-initializer></void-initializer>
			</template>
		</${ tagName }>
		`;
	};
};
