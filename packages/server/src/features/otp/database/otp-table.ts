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

	constructor(values: Optional<IOneTimePassword, 'opt_id'>) {
		this.opt_id = values.opt_id ?? 0;
		this.email = values.email;
		this.otp = values.otp;
		this.created_at = new Date(values.created_at);
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

	//db.prepare(/* sql */`
	//CREATE TABLE IF NOT EXISTS OTP (
	//	otp_id     INTEGER PRIMARY KEY,
	//	email      TEXT DEFAULT ''                NOT NULL,
	//	otp        TEXT DEFAULT ''                NOT NULL,
	//	created_at TEXT DEFAULT (DATETIME('now')) NOT NULL
	//)
	//`).run();
};
