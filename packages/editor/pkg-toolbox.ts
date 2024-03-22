import { createEntrypointsFromDirectories } from '@roenlie/package-toolbox/filesystem/create-index-entries.js';
import { defineToolbox } from '@roenlie/package-toolbox/toolbox';

export default defineToolbox(async () => {
	const exclude = (path: string) =>
		[ '.demo', '.test', '.bench' ].every(seg => !path.includes(seg));

	const entrypoints = createEntrypointsFromDirectories([ '/src' ]).map(entry => {
		entry.packageExport = false;

		return entry;
	});

	return {
		indexBuilder: {
			entrypoints:    [ ...entrypoints ],
			defaultFilters: [ exclude ],
		},
		exportsBuilder: {
			entries: entrypoints.map(entry => {
				return {
					path:    entry.packagePath,
					default: entry.path,
					types:   entry.path,
				};
			}),
			options: {
				override: true,
			},
		},
	};
});
