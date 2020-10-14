import {ServiceDescriptor} from './service-descriptor';
import {ServiceFactory} from './service-factory';

type ParameterlessConstructorOf<T> = new() => T;

export class ServiceLocator {
    private serviceDescriptors: ServiceDescriptor<unknown>[] = [];

    public get<T>(service: ParameterlessConstructorOf<T>): T {

        let descriptor;
        for (const serviceDescriptor of this.serviceDescriptors) {
            if (serviceDescriptor.constructor === service) {
                descriptor = serviceDescriptor;
            }
        }

        if (!descriptor) {
            try {
                this.serviceDescriptors.push({
                    constructor: service,
                    instance: new service(),
                });

                return this.get(service);
            } catch (e) {
                throw new Error('Tried to instantiate a new class but failed. Register it by providing a factory...')
                throw e;
            }
        }

        if (!descriptor.instance) {
            if (descriptor.factory) {
                descriptor.instance = descriptor.factory();
            } else {
                throw new Error('There is no way given to create the requested object: ' + service);
            }
        }

        return descriptor.instance as T;

    }

    public register<T>(serviceClass: ParameterlessConstructorOf<T>, factory: ServiceFactory<T>) {
        this.serviceDescriptors.push({
            constructor: serviceClass,
            factory: factory,
        });
    }

    public registerInstance<T>(instance: T) {

        this.serviceDescriptors.push({
            instance: instance,
            constructor: (typeof instance as unknown) as ParameterlessConstructorOf<T>,
        });
    }
}