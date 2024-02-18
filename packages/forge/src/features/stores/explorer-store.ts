import type { Signal } from '@lit-labs/preact-signals';
import { injectable } from '@roenlie/lit-aegis';

import type { ForgeFile } from '../filesystem/forge-file.js';
import { rerender } from './rerender.js';


@injectable()
export class ExplorerStore {

	@rerender() public project = 'test';
	@rerender() public files: ForgeFile[] = [];
	@rerender() public activeFile?: ForgeFile;

	public signals: Map<string, Signal>;

}

Ag.registerIdentifier('explorerStore');
declare global { interface Ag { readonly explorerStore: unique symbol; }}
