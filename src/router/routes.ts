import { Request, Response, Router } from 'express';
import { io } from '..';

const router = Router();

router.get('/send/:name', (req: Request, res: Response) => {
    io.emit('name', { data: req.params.name });
    res.status(200).json({ message: 'enviado' });
});
router.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});
export = router ;