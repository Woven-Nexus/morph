import { signal } from '@lit-labs/preact-signals';


/**
 * Creates getter setters that access a signal as a way
 * to tie the use of this property into the signal rerender detection mechanism.
 */
export function rerender() {
	return (target: Record<keyof any, any>, property: string) => {
		const hiddenProp = '__' + property;
		const valueProp  = '_' + property;

		Object.defineProperty(target, valueProp, {
			get() {
				if (!this[hiddenProp]) {
					Object.defineProperty(this, hiddenProp, {
						writable:     false,
						enumerable:   false,
						configurable: false,
						value:        signal<any>(undefined),
					});
				}

				return this[hiddenProp];
			},
		});

		Object.defineProperty(target, property, {
			get() {
				return this[valueProp].value;
			},
			set(v: any) {
				this[valueProp].value = v;
			},
		});
	};
}


export const getSignal = (target: Record<keyof any, any>, property: string) => {
	return target['_' + property];
};
