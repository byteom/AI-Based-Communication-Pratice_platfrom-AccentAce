
import { db } from '@/lib/firebase';
import type { FeatureFlag } from '@/lib/types';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

const FEATURE_FLAGS_COLLECTION = 'featureFlags';

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
        const querySnapshot = await getDocs(collection(db, FEATURE_FLAGS_COLLECTION));
        if (querySnapshot.empty) {
            // Optional: Seed the database with default values if it's empty
            console.log("No feature flags found in the database.");
            return [];
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeatureFlag));
    } catch (error) {
        console.error("Error getting feature flags: ", error);
        throw new Error("Failed to retrieve feature flags.");
    }
}

export async function updateFeatureFlag(id: string, isPremium: boolean): Promise<void> {
    try {
        const docRef = doc(db, FEATURE_FLAGS_COLLECTION, id);
        await setDoc(docRef, { isPremium }, { merge: true });
    } catch (error) {
        console.error(`Error updating feature flag for ${id}:`, error);
        throw new Error("Failed to update feature flag.");
    }
}
