import { Router } from 'express';
import studentRouter from './studentRoutes.js';
import professorRouter from './professorRoutes.js';
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use("/student", studentRouter);
router.use("/professor", professorRouter);

export default router;