import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Family, FamilyMember, User } from "../types/index";
import { MEMBER_COLORS } from "../utils/categories";

export interface UseFamilyReturn {
  family: Family | null;
  members: FamilyMember[];
  loading: boolean;
  createFamily: (familyName: string, user: User) => Promise<string>;
  joinFamily: (inviteCode: string, user: User) => Promise<void>;
  inviteMember: (email: string) => Promise<string>;
  regenerateInviteCode: () => Promise<string>;
}

// Generate a random invite code
const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useFamily = (userId: string | null, familyId: string | null): UseFamilyReturn => {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to family data
  useEffect(() => {
    if (!familyId || !userId) {
      setFamily(null);
      setMembers([]);
      setLoading(false);
      return;
    }

    const familyRef = doc(db, "families", familyId);
    const unsubscribe = onSnapshot(
      familyRef,
      async (snap) => {
        if (snap.exists()) {
          const familyData = snap.data() as Family;

          // Auto-fix: generate invite code if missing
          if (!familyData.inviteCode) {
            const newCode = generateInviteCode();
            await updateDoc(familyRef, { inviteCode: newCode }).catch(() => {});
            familyData.inviteCode = newCode;
          }

          setFamily(familyData);
          setMembers(Object.values(familyData.members || {}));
        } else {
          setFamily(null);
          setMembers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching family:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [familyId, userId]);

  const createFamily = async (familyName: string, user: User): Promise<string> => {
    if (!user?.id) throw new Error("Korisnik nije prijavljen.");

    try {
      const newFamilyId = doc(collection(db, "families")).id;
      const inviteCode = generateInviteCode();

      const newMember: FamilyMember = {
        id: user.id,
        userId: user.id,
        email: user.email || "",
        displayName: user.displayName || user.email || "Vlasnik",
        role: "owner",
        color: MEMBER_COLORS[0],
        joinedAt: Date.now(),
      };

      const newFamily: Family = {
        id: newFamilyId,
        name: familyName,
        ownerId: user.id,
        members: {
          [user.id]: newMember,
        },
        inviteCode: inviteCode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(doc(db, "families", newFamilyId), newFamily);

      // Update user document with family ID
      await updateDoc(doc(db, "users", user.id), {
        familyId: newFamilyId,
      });

      return newFamilyId;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Kreiranje obitelji nije uspjelo."
      );
    }
  };

  const joinFamily = async (inviteCode: string, user: User): Promise<void> => {
    if (!user?.id) throw new Error("Korisnik nije prijavljen.");

    try {
      // Query family by invite code field
      const q = query(
        collection(db, "families"),
        where("inviteCode", "==", inviteCode.toUpperCase())
      );
      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        throw new Error("Kôd za pozivnicu nije validan.");
      }

      const familyDoc = querySnap.docs[0];
      const targetFamily = familyDoc.data() as Family;
      const targetFamilyId = familyDoc.id;

      // Check not already a member
      if (targetFamily.members?.[user.id]) {
        throw new Error("Već ste član ove obitelji.");
      }

      const memberColor =
        MEMBER_COLORS[Object.keys(targetFamily.members || {}).length % MEMBER_COLORS.length];

      const newMember: FamilyMember = {
        id: user.id,
        userId: user.id,
        email: user.email || "",
        displayName: user.displayName || user.email || "Član",
        role: "member",
        color: memberColor,
        joinedAt: Date.now(),
      };

      // Add member to family
      await updateDoc(doc(db, "families", targetFamilyId), {
        [`members.${user.id}`]: newMember,
        updatedAt: serverTimestamp(),
      });

      // Update user document with family ID
      await updateDoc(doc(db, "users", user.id), {
        familyId: targetFamilyId,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Pridruživanje obitelji nije uspjelo."
      );
    }
  };

  const inviteMember = async (): Promise<string> => {
    if (!family) throw new Error("Obitelj nije učitana.");
    return family.inviteCode;
  };

  const regenerateInviteCode = async (): Promise<string> => {
    if (!family?.id) throw new Error("Obitelj nije učitana.");
    if (family.ownerId !== userId) {
      throw new Error("Samo vlasnik može promijeniti pozivni kod.");
    }

    const newCode = generateInviteCode();
    await updateDoc(doc(db, "families", family.id), { inviteCode: newCode });
    return newCode;
  };

  return {
    family,
    members,
    loading,
    createFamily,
    joinFamily,
    inviteMember,
    regenerateInviteCode,
  };
};
