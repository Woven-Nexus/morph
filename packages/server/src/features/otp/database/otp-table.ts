import type { Optional } from '../../../utilities/optional.js';
import { Query } from '../../sqlite/query.js';


export interface IOneTimePassword {
	opt_id: number;
	email: string;
	otp: string;
	created_at: Date;
}


export class OneTimePassword implements IOneTimePassword {

	public opt_id: number;
	public email: string;
	public otp: string;
	public created_at: Date;

	private constructor(values: Optional<IOneTimePassword, 'opt_id'>) {
		if (values.opt_id !== undefined)
			this.opt_id = values.opt_id;

		this.email = values.email;
		this.otp = values.otp;
		this.created_at = new Date(values.created_at);
	}

	public static parse(values: IOneTimePassword) {
		return new OneTimePassword(values);
	}

	public static initialize(values: Omit<IOneTimePassword, 'opt_id'>) {
		return new OneTimePassword(values);
	}

}


export const createOTPtable = () => {
	using query = new Query();

	query.define<IOneTimePassword>('OTP')
		.primaryKey('opt_id')
		.column('email',      'TEXT', { value: '', nullable: false })
		.column('otp',        'TEXT', { value: '', nullable: false })
		.column('created_at', 'TEXT', { value: "(datetime('now'))", nullable: false })
		.query();
};
