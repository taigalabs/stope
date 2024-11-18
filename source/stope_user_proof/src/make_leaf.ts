import {
  AccountUpdate,
  CircuitString,
  Field,
  MerkleTree,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'o1js';
import { mockAssets, mockUser } from '@taigalabs/stope-mock-data';

export function makeLeaf(secret: string, isin: string, balance: number) {
  const userPublic = CircuitString.fromString(secret).hash();
  const _isin = CircuitString.fromString(isin).hash();
  const leaf = Poseidon.hash([_isin, Field.from(BigInt(balance)), userPublic]);

  return { leaf, userPublic };
}
