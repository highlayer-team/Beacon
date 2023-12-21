export async function getAllFeeRates(testnet) {
  let fees = testnet
    ? await getData("https://mempool.space/testnet/api/v1/fees/recommended")
    : await getData("https://mempool.space/api/v1/fees/recommended");
  fees = JSON.parse(fees);
  return fees;
}
function isValidJson(content) {
  if (!content) return;
  try {
    var json = JSON.parse(content);
  } catch (e) {
    return;
  }
  return true;
}
