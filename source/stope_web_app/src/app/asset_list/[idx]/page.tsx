import { AssetItemView } from "@/views/asset_item/asset_item_view";

export default function Page({ params }: any) {
  return <AssetItemView idx={params.idx} />;
}
