import { STO } from "stope-entities";

// import { ExportSTOArgs } from "../task_queue/task";

const dummy: STO[] = [
  {
    symbol: "symbol",
    isin: "isin",
    totalSupply: "total supply",
    issuerName: "issuer name",
    name: "name",
    pledgedBalances: "pledged balances",
    isTrust: "is trust",
    trustName: "trust name",
    limitedBalances: "limited balances",
    decimals: "decimals",
    lockedBalances: "locked balances",
    balances: "balances",
    issuable: "issuable",
    paused: "paused",
    issuer: "issuer",
    InstitutionBalances: "institution balances",
    usable: "usable",
    whitelistContractAddress: "whitelist",
  },
  {
    symbol: "symbol2",
    isin: "isin2",
    totalSupply: "total supply2",
    issuerName: "issuer name",
    name: "name",
    pledgedBalances: "pledged balances",
    isTrust: "is trust",
    trustName: "trust name",
    limitedBalances: "limited balances",
    decimals: "decimals",
    lockedBalances: "locked balances",
    balances: "balances",
    issuable: "issuable",
    paused: "paused",
    issuer: "issuer",
    InstitutionBalances: "institution balances",
    usable: "usable",
    whitelistContractAddress: "whitelist",
  },
];

export async function exportSTO() {
  console.log("exporting STO");

  console.log("-- STOs", dummy);
}
