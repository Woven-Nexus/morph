type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
const chart = new Map<Methods, Map<string, Deno.ServeHandler>>([
	['GET', new Map<string, Deno.ServeHandler>()],
	['POST', new Map<string, Deno.ServeHandler>()],
	['PATCH', new Map<string, Deno.ServeHandler>()],
	['PUT', new Map<string, Deno.ServeHandler>()],
	['DELETE', new Map<string, Deno.ServeHandler>()],
]);

export const get = (route: string, handler: Deno.ServeHandler) => {
	chart.get('GET')?.set(route, handler);
};

export const requestDelegator = async (request: Request, info: Deno.ServeHandlerInfo) => {
	const reqChart = chart.get(request.method as Methods);
	if (!reqChart) {
		throw new Error('Invalid method: ' + request.method);
	}

	const url = new URL(request.url);
	const handler = reqChart.get(url.pathname);
	if (!handler) {
		const body = JSON.stringify({ message: 'NOT FOUND' });
		return new Response(body, {
			status: 404,
			headers: {
				'content-type': 'application/json; charset=utf-8',
			},
		});
	}

	return await handler(request, info);
};
