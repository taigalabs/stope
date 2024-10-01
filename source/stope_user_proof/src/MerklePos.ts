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
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async membership(witness: MerkleWitness20, leaf: Field, root: Field) {
    console.log('wit1', witness);
    console.log('root1', root);

    // const wit = MerkleWitness20.fromJSON(witness);
    // console.log('wit2', wit);

    const _root = witness.calculateRoot(leaf);
    console.log('root', root);
    console.log('_root', _root);

    root.assertEquals(_root);
  }
}
