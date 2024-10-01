import { Field, Mina, PublicKey, fetchAccount } from "o1js";
import type { MerklePos } from "@taigalabs/stope-user-proof/src/MerklePos";
import { MerkleWitness20 } from "@taigalabs/stope-user-proof/src/MerkleTree20";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
  MerklePos: null as null | typeof MerklePos,
  zkapp: null as null | MerklePos,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async (args: {}) => {
    const Network = Mina.Network(
      "https://api.minascan.io/node/devnet/v1/graphql"
    );
    console.log("Devnet network instance configured.");
    Mina.setActiveInstance(Network);
  },
  loadContract: async (args: {}) => {
    const { MerklePos } = await import(
      "@taigalabs/stope-user-proof/build/src/MerklePos.js"
    );
    state.MerklePos = MerklePos;
  },
  compileContract: async (args: {}) => {
    await state.MerklePos!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    console.log("zkApp initiated");

    state.zkapp = new state.MerklePos!(publicKey);
  },
  membership: async (args: {
    witness: MerkleWitness20;
    leaf: Field;
    root: Field;
  }) => {
    const { witness, leaf, root } = args;
    console.log("worker: wit", witness);

    const _root = witness.calculateRoot(leaf);
    console.log("worker: _root", _root);

    console.log("worker: root", root);

    const transaction = await Mina.transaction(async () => {
      await state.zkapp!.membership(witness, leaf, root);
    });
    state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== "undefined") {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log("Web Worker Successfully Initialized.");
