import {
  CircuitString,
  Field,
  Mina,
  Poseidon,
  PublicKey,
  fetchAccount,
} from "o1js";
import {
  MerkleWitness20,
  type MerklePos,
} from "@taigalabs/stope-user-proof/src/merkle_pos";

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
      "@taigalabs/stope-user-proof/build/src/merkle_pos.js"
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

    const _witness = MerkleWitness20.fromJSON(witness);
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
      await state.zkapp!.membership(
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
