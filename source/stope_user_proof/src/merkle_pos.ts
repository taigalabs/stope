import { Field, SmartContract, state, State, method, Poseidon } from 'o1js';
import { MerkleWitness } from 'o1js';

export const HEIGHT = 20;

export class MerkleWitness20 extends MerkleWitness(HEIGHT) { }

export class MerklePos extends SmartContract {
  @state(Field) root = State<Field>();

  init() {
    super.init();
    this.root.set(Field(0));
  }

  @method async membership(
    witness: MerkleWitness20,
    leaf: Field,
    root: Field,
    isin: Field,
    balance: Field,
    secret: Field
  ) {
    console.log('membership()');
    //
    const userPublic = Poseidon.hash([secret]);

    //
    const _leaf = Poseidon.hash([userPublic, isin, balance]);
    leaf.assertEquals(_leaf);

    //
    const _root = witness.calculateRoot(leaf);
    root.assertEquals(_root);

    // Setting a public input
    this.root.set(_root);
  }
}


