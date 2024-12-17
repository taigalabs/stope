import { Field, Struct } from "o1js";

let STOInCircuit = {
  leaf: Field,
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
    // STOInCircuit,
    // STOInCircuit,
    // STOInCircuit,
    // STOInCircuit,
    // STOInCircuit,
    // STOInCircuit,
  ],
}) {}
