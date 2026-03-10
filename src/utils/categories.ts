import type { Category } from "../types/index";

// Expense categories
export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Hrana",
    icon: "🍔",
    color: "#FF6B6B",
  },
  {
    id: "housing",
    label: "Stanovanje",
    icon: "🏠",
    color: "#FF8C42",
  },
  {
    id: "transport",
    label: "Prijevoz",
    icon: "🚗",
    color: "#FFB84D",
  },
  {
    id: "kids",
    label: "Djeca",
    icon: "👶",
    color: "#FF69B4",
  },
  {
    id: "bills",
    label: "Računi",
    icon: "📄",
    color: "#9B59B6",
  },
  {
    id: "health",
    label: "Zdravstvo",
    icon: "⚕️",
    color: "#E74C3C",
  },
  {
    id: "clothes",
    label: "Odjeća",
    icon: "👕",
    color: "#1ABC9C",
  },
  {
    id: "fun",
    label: "Zabava",
    icon: "🎮",
    color: "#3498DB",
  },
  {
    id: "savings",
    label: "Štednja",
    icon: "🏦",
    color: "#00D09C",
  },
  {
    id: "other",
    label: "Ostalo",
    icon: "💬",
    color: "#95A5A6",
  },
];

// Income categories
export const INCOME_CATEGORIES: Category[] = [
  {
    id: "salary",
    label: "Plaća",
    icon: "💼",
    color: "#00D09C",
  },
  {
    id: "freelance",
    label: "Freelance",
    icon: "💻",
    color: "#4C6FFF",
  },
  {
    id: "other_inc",
    label: "Ostalo",
    icon: "💰",
    color: "#F1C40F",
  },
];

// All categories combined
export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// Member colors array for family member identification
export const MEMBER_COLORS: string[] = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Light Blue
  "#F8B88B", // Peach
  "#ABEBC6", // Light Green
];

// Helper function to get category by ID
export const getCategoryById = (
  id: string
): Category | undefined => {
  return ALL_CATEGORIES.find((cat) => cat.id === id);
};

// Helper function to get expense categories
export const getExpenseCategories = (): Category[] => {
  return EXPENSE_CATEGORIES;
};

// Helper function to get income categories
export const getIncomeCategories = (): Category[] => {
  return INCOME_CATEGORIES;
};

// Helper function to get a color for a member
export const getMemberColor = (index: number): string => {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
};
