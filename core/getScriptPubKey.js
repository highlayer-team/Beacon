import { Buffer } from "buffer";
import * as bitcoin from "bitcoinjs-lib";
import { toXOnly } from "../core/toXOnly";
import ecc from "@bitcoinerlab/secp256k1";

export async function getScriptPubKey(
  address,
  publicKey,
  network,
  testnet = false
) {
  try {
    bitcoin.initEccLib(ecc);
    let prefix = testnet ? "tb" : "bc";
    let scriptPubKey;
    if (address.startsWith("1")) {
      scriptPubKey = bitcoin.payments.p2pkh({ address });
    } else if (address.startsWith("3")) {
      // P2SH address
      scriptPubKey = bitcoin.payments.p2sh({ address });
    } else if (address.startsWith(`${prefix}1q`)) {
      // P2WPKH address
      scriptPubKey = bitcoin.payments.p2wpkh({ address });
    } else if (address.startsWith(`${prefix}1p`)) {
      // P2TR address
      if (publicKey) {
        const pubkeyBuffer = Buffer.from(publicKey, "hex");

        scriptPubKey = bitcoin.payments.p2tr({
          internalPubkey: toXOnly(pubkeyBuffer),
          network,
        });
      } else {
        throw new Error("Public key is required for P2TR addresses");
      }
    }

    return scriptPubKey;
  } catch (error) {
    console.error("Error generating scriptPubKey:", error);
  }
}
