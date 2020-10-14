import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {MoodleSession} from '../service/MoodleSession';
import {ParamsDictionary} from 'express-serve-static-core';
import {Crypt} from '../service/Crypt';
import {KeyManager} from '../service/KeyManager';
import {di} from '../bootstrap-service-locator';

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

    private session: MoodleSession;
    private keyManager: KeyManager;

    constructor() {
        super();
        this.session = di.get(MoodleSession);
        this.keyManager = di.get(KeyManager);
    }


    @Route('/moodleSession', HTTPMethods.get)
    public async onSession(req: Request<{}, {}, {}, CreatQuery>, res: Response) {
        const username: string = req.query.username;
        const password: string = req.query.password;


        try {
            const moodleSession = await this.session.obtainMoodleSession(username, password);
            res.json({moodleSession});
        } catch (e) {
            res.json({
                error: e.message,
            });
        }
    }

    @Route('/validateSession', HTTPMethods.get)
    public async isSessionValid(req: Request<{}, {}, {}, ValidateQuery>, res: Response) {

        const moodleSession = req.query.moodleSession;
        try {
            res.json({
                valid: await this.session.isValid(moodleSession)
            });
        } catch (e) {
            res.json({
                error: e.message,
            });
        }
    }

    @Route('/secureMoodleSession', HTTPMethods.get)
    public async onSecureMoodleSession(req: Request<{}, {}, {}, SecureQuery>, res: Response) {

        if (req.query.secret !== undefined) {
            let decrypted = '';
            try {
                decrypted = Crypt.decrypt(this.keyManager.getPrivateKy(), req.query.secret);
            } catch (e) {
                res.send({error: 'Serverfehler'});
            }

            const decryptedObject = JSON.parse(decrypted);
            try {
                const moodleSession =
                    await this.session.obtainMoodleSession(decryptedObject.username, decryptedObject.password);
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