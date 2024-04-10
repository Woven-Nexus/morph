/* eslint-disable lit/binding-positions */
import { html } from './template-tag.js';


export interface VoidElement {

	tagName: string;
	styleUrl: string;
	scriptUrl: string;
	attributes?: Record<string, string | boolean>;
	render(...props: unknown[]): Promise<string>;

}


export const voidElement = <T extends VoidElement>(cls: new () => T) => {
	const {
		tagName,
		styleUrl,
		scriptUrl,
		attributes,
		render,
	} = new cls();

	let attrs = '';
	for (const [ key, value ] of Object.entries(attributes ?? {})) {
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

	return (...props: Parameters<T['render']>) => html`
	<${ tagName } ${ attrs }>
		<template shadowrootmode="open">
			${ render(...props) }
			<link rel="stylesheet" href="${ styleUrl }">
			<script type="module" src="${ scriptUrl }"></script>
			<void-initializer></void-initializer>
		</template>
	</${ tagName }>
	`;
};
