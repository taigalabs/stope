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

const sto = {
  secret: 'secret',
  symbol: 'symbol',
  isin: 'isin',
  amount: 10,
};

export const HEIGHT = 20;

export class MerkleWitness20 extends MerkleWitness(HEIGHT) {}

export class MerklePos extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async membership(
    leafWitness: MerkleWitness20,
    leaf: Field,
    root: Field
  ) {
    const _root = leafWitness.calculateRoot(leaf);
    console.log('root', root);
    console.log('_root', _root);

    root.assertEquals(_root);
  }
}
