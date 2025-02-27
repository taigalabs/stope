import { Field, PublicKey, fetchAccount, Mina } from "o1js";

import type {
  WorkerFunctions,
  ZkappWorkerReponse,
  ZkappWorkerRequest,
} from "./zkappWorker";
import { MerkleWitness20 } from "@taigalabs/stope-user-proof/src/merkle_pos";
// import { MerkleWitness20 } from "@taigalabs/stope-user-proof/src/merkle_tree_20";

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  setActiveInstanceToDevnet() {
    return this._call("setActiveInstanceToDevnet", {});
  }

  loadContract() {
    return this._call("loadContract", {});
  }

  compileContract() {
    return this._call("compileContract", {});
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call("fetchAccount", {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call("initZkappInstance", {
      publicKey58: publicKey.toBase58(),
    });
  }

  async membership(
    _witness: MerkleWitness20,
    _leaf: Field,
    _root: Field,
    _isin: Field,
    _balance: Field,
    _secret: Field
  ) {
    const witness = _witness.toJSON();
    const leaf = _leaf.toJSON();
    const root = _root.toJSON();

    const isin = _isin.toJSON();
    const balance = _balance.toJSON();
    const secret = _secret.toJSON();

    console.log("client", witness, leaf, root, isin, balance, secret);

    return this._call("membership", {
      witness,
      leaf,
      root,
      isin,
      balance,
      secret,
    });
  }

  proveUpdateTransaction() {
    return this._call("proveUpdateTransaction", {});
  }

  async getTransactionJSON() {
    const result = await this._call("getTransactionJSON", {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkappWorker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
