interface Props {
	count: number;
}


export class CounterElement extends ServerElement<Props> {

	public static override tagName = 'm-counter';
	public static override styleUrl = '';
	public static override scriptUrl = '/login/assets/parts/server-button.js';
	public static override updateUrl = '/login/counter';

	static { customElements.define(this.tagName, this); }

	public static override render(props: Props) {
		return `
		<button id="button">
			Hello I am counter, ${ props.count }
		</button>
		`;
	}

	public connectedCallback() {
		const button = this.shadowRoot?.getElementById('button');
		button?.addEventListener('click', () => {
			this.requestUpdate();
		});
	}

}
