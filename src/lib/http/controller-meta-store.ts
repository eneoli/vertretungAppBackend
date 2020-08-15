import {Controller} from './Controller';
import {HTTPMethods} from './HTTTPMethods';
import {Request, Response} from 'express';

interface ControllerMeta {
    controller: Controller;
    path: string;
    httpMethod: HTTPMethods,
    method: (reg: Request, res: Response) => void;
}

export class ControllerMetaStore {
    private static __instance: ControllerMetaStore;

    private controllers: ControllerMeta[] = [];

    public static get instance() {
        if (!ControllerMetaStore.__instance) {
            ControllerMetaStore.__instance = new ControllerMetaStore();
        }

        return ControllerMetaStore.__instance;
    }

    public addController(controllerMeta: ControllerMeta) {
        this.controllers.push(controllerMeta);
    }

    public getControllers() {
        return this.controllers;
    }
}