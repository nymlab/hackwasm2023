import * as ucans from "@ucans/ucans";
import * as issuer from "vectis-ucan-issuer";

(async function create() {
  const priv = process.argv.slice(2);

  // Mock: in-memory keypair
  const keypair = ucans.EdKeypair.fromSecretKey(priv.pop()!);
  const pubkey = keypair.did().substring(8);
  console.log("pubkey: ", pubkey);

  // create the payload
  const payload = await issuer.createPayload(pubkey, "aura1aedj31kdks");
  console.log("payload: ", payload);

  // jwtAlgo must be "EdDSA"
  // the last function is the signing function
  const result = await ucans.sign(payload, keypair.jwtAlg, (data) => {
    return keypair.sign(data);
  });
  console.log("UCAN: ", result);
})();
