// Get rid of Y Cordinate
export function toXOnly(pubkey) {
  return pubkey.subarray(1, 33);
}
