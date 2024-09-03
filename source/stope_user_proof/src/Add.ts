import {
  Field,
  SmartContract,
  state,
  State,
  method,
  CircuitString,
  Poseidon,
  MerkleTree,
} from 'o1js';
// import { ProcessedSTO, STO } from 'stope-entities';

const sto = {
  secret: 'secret',
  symbol: 'symbol',
  isin: 'isin',
  amount: 10,
};

const Tree = new MerkleTree(8);

// STOs
Tree.setLeaf(0n, Field(0));
Tree.setLeaf(0n, Field(1));
Tree.setLeaf(0n, Field(2));
Tree.setLeaf(0n, Field(3));

const root = Tree.getRoot();
const witness = Tree.getWitness(0n);

// Will be renamed 'STO'
export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async update() {
    const currentState = this.num.getAndRequireEquals();
    const newState = currentState.add(2);
    this.num.set(newState);

    const secret = CircuitString.fromString(sto.secret);
    const symbol = CircuitString.fromString(sto.secret);
    const isin = CircuitString.fromString(sto.secret);
    const amount = Field.from(sto.amount);

    const greaterThan = Field(1);
    const lessThan = Field(20);

    let b = amount.greaterThan(greaterThan);
    b = amount.lessThan(lessThan);
    b.assertTrue();
    console.log('condition pass', b);

    let leaf = Poseidon.hash([secret.hash(), symbol.hash(), isin.hash()]);
    console.log('leaf', leaf);
  }
}
