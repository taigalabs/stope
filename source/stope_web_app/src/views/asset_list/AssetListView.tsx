"use client";

import "@/components/zkapp/reactCOIServiceWorker";

import styles from "./AssetListView.module.scss";
import { AssetList } from "./AssetList";
// import { ZkAppAccount } from "./ZkAppAccount";
// import { User } from "./User";
// import { useZkApp } from "@/components/zkapp//useZkApp";

export const AssetListView = () => {
  // const [transactionlink, setTransactionLink] = useState("");
  // const { state, displayText, hasWallet } = useZkApp();

  return (
    <div className={styles.wrapper}>
      <AssetList />
    </div>
  );
};
