import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {KeyManager} from '../service/KeyManager';
import {Settings} from '../service/Settings';

export class SecurityController extends Controller {

    private keyManager: KeyManager;

    constructor() {
        super();
        // FIXME better: di
        const settings = new Settings();
        settings.load(__dirname + '/config.yml');
        this.keyManager = new KeyManager(settings);
    }

    @Route('/publicKey', HTTPMethods.get)
    public onPublicKeyRequest(_req: Request, res: Response) {
        res.send(this.keyManager.getPublicKey());
    }
}