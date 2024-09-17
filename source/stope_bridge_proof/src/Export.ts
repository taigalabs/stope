import {
  Field,
  SmartContract,
  state,
  State,
  method,
  CircuitString,
  Poseidon,
  MerkleTree,
} from "o1js";
// import { ProcessedSTO, STO } from 'stope-entities';

const sto = {
  secret: "secret",
  symbol: "symbol",
  isin: "isin",
  amount: 10,
};

export class Export extends SmartContract {
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
    console.log("condition pass", b);

    let leaf = Poseidon.hash([secret.hash(), symbol.hash(), isin.hash()]);
    console.log("leaf", leaf);
  }
}
