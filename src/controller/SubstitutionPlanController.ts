import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';

interface Params extends ParamsDictionary {
    day: string;
}

export class SubstitutionPlanController extends Controller {

    @Route('/fetch/:day', HTTPMethods.get)
    public onDayRequest(req: Request<Params>, res: Response) {
        const requestedDay = req.params.day;
        res.send(requestedDay);
    }
}