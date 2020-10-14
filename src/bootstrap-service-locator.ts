import {ServiceLocator} from './lib/di/service-locator';
import {Settings} from './service/Settings';

export let di: ServiceLocator;

export function bootstrapServiceLocator() {
    di = new ServiceLocator();

    di.register(Settings, () => {
        const settings = new Settings();
        settings.load(__dirname + '/config.yml');
        return settings;
    })
}