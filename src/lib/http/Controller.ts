import {Request, Response} from 'express';

export class Controller {
    [key: string]: (req: Request, res: Response) => void;
}