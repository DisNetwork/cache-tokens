import { Firestore, DocumentReference, DocumentSnapshot } from '@google-cloud/firestore';
import { CacheMiddleware, CacheToken } from "./cache";

/**
 * Middleware that fetches the bot data from the Firestore database
 */
export class FirestoreMiddleware implements CacheMiddleware {
    private firestore: Firestore;

    /**
     * Setup the firestore database
     */
    constructor (
        private path: string
    ) {
        this.firestore = new Firestore({
            keyFilename: this.path
        });
    }

    /**
     * Fetches the bot data from the Firestore database.
     */
    public fetch(botId: string): Promise<CacheToken | undefined> {
        return new Promise<CacheToken | undefined>(async (resolve: Function) => {
            const doc: DocumentReference = this.firestore.collection('bot').doc(botId);
            const snapshot: DocumentSnapshot = await doc.get();
            if (!snapshot.exists) {
                resolve(undefined);
                return;
            }
            const data: any = snapshot.data();
            const token: CacheToken = {
                botId: botId,
                lifetime: 0,
                token: data.token
            };
            resolve(token);
        });
    }

}
