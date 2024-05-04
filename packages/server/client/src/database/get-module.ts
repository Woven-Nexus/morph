import type { IModule } from '../../models/modules-model.ts';
import type { MResponse } from '../../models/response.ts';


export const getModule = async (id: string | number) => {
	const url = new URL('/api/modules/get', location.origin);
	url.searchParams.set('id', String(id));

	const response = await fetch(url, {
		headers: { 'Content-Type': 'Application/Json' },
	});

	const result: MResponse<IModule> = await response.json();

	return result.data;
};
