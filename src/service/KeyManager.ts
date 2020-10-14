import * as fs from 'fs';
import {Settings} from './Settings';
import {di} from '../bootstrap-service-locator';

export class KeyManager {

    private settings: Settings;

    constructor() {
        this.settings = di.get(Settings);
    }

    public getPublicKey(): string {
        return fs.readFileSync(this.settings.security.publicKeyPath).toString();
    }

    public getPrivateKy() {
        return fs.readFileSync(this.settings.security.privateKeyPath).toString();
    }
}