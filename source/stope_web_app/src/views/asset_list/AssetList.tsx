import React from "react";
import {
  HEIGHT,
  MerkleWitness20,
} from "@taigalabs/stope-user-proof/src/MerkleTree20";
import { Field, MerkleTree, Poseidon } from "o1js";
import { mockAssets } from "@taigalabs/stope-mock-data";
import { useRouter } from "next/navigation";

import styles from "./AssetList.module.scss";
import ZkappWorkerClient from "./zkappWorkerClient";

const transactionFee = 0.1;

const Assets = () => {
  const router = useRouter();

  const list = mockAssets.map((asset, idx) => {
    return (
      <li
        key={asset.assetId}
        className={styles.item}
        onClick={() => {
          router.push(`/asset_list/${idx}`);
        }}
      >
        <div>
          <p>ISIN: {asset.isin}</p>
        </div>
        <div>
          <p>Qty: {asset.amount}</p>
        </div>
      </li>
    );
  });

  return <ul className={styles.list}>{list}</ul>;
};

export const AssetList: React.FC<ProofGenViewProps> = ({
  zkappWorkerClient,
}) => {
  const handleClickCreateProof = React.useCallback(async () => {
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

    const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
    console.log(`View transaction at ${transactionLink}`);
  }, [zkappWorkerClient]);

  return (
    <div className={styles.wrapper}>
      <Assets />
      {/* <div className={styles.btnArea}> */}
      {/*   <button type="button" onClick={handleClickCreateProof}> */}
      {/*     Create proof */}
      {/*   </button> */}
      {/* </div> */}
    </div>
  );
};

export interface ProofGenViewProps {
  zkappWorkerClient?: ZkappWorkerClient;
}
