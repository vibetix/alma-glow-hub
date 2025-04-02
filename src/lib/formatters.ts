
/**
 * Format a number as Ghana cedis
 */
export const formatCedis = (amount: number): string => {
  return `₵${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format a number as a percentage
 */
export const formatPercent = (value: number): string => {
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}%`;
};
