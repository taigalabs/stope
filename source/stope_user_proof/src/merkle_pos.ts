import { Field, SmartContract, state, State, method, Poseidon } from 'o1js';
import { MerkleWitness } from 'o1js';

export const HEIGHT = 20;

export class MerkleWitness20 extends MerkleWitness(HEIGHT) {}

export class MerklePos extends SmartContract {
  @state(Field) root = State<Field>();
  @state(Field) bal = State<Field>();

  init() {
    super.init();
    this.root.set(Field(1));
    this.bal.set(Field(1));
  }

  @method async membership(
    witness: MerkleWitness20,
    leaf: Field,
    root: Field,
    isin: Field,
    balance: Field,
    secret: Field
  ) {
    console.log('zkapp - membership()');

    const userPublic = Poseidon.hash([secret]);
    console.log('zkapp - userPublic:', userPublic);

    const _leaf = Poseidon.hash([userPublic, isin, balance]);
    console.log('zkapp - _leaf:', _leaf);
    console.log('zkapp - leaf:', leaf);
    leaf.assertEquals(_leaf);

    const _root = witness.calculateRoot(leaf);
    root.assertEquals(_root);

    this.root.set(_root);
    this.bal.set(balance);
  }
}
