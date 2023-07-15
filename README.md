# BIJ

## PassKey as a signer

### DIDs

- `iss`: The issuer of the ucan - we use the did:key method which is the pubkey in ed25519 registered when installing the [cw-ucan] plugin
- `aud`: The audiance (delegated party) - we use the existing [did:cosmos] method,
  but since the namespace is self explanatory,
  there is no need to resolve it. i.e. `did:cosmos:aura:auth:<Address>`

### Crypto background

The signing algo we are using supports [webauthn-2](https://www.w3.org/TR/webauthn-2/#sctn-alg-identifier) is `-7` on the [COSE Algorithms registry]:
which is ECDSA and must use the P256 (aka secp256r1) curve.
the hashing algo SHA256 must be used with the P256 curve (aka secp256r1)

Cosmos-sdk by default supports ECDSA with P256.

However, cosmwasm-std has only verify for secp256k1 and ed25519 verify only.

Therefore the UCANN signature is going to be ed25519, which is also supported by webauthn EdDSA (-8) using Ed25519 as the crv param.

Elliptic curve keys: https://www.rfc-editor.org/rfc/rfc9053.html#name-elliptic-curve-keys
The ECDSA: P256 (aka secp256r1) https://www.rfc-editor.org/rfc/rfc9053.html#section-2.1
[COSE Algorithms registry]: https://www.iana.org/assignments/cose/cose.xhtml#algorithms
[did:cosmos]: https://github.com/cosmos/did-cosmos

## Aura

Aura Serenity testnet uses

- v0.31 of wasmd which supports cosmwasm-std 1.1-1.2
- v0.45.14 cosmos-sdk
