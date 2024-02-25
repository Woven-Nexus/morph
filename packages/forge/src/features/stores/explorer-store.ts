import type { Signal } from '@lit-labs/preact-signals';
import { injectable } from '@roenlie/lit-aegis';

import type { ForgeFile } from '../filesystem/forge-file.js';
import { rerender } from './rerender.js';


@injectable()
export class ExplorerStore {

	@rerender() public project = 'test';
	@rerender() public files: ForgeFile[] = [];
	@rerender() public activeScript?: ForgeFile;
	@rerender() public activeComponent?: ForgeFile;

	public signals: Record<
		'project' | 'files' | 'activeScript' | 'activeComponent',
		Signal
	>;


	constructor() {
		console.log('explorer store created');
	}

}

Ag.registerIdentifier('explorerStore');
declare global { interface Ag { readonly explorerStore: unique symbol; }}
