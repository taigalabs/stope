import { CircuitString, Field, Poseidon } from 'o1js';

export function makeLeaf(secret: string, isin: string, balance: number) {
  const { _secret, userPublic } = makeUserPublic(secret);

  const _isin = CircuitString.fromString(isin).hash();
  const _balance = Field.from(BigInt(balance));

  const leaf = Poseidon.hash([userPublic, _isin, _balance]);

  return { leaf, userPublic, _isin, _balance, _secret };
}

export function makeUserPublic(secret: string) {
  const _secret = CircuitString.fromString(secret).hash();
  const userPublic = Poseidon.hash([_secret]);

  const userPublicString = userPublic.toString();

  return { userPublic, userPublicString, _secret };
}
