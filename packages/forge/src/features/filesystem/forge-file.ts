import { MSchema } from './mimic-db.js';


const enumerable =
	() => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		descriptor.enumerable = true;
	};

export const ForgeFileDB = 'forge-filesystem' as const;

export class ForgeFile extends MSchema<ForgeFile> {

	public static override dbIdentifier = 'files';
	public static override dbKey = 'id';

	public id = crypto.randomUUID();
	public project: string;
	public directory: string;
	public name: string;
	public extension: string;
	public content: string;
	public accessor editing = false;

	@enumerable() public get path() {
		return `${ this.directory }/${ this.name }${ this.extension }`
			.replaceAll(/\/+/g, '/');
	}

}
