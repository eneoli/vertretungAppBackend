import {Controller} from '../lib/http/Controller';
import {Route} from '../lib/http/controller-decorator';
import {HTTPMethods} from '../lib/http/HTTTPMethods';
import {Request, Response} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {PlanParser} from '../service/PlanParser';
import axios from 'axios';
import {Settings} from '../service/Settings';

interface Params extends ParamsDictionary {
    day: string;
}

interface Query {
    moodleSession: string;
}

const enum DAYS {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
}

export class SubstitutionPlanController extends Controller {

    private planParser: PlanParser = new PlanParser();
    private settings: Settings;

    constructor() {
        super();
        this.settings = new Settings();
        this.settings.load('./config.yml');
    }

    @Route('/fetch/:day', HTTPMethods.get)
    public async onDayRequest(req: Request<Params, Query>, res: Response) {
        const moodleSession = req.query.moodleSession;
        const requestedDay = req.params.day;


        let url = '';
        let html = '';

        switch (true) {
            case requestedDay === DAYS.TODAY:
                url = this.settings.moodle.todayUrl;
                break;
            case requestedDay === DAYS.TOMORROW:
                url = this.settings.moodle.tomorrowUrl;
                break;
            default:
                throw new Error('API called with invalid day.')
        }

        try {
            html = (await axios.get(url, {headers: {Cookie: 'MoodleSession=' + moodleSession}})).data;
        } catch (e) {
            res.json({
                error: e.message,
            });
        }

        if (!html) {
            throw new Error('Konnte Plan nicht aus Moodle lesen.')
        }

        res.send(this.planParser.parse(html));
    }
}