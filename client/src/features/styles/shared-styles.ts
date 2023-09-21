import { css } from 'lit';

export const sharedStyles = css`
:host {
	box-sizing: border-box;
}
* {
	box-sizing: border-box;
}
h1, h2, h3, h4, h5, h6 {
	all: unset;
	box-sizing: border-box;
}
ul, li {
	all: unset;
	display: block;
	box-sizing: border-box;
}
*::-webkit-scrollbar {
	width: var(--scrollbar-width, 0.6rem);
	height: var(--scrollbar-height, 0.6rem);
}

*::-webkit-scrollbar-track {
	background: var(--scrollbar-track, transparent);
}

*::-webkit-scrollbar-thumb {
	background: var(--scrollbar-thumb-bg, rgba(255,255,255, 0.2));
	border-radius: var(--scrollbar-thumb-border-radius, 0.2rem);
	border-top-right-radius: 12px;
	-webkit-background-clip: padding-box;
	background-clip: padding-box;
}

*::-webkit-scrollbar-corner {
	background: var(--scrollbar-corner, rgba(0, 0, 0, 0));
}
`;
