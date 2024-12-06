import React from "react";
import { mockAssets } from "@taigalabs/stope-mock-data";
import { useRouter } from "next/navigation";

import styles from "./asset_list.module.scss";
import ZkappWorkerClient from "@/components/zkapp/zkappWorkerClient";
import { useUserStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/requests";

const Assets = () => {
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ["get_sto_list"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API_ENDPOINT}/get_sto_list`, {
          method: "post",
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

  const { username } = useUserStore();

  const list = React.useMemo(() => {
    if (data && data.stos) {
      const elems = data.stos.map((asset: any, idx: any) => {
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

      return elems;
    }
  }, [data]);

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
