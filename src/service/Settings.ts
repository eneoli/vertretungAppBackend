import * as fs from 'fs';
import * as jsyaml from 'js-yaml';

interface MoodleSettings {
    loginUrl: string;
    todayUrl: string;
    tomorrowUrl: string;
}

interface SecuritySettings {
    publicKeyPath: string;
    privateKeyPath: string;
}

interface Yaml {
    moodle: MoodleSettings;
    security: SecuritySettings;
}

export class Settings {
    private loaded: boolean = false;
    private _moodle!: MoodleSettings;
    private _security!: SecuritySettings;

    public load(configPath: string) {
        const rawConfig = fs.readFileSync(configPath);
        const config = jsyaml.safeLoad(rawConfig.toString()) as Yaml;
        this._moodle = config.moodle;
        this._security = config.security;

        this.loaded = true;
    }

    public get moodle(): MoodleSettings {
        if (!this.loaded) {
            throw new Error('Settings not loaded. Use load() first');
        }
        return this._moodle
    }

    public get security(): SecuritySettings {
        if (!this.loaded) {
            throw new Error('Settings not loaded. Use load() first');
        }
        return this._security
    }
}