import { Field, Mina, PublicKey, fetchAccount } from "o1js";
import * as Comlink from "comlink";
import type { MerklePos } from "../../../stope_user_proof/build/src/merkle_pos";

import { HEIGHT, MerkleWitness20 } from "./types";

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
    console.log("network", Network);
  },
  async loadContract() {
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
  // async getNum() {
  //   const currentNum = await (state.zkappInstance! as any).num.get();
  //   return JSON.stringify(currentNum.toJSON());
  // },
  async getBal() {
    const currentNum = await state.zkappInstance!.bal.get();
    return JSON.stringify(currentNum.toJSON());
  },

  async getRoot() {
    const currentNum = await state.zkappInstance!.root.get();
    return JSON.stringify(currentNum.toJSON());
  },
  // async createUpdateTransaction() {
  //   state.transaction = await Mina.transaction(async () => {
  //     await state.zkappInstance!.update();
  //   });
  // },
  async createUpdateTransaction() {
    state.transaction = await Mina.transaction(async () => {
      // await state.zkappInstance!.update();
    });
  },
  membership: async (args: {
    witness: string;
    leaf: string;
    root: string;
    isin: string;
    balance: string;
    secret: string;
  }) => {
    const { witness, leaf, root, isin, balance, secret } = args;
    console.log("witness", witness);
    console.log("leaf", leaf);
    console.log("root", root);
    console.log("secret", secret);
    console.log("isin", isin);
    console.log("balance", balance);

    const _witness = (MerkleWitness20 as any).fromJSON(witness);
    console.log("_witness", _witness);

    const _root = Field.fromJSON(root);
    console.log("_root", _root);

    const _leaf = Field.fromJSON(leaf);
    console.log("_leaf", _leaf);

    const _root2 = _witness.calculateRoot(_leaf);
    console.log("_root2", _root2);

    const _secret = Field.fromJSON(secret);
    console.log("_secret", _secret);

    const _isin = Field.fromJSON(isin);
    console.log("_isin", _isin);

    const _balance = Field.fromJSON(balance);
    console.log("_balance", _balance);

    const transaction = await Mina.transaction(async () => {
      await state.zkappInstance!.membership(
        _witness,
        _leaf,
        _root,
        _isin,
        _balance,
        _secret
      );
    });
    state.transaction = transaction;
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
