import {
  Field,
  SmartContract,
  state,
  State,
  method,
  CircuitString,
  Poseidon,
  MerkleTree,
  MerkleWitness,
} from 'o1js';

export const HEIGHT = 20;

export class MerkleWitness20 extends MerkleWitness(HEIGHT) {}
