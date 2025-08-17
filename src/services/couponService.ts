
import { db } from '@/lib/firebase';
import type { Coupon } from '@/lib/types';
import { collection, addDoc, getDocs, serverTimestamp, query, where, Timestamp, limit } from 'firebase/firestore';

const COUPONS_COLLECTION = 'coupons';

type CreateCouponData = {
    code: string;
    discountPercent: number;
    expiresAt: Date;
}

export async function createCoupon(couponData: CreateCouponData): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COUPONS_COLLECTION), {
            ...couponData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating coupon: ", error);
        throw new Error("Failed to create coupon.");
    }
}

export async function getAllCoupons(): Promise<Coupon[]> {
    try {
        const q = query(collection(db, COUPONS_COLLECTION));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
    } catch (error) {
        console.error("Error getting coupons: ", error);
        throw new Error("Failed to retrieve coupons.");
    }
}

type ValidateCouponResult = {
    isValid: boolean;
    discountPercent: number;
    message: string;
}

export async function validateCoupon(code: string): Promise<ValidateCouponResult> {
    const defaultResponse = { isValid: false, discountPercent: 0 };
    try {
        const q = query(
            collection(db, COUPONS_COLLECTION),
            where("code", "==", code.toUpperCase()),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { ...defaultResponse, message: "Coupon not found." };
        }

        const couponDoc = querySnapshot.docs[0];
        const coupon = { id: couponDoc.id, ...couponDoc.data() } as Coupon;
        
        const expiresAtDate = (coupon.expiresAt as Timestamp).toDate();

        if (expiresAtDate < new Date()) {
             return { ...defaultResponse, message: "This coupon has expired." };
        }

        return {
            isValid: true,
            discountPercent: coupon.discountPercent,
            message: "Coupon applied successfully!"
        }

    } catch (error) {
         console.error("Error validating coupon: ", error);
         throw new Error("Failed to validate coupon.");
    }
}
