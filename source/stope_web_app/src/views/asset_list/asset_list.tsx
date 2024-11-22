import React from "react";
import { mockAssets } from "@taigalabs/stope-mock-data";
import { useRouter } from "next/navigation";

import styles from "./asset_list.module.scss";
import ZkappWorkerClient from "@/components/zkapp/zkappWorkerClient";
import { useStore } from "@/store";

const Assets = () => {
  const router = useRouter();

  const { username } = useStore();

  const list = mockAssets.filter((_, idx) => {
    if (username === 'mirae') {
      return idx % 2 === 1
    } else {
      return idx % 2 === 0
    }
  })
    .map((asset, idx) => {
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
            <p>balance: {asset.balance}</p>
          </div>
          <div>
            <p>user public: {asset.userPublic}</p>
          </div>
          <div>
            <p>issuer: {asset.issuerName}</p>
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
