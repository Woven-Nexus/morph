/* eslint-disable lit/binding-positions */
import { html } from './template-tag.js';


export interface VoidElement {

	tagName: string;
	styleUrl: string;
	scriptUrl: string;
	render(...props: unknown[]): Promise<string>;

}


export const voidElement = <T extends VoidElement>(cls: new () => T) => {
	const { tagName, styleUrl, scriptUrl, render } = new cls();

	return (...props: Parameters<T['render']>) => html`
	<${ tagName }>
		<template shadowrootmode="open">
			${ render(...props) }
			<link rel="stylesheet" href="${ styleUrl }">
			<script type="module" src="${ scriptUrl }"></script>
			<void-initializer></void-initializer>
		</template>
	</${ tagName }>
	`;
};
