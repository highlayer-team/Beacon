<template>
  <div class="flex flex-col items-center w-full mb-5 mt-5">
    <label
      @change="contractContent"
      class="w-[300px] flex flex-col items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow-sm tracking-wide uppercase border border-blue cursor-pointer hover:bg-gray-600 hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6"
      >
        <path
          d="M4 14.899A7 7 0 1 1 15.71 8h
          1.79a4.5 4.5 0 0 1 2.5 8.242"
        ></path>
        <path d="M12 12v9"></path>
        <path d="m16 16-4-4-4 4"></path>
      </svg>
      <span class="mt-2 text-xl">Contract Code</span>
      <input
        id="dropzone-file"
        class="hidden"
        type="file"
        accept=".json"
        @change="handleFileChange"
      />
    </label>
    {{ contractName }}
  </div>

  <CoolButton @func="Upload">Upload Code</CoolButton>
</template>

<script setup>
import { useWallet } from "../composables/useState";
import { toXOnly } from "../core/toXOnly";
import { waitUntilUTXO } from "../core/waitUntilUTXO";
import { getScriptPubKey } from "../core/getScriptPubKey";
import { Buffer } from "buffer";
import * as bitcoin from "bitcoinjs-lib";

let contractName = ref(null);
let contractContent;

// let wallet = useWallet();

async function Upload() {
  if (!contractContent) {
    return alert("You must select a contract to upload");
  }
  const wallet = window.unisat;
  let address = (await wallet.getAccounts())[0];
  let pubKey = await wallet.getPublicKey();
  let userNetwork = await wallet.getNetwork();

  const network = bitcoin.networks[userNetwork];
  let testnet;

  if (userNetwork == "testnet") testnet = true;

  const psbt = new bitcoin.Psbt({ network });
  const utxos = await waitUntilUTXO(address, userNetwork);

  console.log(`Using UTXO ${utxos[0].txid}:${utxos[0].vout}`);

  let scriptPubkey = await getScriptPubKey(address, pubKey, network, testnet);
  const pubkeyBuffer = Buffer.from(pubKey, "hex");

  psbt.addInput({
    hash: utxos[0].txid,
    index: utxos[0].vout,
    witnessUtxo: {
      script: scriptPubkey.output,
      value: utxos[0].value,
    },
    tapInternalKey: toXOnly(pubkeyBuffer),
  });

  console.log(contractContent.toString());
  const data = Buffer.from(contractConten.toString());
  const nullDataScript = bitcoin.payments.embed({ data: [data] }).output;

  psbt.addOutput({
    address: address,
    value: utxos[0].value - 211,
  });

  psbt.addOutput({
    script: nullDataScript,
    value: 0,
  });

  const psbtHex = psbt.toHex();

  let hex = await window.unisat.signPsbt(psbtHex, {
    autoFinalized: true,
    toSignInputs: [
      {
        index: 0,
        address: address,
      },
    ],
  });

  try {
    let res = await window.unisat.pushPsbt(hex);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        contractContent = JSON.parse(e.target.result);
        if (!contractContent.contractSrc) {
          return alert("Your contract must define a ContractSrc property");
        }
        contractName.value = file.name;
      } catch (e) {
        return alert("Content Must Be Valid Json");
      }
      console.log(contractContent);
    };
    reader.onerror = (e) => {
      console.error("File could not be read: " + e.target.error);
    };
    reader.readAsText(file);
  }
}
</script>

<style scoped>
.option:hover {
  background-color: #ed5c5c;
}
</style>
