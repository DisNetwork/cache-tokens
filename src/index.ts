import express, { Request, Response } from 'express';
import { FirestoreMiddleware } from './middlware';
import { resolve } from 'path';
import { CacheManager, ICacheToken } from './cache';

// Create the express application
const app: express.Application = express();

// Setup the firestore
const middleware: FirestoreMiddleware = new FirestoreMiddleware(
    resolve('./../service-account.json'),
);

// Setup the cache manager
const manager: CacheManager = new CacheManager(
    middleware,
);

// Setup the bot route
app.get('/bot', async (req: Request, res: Response) => {
    const botId = req.body.id;
    const cachedToken: ICacheToken | undefined = await manager.get(botId);
    if (cachedToken === undefined) {
        res.sendStatus(404);
        return;
    }
    res.json(cachedToken.token);
});

// Listen to port 2030
app.listen(2030, () => {
    console.log('>> Listening to port 2030...');
});
