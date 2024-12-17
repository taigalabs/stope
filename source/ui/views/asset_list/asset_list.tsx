import React from "react";
import { useRouter } from "next/navigation";

import styles from "./asset_list.module.scss";
import ZkappWorkerClient from "@/components/zkapp/zkappWorkerClient";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/requests";

const Assets = () => {
  const router = useRouter();

  const { username } = useUserStore();

  const { data, isFetching } = useQuery({
    queryKey: ["get_sto_list"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API_ENDPOINT}/get_sto_list`, {
          method: "post",
          body: JSON.stringify({ username }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  console.log(22, data);

  const list = React.useMemo(() => {
    if (data && data.stos) {
      if (data.stos.length === 0) {
        return (
          <li>
            <div>no asset to show</div>
          </li>
        );
      }

      const elems = data.stos.map((asset: any, idx: any) => {
        return (
          <li
            key={asset.assetId}
            className={styles.item}
            onClick={() => {
              router.push(`/asset_list/${idx}`);
            }}
          >
            <div className={styles.infoEntry}>
              <p className={styles.label}>ISIN</p>
              <p>{asset.isin}</p>
            </div>
            <div className={styles.infoEntry}>
              <p className={styles.label}>Symbol</p>
              <p>{asset.symbol}</p>
            </div>
            <div className={styles.infoEntry}>
              <p className={styles.label}>Name</p>
              <p>{asset.name}</p>
            </div>
            <div className={styles.infoEntry}>
              <p className={styles.label}>Balance</p>
              <p>{asset.balance}</p>
            </div>
            <div className={styles.infoEntry}>
              <p className={styles.label}>User public</p>
              <p>{asset.userPublic}</p>
            </div>
            <div className={styles.infoEntry}>
              <p className={styles.label}>Issuer</p>
              <p>{asset.issuerName}</p>
            </div>
          </li>
        );
      });

      return elems;
    }
  }, [data]);

  return <ul className={styles.list}>{list}</ul>;
};

export const AssetList: React.FC<ProofGenViewProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>Asset attestation generator</p>
        <button className={styles.refreshBtn}>Refresh asset data</button>
      </div>
      <Assets />
    </div>
  );
};

export interface ProofGenViewProps {
  zkappWorkerClient?: ZkappWorkerClient;
}
