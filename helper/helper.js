export default function currencyFormat(num) {
  if (num == undefined) {
    return "Rp. 0";
  } else {
    return "Rp. " + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
}
