export async function getAllFeeRates(testnet) {
  let fees = testnet
    ? await getData("https://mempool.space/testnet/api/v1/fees/recommended")
    : await getData("https://mempool.space/api/v1/fees/recommended");
  fees = JSON.parse(fees);
  return fees;
}
