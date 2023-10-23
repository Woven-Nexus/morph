import express, { Router } from 'express';

import { createResponse } from '../../utilities/create-response.js';


const router: Router = express.Router();
export default router;


router.get('/tile', async (req, res) => {
	res.send(createResponse({
		tile: 'yo mama',
	}, ''));
});
