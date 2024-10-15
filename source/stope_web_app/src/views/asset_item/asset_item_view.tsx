import React from "react";
import { mockAssets } from "@taigalabs/stope-mock-data";

import styles from "./asset_item_view.module.scss";

export const AssetItemView: React.FC<AssetItemViewProps> = ({ idx }) => {
  const asset = mockAssets[Number(idx)];

  return asset && <div className={styles.wrapper}>{asset.isin}</div>;
};

export interface AssetItemViewProps {
  idx: string;
}
