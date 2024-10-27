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

export const AssetList: React.FC<ProofGenViewProps> = () => {
  return (
    <div className={styles.wrapper}>
      <Assets />
    </div>
  );
};

export interface ProofGenViewProps {
  zkappWorkerClient?: ZkappWorkerClient;
}
