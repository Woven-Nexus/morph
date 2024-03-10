// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const html: (_strings: TemplateStringsArray, ..._values: any[]) => void;


export const test = html`<Hello.World.I.Have.Come.In.Peace />`;
export const test0 = html`<Hello.World></Hello.World>`;
export const test1 = html`
<div>
	<Hello.World
		id = "1"
		label="this is label"
		?checked=${ true }
		indeterminate

		@click=${ () => {} }
	>
		<span></span>

		${ 5 }

		<World/>
		<World />
		<World>
			<section>
				${ 'whatabouthis' }
			</section>
		</World>
	</Hello.World>
</div>
`;
export const test2 = html`<div><Hello id="1" label="label goes here" /></div>`;
export const test3 = html`<div><Hello/></div>`;
