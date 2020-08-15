import {Controller} from './Controller';
import {HTTPMethods} from './HTTTPMethods';

interface ControllerMeta {
    controller: Controller;
    path: string;
    httpMethod: HTTPMethods,
    method: string;
}

export class ControllerStore {
    private static __instance: ControllerStore;

    private controllers: ControllerMeta[] = [];

    public static get instance() {
        if (!ControllerStore.__instance) {
            ControllerStore.__instance = new ControllerStore();
        }

        return ControllerStore.__instance;
    }

    public addController(controllerMeta: ControllerMeta) {
        this.controllers.push(controllerMeta);
    }

    public getControllers() {
        return this.controllers;
    }
}