"use client";

import "./reactCOIServiceWorker";

import styles from "./AssetListView.module.scss";
// import { ZkAppAccount } from "./ZkAppAccount";
import { AssetList } from "./AssetList";
// import { User } from "./User";
import { useZkApp } from "./useZkApp";

export const AssetListView = () => {
  // const [transactionlink, setTransactionLink] = useState("");
  // const { state, displayText, hasWallet } = useZkApp();

  return (
    <div className={styles.wrapper}>
      <AssetList />
    </div>
  );
};
