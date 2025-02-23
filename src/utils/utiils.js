export function formattedWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-Uk", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};
