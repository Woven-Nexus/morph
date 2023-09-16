import dotenv from 'dotenv';

import { app } from './app.js';
import codemodules from './features/code-modules/code-module-routes.js';

app.use('/api/code-modules', codemodules);

dotenv.config();
const port = process.env['PORT'];

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${ port }`);
});
