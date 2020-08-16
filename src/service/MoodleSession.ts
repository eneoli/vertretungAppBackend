import axios from 'axios';
import cheerio from 'cheerio';
import {Settings} from './Settings';
import {URLSearchParams} from 'url';

export class MoodleSession {

    private settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    private extractMoodleSessionCookie(headers: { 'set-cookie': [string] }) {
        try {
            return headers['set-cookie'][0].replace('MoodleSession=', '').split(';')[0]
        } catch (e) {
            throw new Error('Falsche Serverantwort');
        }
    }

    private async getFreshSession() {
        const loginResponse = await axios.get(this.settings.moodle.loginUrl).catch(() => {
            throw new Error('Server hat nicht geantwortet')
        });
        const moodleSession = this.extractMoodleSessionCookie(loginResponse.headers);
        const logintoken = cheerio.load(loginResponse.data)('input[name="logintoken"]').first().val();
        return [moodleSession, logintoken];
    }

    public async obtainMoodleSession(username: string, password: string) {
        let freshSession: string;
        let logintoken: string;
        [freshSession, logintoken] = await this.getFreshSession();

        // build login query
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('logintoken', logintoken);
        params.append('anchor', '');

        const firstResponse = await axios.post(this.settings.moodle.loginUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: 'MoodleSession=' + freshSession,
            },
            maxRedirects: 0,
            withCredentials: true,
            validateStatus: () => true, // axios thinks HTTP 303 is an error --> its not!
        }).catch(() => {
            throw new Error('Server hat nicht geantwortet')
        });

        const cookieTestUrl = firstResponse.headers.location;

        if (cookieTestUrl === this.settings.moodle.loginUrl) {
            throw new Error('Benutzername oder Passwort falsch!');
        }

        // moodle changes session on post request
        const finalSession = this.extractMoodleSessionCookie(firstResponse.headers);

        // moodle checks if session valid
        await axios.get(cookieTestUrl, {
            headers: {
                Cookie: 'MoodleSession=' + finalSession,
            }
        }).catch(() => {
            throw new Error('Server hat nicht geantwortet')
        });

        return finalSession;
    }

    public async isValid(moodleSession: string): Promise<boolean> {
        const response = await axios.get(this.settings.moodle.todayUrl, {
            headers: {
                Cookie: 'MoodleSession=' + moodleSession,
            },
            maxRedirects: 0,
            validateStatus: () => true, // axios thinks HTTP 303 is an error --> its not!
        }).catch(() => {
            throw new Error('Moodle Server hat nicht geantwortet')
        });

        console.log(response.data);

        return response.headers.location !== this.settings.moodle.loginUrl;
    }
}