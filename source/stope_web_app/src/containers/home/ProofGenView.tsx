import React from "react";
import {
  HEIGHT,
  MerkleWitness20,
} from "@taigalabs/stope-user-proof/src/MerkleTree20";
import { Field, MerkleTree, Poseidon } from "o1js";

import styles from "./ProofGenView.module.scss";
import { useCreateProof } from "./useCreateProof";
import ZkappWorkerClient from "./zkappWorkerClient";

const transactionFee = 0.1;

export const ProofGenView: React.FC<ProofGenViewProps> = ({
  zkappWorkerClient,
}) => {
  const handleClickCreateProof = React.useCallback(async () => {
    const tree = new MerkleTree(HEIGHT);
    const leaf = Poseidon.hash([Field.from(0)]);
    tree.setLeaf(BigInt(0), leaf);

    const root = tree.getRoot();
    const witness = new MerkleWitness20(tree.getWitness(BigInt(0)));

    console.log("Creating a transaction...");

    console.log("proof gen view, root", root);

    await zkappWorkerClient!.membership(witness, leaf, root);

    console.log("Creating proof...");
    await zkappWorkerClient!.proveUpdateTransaction();

    console.log("Requesting send transaction...");
    const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

    console.log("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
    console.log(`View transaction at ${transactionLink}`);
  }, [zkappWorkerClient]);

  return (
    <div className={styles.wrapper}>
      33
      <button type="button" onClick={handleClickCreateProof}>
        Create proof
      </button>
      {/* <div className={styles.center} style={{ padding: 0 }}> */}
      {/*   Current state in zkApp: {state.currentNum!.toString()}{" "} */}
      {/* </div> */}
      {/* <button */}
      {/*   className={styles.card} */}
      {/*   onClick={createProof} */}
      {/*   disabled={state.creatingTransaction} */}
      {/* > */}
      {/*   Create proof */}
      {/* </button> */}
      {/* <button className={styles.card} onClick={importLedgerState}> */}
      {/*   Get Latest State */}
      {/* </button> */}
    </div>
  );
};

export interface ProofGenViewProps {
  zkappWorkerClient: ZkappWorkerClient;
}
