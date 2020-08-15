import {ControllerStore} from './controller-store';
import {HTTPMethods} from './HTTTPMethods';

export function Route(path: string, method: HTTPMethods) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
        ControllerStore.instance.addController({
            path: path,
            httpMethod: method,
            controller: target,
            method: name,
        });
        console.log(target);
        console.log(name);
        console.log(descriptor);
    }
}