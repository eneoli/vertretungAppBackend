import axios from 'axios';
import cheerio from 'cheerio';
import {Settings} from './Settings';
import {URLSearchParams} from 'url';

export class MoodleSession {

    private settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    private extractMoodleSessionCookie(cookieString: string) {
        return cookieString.replace('MoodleSession=', '').split(';')[0]
    }

    private async getFreshSession() {
        const loginResponse = await axios.get(this.settings.moodle.loginUrl);
        const moodleSession = this.extractMoodleSessionCookie(loginResponse.headers['set-cookie'][0]);
        const logintoken = cheerio.load(loginResponse.data)('input[name="logintoken"]').first().val();
        return [moodleSession, logintoken];
    }

    public async obtainMoodleSession(username: string, password: string) {
        let moodleSession: string;
        let logintoken: string;
        [moodleSession, logintoken] = await this.getFreshSession();

        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('logintoken', logintoken);
        params.append('anchor', '');

        console.log(moodleSession);
        console.log(params.toString());
        const firstResponse = await axios.post(this.settings.moodle.loginUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: 'MoodleSession=' + moodleSession,
            },
            maxRedirects: 0,
            withCredentials: true,
            validateStatus: () => true,
        });
        const finalSession = this.extractMoodleSessionCookie(firstResponse.headers['set-cookie'][0]);
        const cookieTestUrl = firstResponse.headers.location;

        await axios.get(cookieTestUrl, {
            headers: {
                Cookie: 'MoodleSession=' + finalSession,
            }
        });

        return finalSession;
    }
}