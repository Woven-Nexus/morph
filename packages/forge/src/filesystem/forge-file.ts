import { MSchema, type Required } from './mimic-db.js';

const initial = (value: any) => (target: any, propertyKey: string) => {
	target[propertyKey] = value;
};

const enumerable =
	() => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		descriptor.enumerable = true;
	};

export class ForgeFile extends MSchema<ForgeFile> {
		public static override dbIdentifier = 'files';
		public static override dbKey = 'id';

		@initial(crypto.randomUUID()) public id: string;
		public directory: Required<string>;
		public name: Required<string>;
		public extension: Required<string>;
		public content: Required<string>;

		@enumerable() public get path() {
			return `${this.directory}/${this.name}.${this.extension}`.replaceAll(
				/\/+/g,
				'/',
			);
		}
	}
