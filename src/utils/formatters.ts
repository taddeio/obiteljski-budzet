// Format currency to EUR with Croatian locale
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date to DD.MM.YYYY format
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date to DD. MMMM YYYY format (e.g., "15. ožujka 2024")
export const formatDateLong = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Format time to HH:MM format
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date and time together
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get month name in Croatian
export const getMonthName = (month: number): string => {
  const date = new Date(2024, month - 1, 1);
  return date.toLocaleDateString("hr-HR", { month: "long" });
};

// Get month and year string (e.g., "ožujak 2024")
export const getMonthYearString = (year: number, month: number): string => {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("hr-HR", {
    month: "long",
    year: "numeric",
  });
};

// Format relative time (e.g., "2 dana unazad")
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Upravo sada";
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minuta" : "minuta"} unazad`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "sat" : "sati"} unazad`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "dan" : "dana"} unazad`;
  } else {
    return formatDate(timestamp);
  }
};

// Abbreviate number (e.g., 1500 -> "1.5K")
export const abbreviateNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
};
