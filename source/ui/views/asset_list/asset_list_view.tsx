"use client";

import "@/components/zkapp/reactCOIServiceWorker";

import React from "react";

import styles from "./asset_list_view.module.scss";
import { AssetList } from "./asset_list";

export const AssetListView: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <AssetList />
    </div>
  );
};
