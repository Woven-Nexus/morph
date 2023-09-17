import { StateStore } from '@roenlie/lit-state-store';

import type { Module } from '../code-module/module-model.js';


export class LayoutStore extends StateStore {

	public namespace = '';
	public moduleId = '';
	public module: Module | undefined = undefined;

}
