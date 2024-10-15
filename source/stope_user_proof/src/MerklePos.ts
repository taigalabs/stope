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
import { MerkleWitness20 } from './MerkleTree20';

const sto = {
  secret: 'secret',
  symbol: 'symbol',
  isin: 'isin',
  amount: 10,
};

export class MerklePos extends SmartContract {
  @state(Field) isin = State<Field>();
  @state(Field) amount = State<Field>();

  init() {
    super.init();
    this.isin.set(Field(0));
    this.amount.set(Field(0));
  }

  @method async membership(
    witness: MerkleWitness20,
    leaf: Field,
    root: Field,
    // isin: Field,
    // amount: Field,
    // secret: Field
  ) {
    console.log('witness', witness);

    const _root = witness.calculateRoot(leaf);
    console.log('root', root);
    console.log('_root', _root);

    // const _leaf = Poseidon.hash([isin, amount, secret]);
    // leaf.assertEquals(_leaf);

    root.assertEquals(_root);
  }
}
