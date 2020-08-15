import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';

export class MoodleSessionController extends Controller {

    @Route('/moodleSession', HTTPMethods.get)
    public onSession(_req: Request, res: Response) {
        return res.send('Moodle');
    }
}