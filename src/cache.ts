/*
 * Manages when to cache. And, when to fetch from the database.
 * It manages the whole cache system.
 */
export class CacheManager {
    private readonly TIMEOUT: number = (2 * 60) * 1000; // 2 mins
    private cache: Map<string, ICacheToken>;

    constructor(
        private middleware: ICacheMiddleware,
    ) {
        this.cache = new Map();
        this.update();
    }

    /**
     * Add token to the cache
     * @param token Token that will be cached
     */
    public add(token: ICacheToken) {
        this.cache.set(token.botId, token);
        console.log('Caching bot/', token.botId, '...');
    }

    /**
     * Remove the token from the cache
     * @param token Token that will be removed from the cache
     */
    public remove(token: ICacheToken) {
        if (this.cache.has(token.botId)) {
            this.cache.delete(token.botId);
            console.log('Removing bot/', token.botId, '...');
        }
    }

    /**
     * Get the token by the id of the bot from the cache
     * @param botId Id of the bot
     */
    public async get(botId: string): Promise<ICacheToken | undefined> {
        return new Promise<ICacheToken | undefined>(async (resolve: any) => {
            let cachedToken: ICacheToken | undefined = this.cache.get(botId);
            if (cachedToken === undefined) {
                cachedToken = await this.middleware.fetch(botId);
                if (cachedToken === undefined) {
                    resolve(undefined);
                    return;
                }
                this.add(cachedToken);
            }
            cachedToken.lifetime = 0;
            resolve(cachedToken);
        });
    }

    /**
     * Update the lifetime every 5 milliseconds
     */
    private update(): void {
        for (const botId in this.cache.keys()) {
            const cachedToken: ICacheToken | undefined = this.cache.get(botId);
            if (cachedToken === undefined) {
                continue;
            }
            cachedToken.lifetime += 5;
            if (cachedToken.lifetime >= this.TIMEOUT) {
                this.remove(cachedToken);
                continue;
            }
        }
        setTimeout(() => this.update(), 5);
    }

}

/*
 * The middleware is useful. When, the token not found.
 * And, we need to fetch it from the database or any way else.
 */
export interface ICacheMiddleware {
    fetch(botId: string): Promise<ICacheToken | undefined>;
}

/*
 * Data of the token that we need to cache.
 * And, know what to do with it.
 */
export interface ICacheToken {
    botId: string;
    token: string;
    lifetime: number;
}
