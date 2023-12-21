<template>
  <button
    @click="ConnectWallet"
    v-if="!wallet"
    class="inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option text-white text-primary-foreground h-10 px-4 py-2 mb-5 w-3/4"
  >
    Connect Wallet
  </button>
  <button
    @click.prevent.stop="$emit('func')"
    v-else
    class="inline-flex items-center justify-center rounded-md text-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option text-white text-primary-foreground h-10 px-4 py-2 mb-5 w-3/4"
  >
    <slot />
  </button>
</template>

<script setup>
import { useWallet } from "../composables/useState";

const { func } = defineProps(["func"]);

const wallet = useWallet();

async function ConnectWallet() {
  if (typeof window.unisat == "undefined") {
    alert("You need to install UniSat");
  }

  try {
    let accounts = await window.unisat.requestAccounts();
    wallet.value = window.unisat;
    console.log("connect success", accounts);
  } catch (e) {
    return console.log("connect failed");
  }
}
</script>
