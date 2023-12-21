export async function waitUntilUTXO(address, testnet) {
  return new Promise((resolve, reject) => {
    let intervalId;
    const checkForUtxo = async () => {
      try {
        let response = testnet
          ? await fetch(
              `https://mempool.space/testnet/api/address/${address}/utxo`
            )
          : await fetch(`https://mempool.space/api/address/${address}/utxo`);
        response = await fetch(
          `https://mempool.space/testnet/api/address/${address}/utxo`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
          resolve(data);
          clearInterval(intervalId);
        }
      } catch (error) {
        reject(error);
        clearInterval(intervalId);
      }
    };
    checkForUtxo();
    intervalId = setInterval(checkForUtxo, 10000);
  });
}
