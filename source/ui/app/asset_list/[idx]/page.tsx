// import { AssetItemView } from "@/views/asset_item/asset_item_view";
import { AssetItemView2 } from "@/views/asset_item_2/asset_item_view_2";

export default function Page({ params }: any) {
  return <AssetItemView2 idx={params.idx} />;
}
