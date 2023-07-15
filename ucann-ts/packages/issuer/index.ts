import {
  Capability,
  UcanPayload,
  Fact,
  buildPayload,
  UcanHeader,
} from "@ucans/ucans";
export * from "./sign";

export async function createPayload(
  // issuer pubkey: from the authorizer
  issuerPubKey: string,
  // audiance address is the onchain address of the expected sender
  audienceAddr: string,
  capabilities?: Array<Capability>,
  lifetimeInSeconds?: number,
  expiration?: number,
  notBefore?: number,
  facts?: Array<Fact>,
  proofs?: Array<string>,
  addNonce?: boolean
): Promise<UcanPayload> {
  let chain = audienceAddr.split("1")[0];
  const params = {
    issuer: `did:key:${issuerPubKey}`,
    audience: `did:cosmos:${chain}:auth:${audienceAddr}`,
    capabilities,
    lifetimeInSeconds,
    expiration,
    notBefore,
    facts,
    proofs,
    addNonce,
  };
  return buildPayload(params);
}
