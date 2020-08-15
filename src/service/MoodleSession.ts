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
        });

        // moodle changes session on post request
        const finalSession = this.extractMoodleSessionCookie(firstResponse.headers['set-cookie'][0]);
        const cookieTestUrl = firstResponse.headers.location;

        // moodle checks if session valid
        await axios.get(cookieTestUrl, {
            headers: {
                Cookie: 'MoodleSession=' + finalSession,
            }
        });

        return finalSession;
    }
}