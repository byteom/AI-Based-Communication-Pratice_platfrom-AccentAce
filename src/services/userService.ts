
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot, DocumentData, collection, getDocs, query, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

const USERS_COLLECTION = 'users';

const defaultAvatars = ['😀', '😎', '🚀', '💡', '🎤', '🌟', '🎓', '📚'];

export async function createUserProfile(uid: string, email: string): Promise<void> {
    try {
        await setDoc(doc(db, USERS_COLLECTION, uid), {
            uid,
            email,
            displayName: email.split('@')[0], // Default display name from email
            avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)], // Random default avatar
            isPremium: false,
            role: 'user',
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw new Error("Failed to create user profile.");
    }
}

export async function updateUserProfile(uid: string, data: { displayName: string; avatar: string }): Promise<void> {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw new Error("Failed to update user profile.");
    }
}


export async function getUser(uid: string): Promise<UserProfile | null> {
    try {
        const docSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile: ", error);
        throw new Error("Failed to get user profile.");
    }
}

export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        const q = query(collection(db, USERS_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    } catch (error) {
        console.error("Error getting all users: ", error);
        throw new Error("Failed to retrieve users.");
    }
}


export async function updateUserPremiumStatus(uid: string, isPremium: boolean): Promise<void> {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, {
            isPremium,
            premiumSince: isPremium ? serverTimestamp() : null,
        });
    } catch (error) {
        console.error("Error updating premium status: ", error);
        throw new Error("Failed to update premium status.");
    }
}

export function onUserSnapshot(uid: string, callback: (data: DocumentData | null) => void) {
    const unsub = onSnapshot(doc(db, USERS_COLLECTION, uid), (doc) => {
        callback(doc.data() || null);
    }, (error) => {
        console.error("Error on user snapshot: ", error);
        callback(null);
    });
    return unsub;
}
