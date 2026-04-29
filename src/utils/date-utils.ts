/**
 * Calculates the number of days remaining until a given expiry date.
 * Returns a positive number for future dates, 0 for today, and negative for past dates.
 */
export const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Returns a formatted string for the expiration date (YYYY-MM-DD).
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculates an expiration date based on a given number of days from today.
 */
export const getExpiryFromDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};
