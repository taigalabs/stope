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
import { ProcessedSTO } from "../../stope_entities/src";
// import { ProcessedSTO, STO } from 'stope-entities';

const sto = {
  secret: "secret",
  symbol: "symbol",
  isin: "isin",
  amount: 10,
};

export class Bridge extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async aggregate(assets: ProcessedSTO[]) {
    for (let idx = 0; idx < assets.length; idx += 1) {
      const secret = CircuitString.fromString(sto.secret);
      const isin = CircuitString.fromString(sto.isin);
      const amount = Field.from(sto.amount);

      const leaf = Poseidon.hash([isin.hash(), amount, secret.hash()]);
    }
  }
}
