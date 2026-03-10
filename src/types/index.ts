export interface User {
  id: string;
  email: string;
  displayName: string;
  familyId: string | null;
  createdAt: number;
  photoURL?: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  role: "owner" | "member";
  color: string; // Hex color for member identification
  joinedAt: number;
}

export interface Family {
  id: string;
  name: string;
  ownerId: string;
  members: Record<string, FamilyMember>;
  inviteCode: string;
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  id: string;
  familyId: string;
  memberId: string; // ID of the member who created it
  amount: number;
  description: string;
  category: string; // References category.id
  type: "income" | "expense"; // Removed "transfer" for MVP
  date: number; // Timestamp
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  id: string;
  familyId: string;
  category: string;
  limit: number;
  period: "monthly" | "yearly"; // Default to monthly
  createdAt: number;
  updatedAt: number;
}

export interface Goal {
  id: string;
  familyId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: number | null; // Timestamp or null for no deadline
  createdAt: number;
  updatedAt: number;
}

export interface PendingInvite {
  id: string;
  familyId: string;
  email: string;
  inviteCode: string;
  createdAt: number;
  expiresAt: number;
  status: "pending" | "accepted" | "rejected";
}

export interface Category {
  id: string;
  label: string; // Croatian label
  icon: string; // Emoji
  color: string; // Hex color
}
