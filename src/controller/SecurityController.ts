import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {KeyManager} from '../service/KeyManager';
import {di} from '../bootstrap-service-locator';

export class SecurityController extends Controller {

    private keyManager: KeyManager;

    constructor() {
        super();
        this.keyManager = di.get(KeyManager);
    }

    @Route('/publicKey', HTTPMethods.get)
    public onPublicKeyRequest(_req: Request, res: Response) {
        res.send(this.keyManager.getPublicKey());
    }
}