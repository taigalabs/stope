export interface STO {
  symbol: string;
  isin: string;
  totalSupply: string;
  issuerName: string;
  name: string;
  pledgedBalances: string;
  isTrust: string;
  trustName: string;
  limitedBalances: string;
  decimals: string;
  lockedBalances: string;
  balances: string;
  issuable: string;
  paused: string;
  issuer: string;
  InstitutionBalances: string;
  usable: string;
  whitelistContractAddress: string;
}

export interface ProcessedSTO {
  secret: string;
  symbol: string;
  isin: string;
  amount: number;
}
