import React from "react";

export const AssetItemView: React.FC<AssetItemViewProps> = ({ idx }) => {
  return <div>{idx}</div>;
};

export interface AssetItemViewProps {
  idx: string;
}
