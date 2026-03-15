export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style:    'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-NG', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
};