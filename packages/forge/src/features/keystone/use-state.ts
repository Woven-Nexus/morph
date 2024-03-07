import { signal } from '@lit-labs/preact-signals';


const useStateBrand = Symbol();


export function useState<T>(value: T) {
	const internalVal = signal(value);

	function state(): T;
	function state(value: T): T;
	function state(value = useStateBrand as any) {
		if (value !== useStateBrand)
			internalVal.value = value;

		return internalVal.value;
	}

	return state;
}
