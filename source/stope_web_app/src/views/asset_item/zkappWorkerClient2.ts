import { Field } from "o1js";
import * as Comlink from "comlink";

import { MerkleWitness20 } from "@taigalabs/stope-user-proof";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------
  worker: Worker;
  // Proxy to interact with the worker's methods as if they were local
  remoteApi: Comlink.Remote<typeof import("./zkappWorker2").api>;

  constructor() {
    // Initialize the worker from the zkappWorker module
    const worker = new Worker(new URL("./zkappWorker2.ts", import.meta.url), {
      type: "module",
    });
    // Wrap the worker with Comlink to enable direct method invocation
    this.remoteApi = Comlink.wrap(worker);
  }

  async setActiveInstanceToDevnet() {
    return this.remoteApi.setActiveInstanceToDevnet();
  }

  async loadContract() {
    return this.remoteApi.loadContract();
  }

  async compileContract() {
    return this.remoteApi.compileContract();
  }

  async fetchAccount(publicKeyBase58: string) {
    return this.remoteApi.fetchAccount(publicKeyBase58);
  }

  async initZkappInstance(publicKeyBase58: string) {
    return this.remoteApi.initZkappInstance(publicKeyBase58);
  }

  // async getNum(): Promise<Field> {
  //   const result = await this.remoteApi.getNum();
  //   return Field.fromJSON(JSON.parse(result as string));
  // }
  //
  async getBal(): Promise<Field> {
    const result = await this.remoteApi.getBal();
    return Field.fromJSON(JSON.parse(result as string));
  }

  async getRoot(): Promise<Field> {
    const result = await this.remoteApi.getRoot();
    return Field.fromJSON(JSON.parse(result as string));
  }

  async createUpdateTransaction() {
    return this.remoteApi.createUpdateTransaction();
  }

  async membership(
    _witness: MerkleWitness20,
    _leaf: Field,
    _root: Field,
    _isin: Field,
    _balance: Field,
    _secret: Field
  ) {
    const witness = (_witness as any).toJSON();
    const leaf = _leaf.toJSON();
    const root = _root.toJSON();

    const isin = _isin.toJSON();
    const balance = _balance.toJSON();
    const secret = _secret.toJSON();

    console.log("client", witness, leaf, root, isin, balance, secret);

    return this.remoteApi.membership({
      witness,
      leaf,
      root,
      isin,
      balance,
      secret,
    });
  }

  async proveUpdateTransaction() {
    return this.remoteApi.proveUpdateTransaction();
  }

  async getTransactionJSON() {
    return this.remoteApi.getTransactionJSON();
  }
}
