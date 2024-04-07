/* eslint-disable lit/binding-positions */
import { html } from './template-tag.js';

export interface DeclarativeElement {

	tagName: string;
	styleUrl: string;
	scriptUrl: string;
	render(props: unknown): Promise<string>;

}


export const declarativeElement = <T>(cls: new () => DeclarativeElement) => {
	const { tagName, styleUrl, scriptUrl, render } = new cls();

	return (props: T) => html`
	<${ tagName }>
		<template shadowrootmode="open">
			${ render(props) }
			<link rel="stylesheet" href="${ styleUrl }">
			<script type="module" src="${ scriptUrl }"></script>
			<void-initializer></void-initializer>
		</template>
	</${ tagName }>
	`;
};
