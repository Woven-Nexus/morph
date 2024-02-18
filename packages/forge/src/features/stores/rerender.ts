import { Signal, signal } from '@lit-labs/preact-signals';


/**
 * Creates getter setters that access a signal as a way
 * to tie the use of this property into the signal rerender detection mechanism.
 */
export function rerender() {
	type SignalMap = Map<string, Signal>;

	return (target: object, property: string) => {
		const sig = signal<any>(undefined);
		const map = ((target as {signals?: SignalMap}).signals
			??= new Map<string, Signal>());

		map.set(property, sig);
		Object.defineProperty(target, property, {
			get: () => {
				return sig.value;
			},
			set: (v: any) => {
				sig.value = v;
			},
		});
	};
}
