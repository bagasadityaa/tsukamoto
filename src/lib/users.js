import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
export async function registerUser(email, password, role) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await setDoc(doc(db, "users", credential.user.uid), {
    email,
    role,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

export function useAuth() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);

        const userSnap = await getDoc(userRef);

        const data = userSnap.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data?.role || "karyawan",
        });
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return {
    user,
    loading,
  };
}
