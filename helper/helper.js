export default function currencyFormat(num) {
  return "Rp. " + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
