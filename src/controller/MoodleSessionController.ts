import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {MoodleSession} from '../service/MoodleSession';
import {Settings} from '../service/Settings';
import {ParamsDictionary} from 'express-serve-static-core';

interface Query extends ParamsDictionary {
    username: string;
    password: string;
}

export class MoodleSessionController extends Controller {

    @Route('/moodleSession', HTTPMethods.get)
    public async onSession(req: Request<{}, {}, {}, Query>, res: Response) {
        const username: string = req.query.username;
        const password: string = req.query.password;

        const settings = new Settings();
        settings.load('./config.yml');
        const session = new MoodleSession(settings);

        try {
            const moodleSession = await session.obtainMoodleSession(username, password);
            res.json({moodleSession});
        } catch (e) {
            res.json({
                error: e.message,
            });
        }
    }
}