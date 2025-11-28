import express from 'express';
import { createReport, listReports, updateReport } from '../controllers/reportController.js';

const router = express.Router();

router.post('/', ...createReport);
router.get('/', ...listReports);
router.patch('/:id', ...updateReport);

export default router;
