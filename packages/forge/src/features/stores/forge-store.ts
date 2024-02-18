import { inject, injectable } from '@roenlie/lit-aegis';

import { ExplorerStore } from './explorer-store.js';


@injectable()
export class ForgeStore {

	@inject(Ag.explorerStore) public readonly explorerStore: ExplorerStore;

}

Ag.registerIdentifier('forgeStore');
declare global { interface Ag { readonly forgeStore: unique symbol; }}
