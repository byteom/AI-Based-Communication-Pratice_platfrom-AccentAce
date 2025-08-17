

import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { createUserProfile } from './userService';

export const signUpUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(userCredential.user.uid, email);
  return userCredential.user;
};

export const signInUser = (email: string, password: string): Promise<any> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = (): Promise<void> => {
  return signOut(auth);
};

export const onAuthUserStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
