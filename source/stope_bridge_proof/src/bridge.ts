import {
  Field,
  SmartContract,
  state,
  State,
  method,
  CircuitString,
  Bool,
  Struct,
} from "o1js";
import { Assets } from "@taigalabs/stope-entities";


export class Bridge extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async aggregate(assets: Assets) {
    // for (let idx = 0; idx < assets.length; idx += 1) {
    //   // const secret = CircuitString.fromString(sto.secret);
    //   // const isin = CircuitString.fromString(sto.isin);
    //   // const amount = Field.from(sto.amount);

    //   // makeLeaf
    // }
  }
}
