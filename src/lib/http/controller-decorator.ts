import {ControllerMetaStore} from './controller-meta-store';
import {HTTPMethods} from './HTTTPMethods';
import {Controller} from './Controller';

export function Route(path: string, method: HTTPMethods) {
    return (target: Controller, _name: string, descriptor: PropertyDescriptor) => {
        ControllerMetaStore.instance.addController({
            path: path,
            httpMethod: method,
            controller: target,
            method: descriptor.value,
        });
    }
}