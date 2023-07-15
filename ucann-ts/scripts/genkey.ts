import * as ucans from "@ucans/ucans";
(async function genkeys() {
  const keypair = await ucans.EdKeypair.create({ exportable: true });
  const exported = await keypair.export();

  console.log(exported);
})();
