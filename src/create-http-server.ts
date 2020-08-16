import express, {Application} from 'express';

export function createHttpServer(): Application {
    const app = express();

    return app;
}