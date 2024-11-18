"use client";

import "@/components/zkapp/reactCOIServiceWorker";

import React from "react";

import styles from "./AssetListView.module.scss";
import { AssetList } from "./asset_list";

export const AssetListView: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <AssetList />
    </div>
  );
};
