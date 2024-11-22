import { ProcessedSTO } from "@taigalabs/stope-entities";

export const mockAssets: ProcessedSTO[] = (function() {
  const ret: ProcessedSTO[] = [];

  for (let idx = 0; idx < 10; idx += 1) {
    ret.push({
      assetId: `assetId_${idx}`,
      userPublic: `userPublic_${idx}`,
      symbol: `symbol_${idx}`,
      isin: `isin_${idx}`,
      totalSupply: idx,
      issuerName: `issuerName_${idx}`,
      name: `name_${idx}`,
      isTrust: true,
      trustName: `trustName_${idx}`,
      decimals: `decimal_${idx}`,
      balance: idx,
      issuable: true,
      paused: true,
      issuer: `issuer_${idx}`,
      usable: true,
      whitelistContractAddress: `whitelistContractAddr_${idx}`,
    });
  }

  return ret;
})();
