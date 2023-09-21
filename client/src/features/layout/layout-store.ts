import { StateStore } from '@roenlie/lit-state-store';

import type { ModuleNamespace, NamespaceDefinition } from '../code-module/namespace-model.js';


export class LayoutStore extends StateStore {

	public activeNamespace = '';
	public activeModuleId = '';
	public availableNamespaces: NamespaceDefinition[] = [];
	public availableModules: ModuleNamespace[] = [];

}
