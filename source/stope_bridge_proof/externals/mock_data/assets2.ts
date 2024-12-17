import { ProcessedSTO } from "@taigalabs/stope-entities";

export const mockAssets2: ProcessedSTO[] = (function () {
  const ret: ProcessedSTO[] = [
    {
      assetId: `0`,
      userPublic: `0xC01b65F909A8037D35Ed77ed6861E9a931B8F911`,
      symbol: `KRST90004400`,
      isin: `KRST90004400`,
      totalSupply: 0,
      issuerName: `Blue One`,
      name: `Picasso - Golden Muse`,
      isTrust: true,
      trustName: `0`,
      decimals: `0`,
      balance: 1200,
      issuable: true,
      paused: true,
      issuer: `0`,
      usable: true,
      whitelistContractAddress: `0`,
    },
  ];

  return ret;
})();
