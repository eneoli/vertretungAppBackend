import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {MoodleSession} from '../service/MoodleSession';
import {Settings} from '../service/Settings';
import {ParamsDictionary} from 'express-serve-static-core';
import {Crypt} from '../service/Crypt';
import {KeyManager} from '../service/KeyManager';

interface CreatQuery extends ParamsDictionary {
    username: string;
    password: string;
}

interface ValidateQuery {
    moodleSession: string;
}

interface SecureQuery {
    secret: string;
}

export class MoodleSessionController extends Controller {

    @Route('/moodleSession', HTTPMethods.get)
    public async onSession(req: Request<{}, {}, {}, CreatQuery>, res: Response) {
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

    @Route('/validateSession', HTTPMethods.get)
    public async isSessionValid(req: Request<{}, {}, {}, ValidateQuery>, res: Response) {

        const settings = new Settings();
        settings.load('./config.yml');
        const session = new MoodleSession(settings);

        const moodleSession = req.query.moodleSession;
        try {
            res.json({
                valid: await session.isValid(moodleSession)
            });
        } catch (e) {
            res.json({
                error: e.message,
            });
        }
    }

    @Route('/secureMoodleSession', HTTPMethods.get)
    public async onSecureMoodleSession(req: Request<{}, {}, {}, SecureQuery>, res: Response) {
        const settings = new Settings();
        settings.load('./config.yml');
        const session = new MoodleSession(settings);
        const keyManager = new KeyManager(settings);

        if (req.query.secret !== undefined) {
            let decrypted = '';
            try {
                decrypted = Crypt.decrypt(keyManager.getPrivateKy(), req.query.secret);
            } catch (e) {
                res.send({error: 'Serverfehler'});
            }

            const decryptedObject = JSON.parse(decrypted);
            try {
                const moodleSession =
                    await session.obtainMoodleSession(decryptedObject.username, decryptedObject.password);
                res.json({moodleSession: moodleSession});
            } catch (e) {
                res.json({
                    error: e.message
                });
            }
        } else {
            res.send({error: 'Bitte gib Benutzername und Passwort an'});
        }
    }
}