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

  @method async aggregate() {
    const currentState = this.num.getAndRequireEquals();
    const newState = currentState.add(2);
    this.num.set(newState);

    const secret = CircuitString.fromString(sto.secret);
    const isin = CircuitString.fromString(sto.isin);
    const amount = Field.from(sto.amount);

    let leaf = Poseidon.hash([isin.hash(), amount, secret.hash()]);
    // console.log("leaf", leaf);
  }
}
