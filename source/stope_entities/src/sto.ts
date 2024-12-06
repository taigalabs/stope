import { Field, Struct } from "o1js";

export interface STOContract {
  userPublic: string;
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

export type ProcessedSTO = {
  assetId: string;
  userPublic: string;
  symbol: string;
  isin: string;
  totalSupply: number;
  issuerName: string;
  name: string;
  isTrust: boolean;
  trustName: string;
  decimals: string;
  balance: number;
  issuable: boolean;
  paused: boolean;
  issuer: string;
  usable: boolean;
  whitelistContractAddress: string;
};

export type STOInCircuitType = {
  userPublic: Field;
  isin: Field;
  balance: Field;
};

let STOInCircuit = {
  userPublic: Field,
  isin: Field,
  balance: Field,
};

export class Assets extends Struct({
  stos: [
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
    STOInCircuit,
  ],
}) {}
