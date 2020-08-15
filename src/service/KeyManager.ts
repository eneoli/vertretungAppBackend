import * as fs from 'fs';
import {Settings} from './Settings';

export class KeyManager {

    private settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    public getPublicKey(): string {
        return fs.readFileSync(this.settings.security.publicKeyPath).toString();
    }

    public getPrivateKy() {
        return fs.readFileSync(this.settings.security.privateKeyPath).toString();
    }
}