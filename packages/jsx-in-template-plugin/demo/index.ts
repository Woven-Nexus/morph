const html = (_strings: TemplateStringsArray, ..._values: any[]) => {};


export const test1 = html`
<div>
	<Hello
		id = "1"
		label=${ 'here is label' }
		?checked=${ true }
		indeterminate

		@click=${ () => {} }
	>
		<span></span>

		${ 5 }

		<World/>

		<World>
			<section>
				${ 'whatabouthis' }
			</section>
		</World>
	</Hello>
</div>
`;
//export const test2 = html`<div><Hello label=${ 'something' } /></div>`;
//export const test3 = html`<div><Hello/></div>`;
