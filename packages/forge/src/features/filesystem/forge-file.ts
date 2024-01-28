import { type Init, MSchema } from './mimic-db.js';


const enumerable =
	() => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		descriptor.enumerable = true;
	};

export const ForgeFileDB = 'forge-filesystem' as const;

export class ForgeFile extends MSchema<ForgeFile> {

	public static override dbIdentifier = 'files';
	public static override dbKey = 'id';

	public id = crypto.randomUUID();
	public project: Init<string>;
	public directory: Init<string>;
	public name: Init<string>;
	public extension: Init<string>;
	public content: Init<string>;
	public accessor editing: Init<boolean>;

	@enumerable() public get path() {
		return `${ this.directory }/${ this.name }${ this.extension }`.replaceAll(
			/\/+/g,
			'/',
		);
	}

}
