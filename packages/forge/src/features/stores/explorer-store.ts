import { injectable } from '@roenlie/lit-aegis';

import type { ForgeFile } from '../filesystem/forge-file.js';
import { signalState } from './rerender.js';


@injectable()
export class ExplorerStore {

	@signalState() public project = 'test';
	@signalState() public files: ForgeFile[] = [];
	@signalState() public activeScript?: ForgeFile;
	@signalState() public activeComponent?: ForgeFile;

	constructor() {
		console.log('explorer store created');
	}

}

Ag.registerIdentifier('explorerStore');
declare global { interface Ag { readonly explorerStore: unique symbol; }}
