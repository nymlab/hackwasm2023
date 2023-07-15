import {
  Secp256k1,
  Secp256k1Keypair,
  EnglishMnemonic,
  Slip10,
  Slip10Curve,
  Bip39,
} from "@cosmjs/crypto";
import {
  SigningCosmWasmClient,
  Code,
  SigningCosmWasmClientOptions,
  ExecuteResult,
} from "@cosmjs/cosmwasm-stargate";
import {
  DirectSecp256k1HdWallet,
  GeneratedType,
  OfflineSigner,
  Registry,
} from "@cosmjs/proto-signing";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { makeCosmoshubPath, StdFee } from "@cosmjs/amino";
import { GasPrice } from "@cosmjs/stargate";
import {
  cosmosAminoConverters,
  cosmosProtoRegistry,
  cosmwasmAminoConverters,
  cosmwasmProtoRegistry,
  ibcProtoRegistry,
  ibcAminoConverters,
  osmosisAminoConverters,
  osmosisProtoRegistry,
} from "osmojs";

export interface Chain {
  readonly chainId: string;
  readonly chainName: string;
  readonly addressPrefix: string;
  readonly rpcUrl: string;
  readonly feeToken: string;
  readonly gasPrice: number;
}

class CWClient extends SigningCosmWasmClient {
  constructor(
    tmClient: Tendermint34Client | undefined,
    readonly sender: string,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions
  ) {
    super(tmClient, signer, options);
  }

  static async connectHostWithAccount() {
    const hostChain: Chain = {
      chainId: "serenity-testnet-001",
      chainName: "Aura Testnet",
      addressPrefix: "aura",
      rpcUrl: "https://rpc.serenity.aura.network",
      feeToken: "uaura",
      gasPrice: 0.05,
    };
    return await this.connectWithAccount(hostChain);
  }

  static async getSignerWithMnemonic(
    { addressPrefix }: Chain,
    mnemonic: string
  ): Promise<DirectSecp256k1HdWallet> {
    return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: addressPrefix,
    });
  }

  static async mnemonicToKeyPair(mnemonic: string): Promise<Secp256k1Keypair> {
    const m = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(m);
    const { privkey } = Slip10.derivePath(
      Slip10Curve.Secp256k1,
      seed,
      makeCosmoshubPath(0) as any
    );
    return await Secp256k1.makeKeypair(privkey);
  }

  async getOnchainContracts(codeId: number): Promise<Code> {
    const { id, creator, checksum } = await this.getCodeDetails(codeId);
    return { id, creator, checksum };
  }

  private static async connectWithAccount(chain: Chain) {
    const { addressPrefix, rpcUrl, gasPrice, feeToken, chainId } = chain;

    const signer = await CWClient.getSignerWithMnemonic(chain, mnemonic);
    const [{ address }] = await signer.getAccounts();

    const tmClient = await Tendermint34Client.connect(rpcUrl);

    const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
      ...cosmosProtoRegistry,
      ...cosmwasmProtoRegistry,
      ...ibcProtoRegistry,
      ...osmosisProtoRegistry,
    ];

    const aminoConverters = {
      ...cosmosAminoConverters,
      ...cosmwasmAminoConverters,
      ...ibcAminoConverters,
      ...osmosisAminoConverters,
    };

    const extraOptions = chainId.includes("osmo")
      ? { protoRegistry, aminoConverters }
      : {};

    return new CWClient(tmClient, address, signer, {
      broadcastPollIntervalMs: 500,
      gasPrice: GasPrice.fromString(gasPrice + feeToken),
      prefix: addressPrefix,
      ...extraOptions,
    });
  }
}

export default CWClient;
