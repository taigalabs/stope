import { AssetItemView } from "@/views/asset_item/asset_item_view";

export default function Page({ params }: any) {
  console.log(444, params);
  return <AssetItemView idx={params.idx} />;
}
