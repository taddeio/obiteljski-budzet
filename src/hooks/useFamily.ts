import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
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
      (doc) => {
        if (doc.exists()) {
          const familyData = doc.data() as Family;
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
    try {
      const newFamilyId = doc(collection(db, "families")).id;
      const inviteCode = generateInviteCode();

      const newMember: FamilyMember = {
        id: user.id,
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
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

      // Create family document
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
    try {
      // Find family by invite code (use as document ID)
      const familySnap = await getDoc(doc(db, "families", inviteCode));
      if (!familySnap.exists()) {
        throw new Error("Kôd za pozivnicu nije validan.");
      }

      const targetFamily = familySnap.data() as Family;
      const targetFamilyId = inviteCode;

      if (!targetFamily) {
        throw new Error("Obitelj nije pronađena.");
      }

      // Create new member
      const memberColor = MEMBER_COLORS[Object.keys(targetFamily.members).length % MEMBER_COLORS.length];
      const newMember: FamilyMember = {
        id: user.id,
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        role: "member",
        color: memberColor,
        joinedAt: Date.now(),
      };

      // Add member to family
      const familyRef = doc(db, "families", targetFamilyId);
      await updateDoc(familyRef, {
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
    if (!family) {
      throw new Error("Obitelj nije učitana.");
    }

    if (family.ownerId !== userId) {
      throw new Error("Samo vlasnik obitelji može pozvati nove članove.");
    }

    // For MVP, we just return the invite code
    // In production, you would send an email with this code
    return family.inviteCode;
  };

  return {
    family,
    members,
    loading,
    createFamily,
    joinFamily,
    inviteMember,
  };
};
