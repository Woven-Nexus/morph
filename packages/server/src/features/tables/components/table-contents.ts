import { template } from '../../../utilities/template.js';
import { css, html } from '../../../utilities/template-tag.js';


export const tableContents = (name?: string, items?: Record<keyof any, any>[]) => {
	return template({
		name:     'table-contents',
		template: !name ? html`` : html`
		<section id="table-content">
			<ul>
				<h1>${ name }</h1>
				${ items?.map(item => html`
				<li>
					${ Object.entries(item).map(([ key, value ]) => html`
					<span class="key">${ key }:</span>
					<span class="value">${ value }</span>
					`) }
				</li>
				`) ?? '' }
			</ul>
		</section>
		`,
		style: css`
		#table-content {
			overflow: hidden;
			display: grid;
		}
		#table-content h1 {
			all: unset;
			font-size: 1.5em;
			position: sticky;
			top: 0px;
			background-color: rgb(30, 30, 30);
			padding-top: 24px;
			padding-bottom: 8px;
			margin-inline: -24px;
			padding-inline: 24px;
			border-bottom: 2px solid white;
		}
		#table-content ul {
			overflow: auto;
			display: flex;
			flex-flow: column nowrap;
			gap: 12px;
			padding-inline: 24px;
		}
		#table-content li {
			display: grid;
			grid-template-columns: max-content 1fr;

			.key {
				grid-column-start: 1;
			}
			.value {
				grid-column-start: 2;
			}
		}
		`,
	});
};
