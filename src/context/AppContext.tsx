import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFamily } from "../hooks/useFamily";
import type { User, Family, FamilyMember } from "../types/index";

interface AppContextType {
  // Auth
  user: User | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // Family
  family: Family | null;
  members: FamilyMember[];
  familyLoading: boolean;
  createFamily: (familyName: string, user: User) => Promise<string>;
  joinFamily: (inviteCode: string, user: User) => Promise<void>;
  inviteMember: () => Promise<string>;

  // Combined state
  isLoading: boolean;
  isAuthenticated: boolean;
  hasFamilySetup: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const family = useFamily(auth.user?.id || null, auth.user?.familyId || null);

  const isLoading = auth.loading || family.loading;
  const isAuthenticated = !!auth.user;
  const hasFamilySetup = !!family.family;

  const value: AppContextType = {
    // Auth
    user: auth.user,
    authLoading: auth.loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,

    // Family
    family: family.family,
    members: family.members,
    familyLoading: family.loading,
    createFamily: family.createFamily,
    joinFamily: family.joinFamily,
    inviteMember: family.inviteMember as () => Promise<string>,

    // Combined
    isLoading,
    isAuthenticated,
    hasFamilySetup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
