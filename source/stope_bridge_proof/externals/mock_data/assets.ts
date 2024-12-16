import { ProcessedSTO } from "@taigalabs/stope-entities";

export const mockAssets: ProcessedSTO[] = (function () {
  const ret: ProcessedSTO[] = [
    {
      assetId: `0`,
      userPublic: `0x50133e6a88F642a40c35B9f63f354f15C6d28BD8`,
      symbol: `KRST90004400`,
      isin: `KRST90004400`,
      totalSupply: 0,
      issuerName: `Famoa`,
      name: `Famoa Investment Contract (Woohwan Lee)`,
      isTrust: true,
      trustName: `0`,
      decimals: `0`,
      balance: 9800,
      issuable: true,
      paused: true,
      issuer: `0`,
      usable: true,
      whitelistContractAddress: `0`,
    },
    {
      assetId: `1`,
      userPublic: `0xFb79092DC66F588Bd389c29A0eC7a22aB333110d`,
      symbol: `KRST90006100`,
      isin: `KRST90006100`,
      totalSupply: 0,
      issuerName: `Blue One`,
      name: `Dialogue2`,
      isTrust: true,
      trustName: `0`,
      decimals: `0`,
      balance: 10000,
      issuable: true,
      paused: true,
      issuer: `0`,
      usable: true,
      whitelistContractAddress: `0`,
    },
    {
      assetId: `2`,
      userPublic: `0x57134add5054338baa7AB997295A9017da5930ca`,
      symbol: `KRST90006100`,
      isin: `KRST90006100`,
      totalSupply: 0,
      issuerName: `Blue One`,
      name: `Picasso - Golden Muse`,
      isTrust: true,
      trustName: `0`,
      decimals: `0`,
      balance: 10000,
      issuable: true,
      paused: true,
      issuer: `0`,
      usable: true,
      whitelistContractAddress: `0`,
    },
    {
      assetId: `3`,
      userPublic: `0x1342e87E5B9bEDA0131ECa211ac6692b6ffF4728`,
      symbol: `KRSTO0000009`,
      isin: `KRSTO0000009`,
      totalSupply: 0,
      issuerName: `Yeolmae Company`,
      name: `Investment Contract 9th (Hana Financial Investment distribution test)`,
      isTrust: true,
      trustName: `0`,
      decimals: `0`,
      balance: 5600,
      issuable: true,
      paused: true,
      issuer: `0`,
      usable: true,
      whitelistContractAddress: `0`,
    },
  ];

  return ret;
})();
