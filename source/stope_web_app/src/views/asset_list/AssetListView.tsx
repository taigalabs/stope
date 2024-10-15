"use client";

import "./reactCOIServiceWorker";

import { Field, PublicKey } from "o1js";
import { useEffect, useState } from "react";

import styles from "./AssetListView.module.scss";
import ZkappWorkerClient from "./zkappWorkerClient";
import { ZkAppAccount } from "./ZkAppAccount";
import { AssetList } from "./AssetList";
import { User } from "./User";
import { useZkApp } from "./useZkApp";

export const AssetListView = () => {
  // const [transactionlink, setTransactionLink] = useState("");
  const { state, displayText, hasWallet } = useZkApp();

  return (
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
        />
      </div>
      <div className={styles.main}>
        <User />
        {state.hasBeenSetup && state.accountExists && (
          <AssetList zkappWorkerClient={state.zkappWorkerClient!} />
        )}
      </div>
    </div>
  );
};
