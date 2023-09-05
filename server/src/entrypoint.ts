import './template-routes/layout.js';
import './features/code/routes.js';
import './database.js';

import dotenv from 'dotenv';

import { app } from './app.js';

dotenv.config();
const port = process.env['PORT'];

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${ port }`);
});
