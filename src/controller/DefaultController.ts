import {Request, Response} from 'express';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Route} from '../lib/http/controller-decorator';
import {Controller} from '../lib/http/Controller';


export class DefaultController extends Controller {

    @Route('/', HTTPMethods.get)
    public onIndex(_req: Request, res: Response) {
        res.redirect('/webapp');
    }

    @Route('/test', HTTPMethods.get)
    public onTest(_req: Request, res: Response) {
        res.send('It works!');
    }
}