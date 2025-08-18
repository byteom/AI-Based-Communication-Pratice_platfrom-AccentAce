import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import type { AnalysisHistoryItem } from '@/lib/types';

const HISTORY_COLLECTION = 'analysisHistory';

export const addAnalysisHistoryItem = async (item: Partial<AnalysisHistoryItem>) => {
    if (!auth.currentUser) {
        throw new Error("User not authenticated.");
    }
    try {
        const docRef = await addDoc(collection(db, HISTORY_COLLECTION), {
            ...item,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getAnalysisHistoryItems = async (): Promise<AnalysisHistoryItem[]> => {
    if (!auth.currentUser) {
        return [];
    }
    try {
        const q = query(
            collection(db, HISTORY_COLLECTION),
            where('userId', '==', auth.currentUser.uid),
            // orderBy('createdAt', 'desc'), // Temporarily removed to avoid index requirement
            limit(20) // Limit to last 20 history items
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as AnalysisHistoryItem[];
        
        // Sort in memory instead of in query
        const sortedItems = items.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return b.createdAt.toMillis() - a.createdAt.toMillis();
            }
            return 0;
        });
        
        return sortedItems;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
};

export const updateAnalysisHistoryItem = async (id: string, updates: Partial<AnalysisHistoryItem>) => {
    if (!auth.currentUser) {
        throw new Error("User not authenticated.");
    }
    try {
        const docRef = doc(db, HISTORY_COLLECTION, id);
        await updateDoc(docRef, updates);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
};
