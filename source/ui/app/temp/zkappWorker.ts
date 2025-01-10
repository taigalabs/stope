import { Mina, PublicKey, fetchAccount } from "o1js";
import * as Comlink from "comlink";

import type { MerklePos } from "../../../stope_user_proof/src/merkle_pos";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
  AddInstance: null as null | typeof MerklePos,
  zkappInstance: null as null | MerklePos,
  transaction: null as null | Transaction,
};

export const api = {
  async setActiveInstanceToDevnet() {
    const Network = Mina.Network(
      "https://api.minascan.io/node/devnet/v1/graphql"
    );
    console.log("Devnet network instance configured");
    Mina.setActiveInstance(Network);
  },
  async loadContract() {
    // const { Add } = await import("../../contracts/build/src/Add.js");
    const { MerklePos } = await import(
      "../../../stope_user_proof/build/src/merkle_pos.js"
    );
    state.AddInstance = MerklePos;
  },
  async compileContract() {
    await state.AddInstance!.compile();
  },
  async fetchAccount(publicKey58: string) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    return fetchAccount({ publicKey });
  },
  async initZkappInstance(publicKey58: string) {
    const publicKey = PublicKey.fromBase58(publicKey58);
    state.zkappInstance = new state.AddInstance!(publicKey as any);
  },
  async getNum() {
    const currentNum = await state.zkappInstance!.root.get();
    return JSON.stringify(currentNum.toJSON());
  },
  async getRoot() {
    const currentNum = await state.zkappInstance!.root.get();
    return JSON.stringify(currentNum.toJSON());
  },
  async createUpdateTransaction() {
    state.transaction = await Mina.transaction(async () => {
      // await state.zkappInstance!.update();
    });
  },
  async proveUpdateTransaction() {
    await state.transaction!.prove();
  },
  async getTransactionJSON() {
    return state.transaction!.toJSON();
  },
};

// Expose the API to be used by the main thread
Comlink.expose(api);
