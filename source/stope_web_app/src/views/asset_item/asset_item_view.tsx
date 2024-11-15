"use client";

import React from "react";
import { mockAssets } from "@taigalabs/stope-mock-data";
import {
  HEIGHT,
  MerkleWitness20,
} from "@taigalabs/stope-user-proof/src/MerkleTree20";
import { Field, MerkleTree, Poseidon } from "o1js";

import styles from "./asset_item_view.module.scss";
import { useZkApp } from "@/components/zkapp/useZkApp";
import { ZkAppAccount } from "./ZkAppAccount";

const transactionFee = 0.1;

export const AssetItemView: React.FC<AssetItemViewProps> = ({ idx }) => {
  const { state, displayText, hasWallet } = useZkApp();
  const [createProofMsg, setCreateProofMsg] = React.useState("");

  //
  const handleClickCreateProof = React.useCallback(async () => {
    const zkappWorkerClient = state.zkappWorkerClient!;

    console.log("Creating a transaction...");

    const tree = new MerkleTree(HEIGHT);
    const leaf = Poseidon.hash([Field.from(0)]);
    tree.setLeaf(BigInt(0), leaf);

    const root = tree.getRoot();
    const witness = new MerkleWitness20(tree.getWitness(BigInt(0)));

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

    const txLink = `https://minascan.io/devnet/tx/${hash}`;
    console.log(`View transaction at ${txLink}`);

    setCreateProofMsg(`Proof has been created, hash: ${hash}, link: ${txLink}`);
  }, [state, setCreateProofMsg]);

  const asset = mockAssets[Number(idx)];

  return (
    asset && (
      <div className={styles.wrapper}>
        <div className={styles.zkapp}>
          <div className={styles.start}>
            {displayText}
            {hasWallet}
          </div>
          <ZkAppAccount
            hasBeenSetup={state.hasBeenSetup}
            accountExists={state.accountExists}
            publicKey={state.publicKey}
            zkAppAddress={state.zkAppAddress}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.content}>
            <p>{asset.isin}</p>
            <p>{`Asset amount: 0 < ${asset.amount} < 200`}</p>
            <p className={styles.leaf}>leaf: {asset._leaf}</p>
            <p className={styles.witness}>
              witness: {JSON.stringify(asset._witness)}
            </p>
          </div>
          <div className={styles.btnArea}>
            <button type="button" onClick={handleClickCreateProof}>
              Create proof
            </button>
            <div>{createProofMsg}</div>
          </div>
        </div>
      </div>
    )
  );
};

export interface AssetItemViewProps {
  idx: string;
}
