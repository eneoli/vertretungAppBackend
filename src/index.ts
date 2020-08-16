import * as bodyParser from 'body-parser';
import {createHttpServer} from './create-http-server';
import {DefaultController} from './controller/DefaultController';
import {applyControllers} from './lib/http/apply-controllers';
import {MoodleSessionController} from './controller/MoodleSessionController';
import {SubstitutionPlanController} from './controller/SubstitutionPlanController';
import {SecurityController} from './controller/SecurityController';


const server = createHttpServer();

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

applyControllers(server, [
    DefaultController,
    MoodleSessionController,
    SubstitutionPlanController,
    SecurityController,
]);

server.listen(4000, () => {
    console.log('Server is listening on port 4000');
});