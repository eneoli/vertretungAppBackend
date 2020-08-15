import {ControllerMetaStore} from './controller-meta-store';
import {Application} from 'express';
import {Controller} from './Controller';
import {HTTPMethods} from './HTTTPMethods';

export function applyControllers(app: Application, controllers: typeof Controller[]) {

    const cx = [];
    for (const controller of controllers) {
        cx.push(new controller());
    }

    const controllerMeta = ControllerMetaStore.instance.getControllers();
    for (const meta of controllerMeta) {
        const scope = cx.find((e) => meta.controller.isPrototypeOf(e));
        switch (meta.httpMethod) {
            case HTTPMethods.get:
                app.get(meta.path, meta.method.bind(scope));
                break;
            case HTTPMethods.post:
                app.post(meta.path, meta.method.bind(scope));
                break;
            case HTTPMethods.put:
                app.put(meta.path, meta.method.bind(scope));
                break;
            case HTTPMethods.delete:
                app.delete(meta.path, meta.method.bind(scope));
                break;
        }
    }
}