import { Firestore, DocumentReference, DocumentSnapshot } from '@google-cloud/firestore';
import { ICacheMiddleware, ICacheToken } from "./cache";

/**
 * Middleware that fetches the bot data from the Firestore database
 */
export class FirestoreMiddleware implements ICacheMiddleware {
    private firestore: Firestore;

    /**
     * Setup the firestore database
     */
    constructor(
        private path: string,
    ) {
        this.firestore = new Firestore({
            keyFilename: this.path,
        });
    }

    /**
     * Fetches the bot data from the Firestore database.
     */
    public fetch(botId: string): Promise<ICacheToken | undefined> {
        return new Promise<ICacheToken | undefined>(async (resolve: (token: ICacheToken | undefined) => void) => {
            const doc: DocumentReference = this.firestore.collection('bot').doc(botId);
            const snapshot: DocumentSnapshot = await doc.get();
            if (!snapshot.exists) {
                resolve(undefined);
                return;
            }
            const data: any = snapshot.data();
            const token: ICacheToken = {
                botId: botId,
                lifetime: 0,
                token: data.token,
            };
            console.log('Fetch bot/', botId, '...');
            resolve(token);
        });
    }

}
