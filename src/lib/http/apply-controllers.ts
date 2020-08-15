import {ControllerStore} from './controller-store';
import {Application} from 'express';
import {Controller} from './Controller';
import {HTTPMethods} from './HTTTPMethods';

export function applyControllers(app: Application, controllers: typeof Controller[]) {

    const cx = [];
    for (const controller of controllers) {
        cx.push(new controller());
    }

    const controllerMeta = ControllerStore.instance.getControllers();
    for (const meta of controllerMeta) {
        switch (meta.httpMethod) {
            case HTTPMethods.get:
                app.get(meta.path, meta.controller[meta.method]);
                break;
            case HTTPMethods.post:
                app.post(meta.path, meta.controller[meta.method]);
                break;
            case HTTPMethods.put:
                app.put(meta.path, meta.controller[meta.method]);
                break;
            case HTTPMethods.delete:
                app.delete(meta.path, meta.controller[meta.method]);

        }
    }
}