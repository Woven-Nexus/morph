declare global {
	interface WindowEventMap {
		'void-load': CustomEvent<{element: HTMLElement; host: HTMLElement;}>;
		'void-get': CustomEvent<{element: HTMLElement; host: HTMLElement;}>;
		'void-form-get': CustomEvent<{
			element: HTMLFormElement;
			host: HTMLElement;
			submitter: HTMLElement;
		}>;
		'void-form-post': CustomEvent<{
			element: HTMLFormElement;
			host: HTMLElement;
			submitter: HTMLElement;
		}>;
	}
}


export const voidCache = new Map<string, WeakRef<HTMLElement>>();


const parser = new DOMParser();


const cacheGet = (id: string | null | undefined) => {
	if (!id)
		return;

	return voidCache.get(id)?.deref();
};


interface Target { id: string; element: HTMLElement; }


const getTargets = (
	host: HTMLElement, ...elements: HTMLElement[]
): Target | Target[] => {
	const element = elements.find(el => el.hasAttribute('void-target'));
	if (!element)
		return [];

	const targets = element.getAttribute('void-target')!
		.split(',')
		.map(a => a.trim());

	if (!targets.length) {
		return {
			id: '',
			element,
		};
	}

	if (targets.length === 1 && targets[0] === 'host') {
		return {
			id:      '',
			element: host,
		};
	}

	return targets.map(target => ({
		id:      target,
		element: cacheGet(target)!,
	}));
};

const replaceTargets = (parsed: Document, targets: Target | Target[]) => {
	if (Array.isArray(targets)) {
		targets.forEach(target => {
			const query = parsed.querySelector('[void-id="' + target.id + '"]');
			if (query) {
				voidCache.delete(target.id);
				target.element.replaceWith(query);
			}
		});
	}
	else {
		const children = ([ ...parsed.body.children ] as HTMLElement[]).reverse();
		children.forEach(el => {
			el.style.display = 'none';
			targets.element.insertAdjacentElement('afterend', el);
		});

		setTimeout(() => {
			targets.element.remove();
			children.forEach(el => el.style.display = '');
		}, 100);
	}
};


globalThis.addEventListener('void-get', async ev => {
	const { element, host } = ev.detail;
	const url = element.getAttribute('void-get')!;

	const response = await (await fetch(url)).text();
	const parsed = parser.parseFromString(response, 'text/html', {
		includeShadowRoots: true,
	});

	const targets = getTargets(host, element);
	replaceTargets(parsed, targets);
});


globalThis.addEventListener('void-form-post', async ev => {
	ev.preventDefault();

	const { element, host, submitter } = ev.detail;

	const url = submitter.getAttribute('void-post')
		|| element.getAttribute('void-post')!;

	const data = new URLSearchParams();
	for (const [ key, value ] of new FormData(element))
		data.append(key, value.toString());

	const response = await (await fetch(url, {
		method: 'post',
		body:   data,
	})).text();

	const parsed = parser.parseFromString(response, 'text/html', {
		includeShadowRoots: true,
	});

	const targets = getTargets(host, submitter, element);
	replaceTargets(parsed, targets);
});
