import { ContainerLoader, ContainerModule } from '@roenlie/lit-aegis';

import { ExplorerStore } from '../features/stores/explorer-store.js';
import { ForgeStore } from '../features/stores/forge-store.js';


const module = new ContainerModule(({ bind }) => {
	bind(Ag.forgeStore).to(ForgeStore).inSingletonScope();
	bind(Ag.explorerStore).to(ExplorerStore).inSingletonScope();
});

ContainerLoader.load(module);
