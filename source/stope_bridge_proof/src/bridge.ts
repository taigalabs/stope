import {
  Field,
  SmartContract,
  state,
  State,
  method,
  CircuitString,
  Bool,
  Struct,
  Poseidon,
} from "o1js";

import { Assets } from "../externals/sto.js";
import { MerkleWitness20 } from "../externals/tree.js";

export class Bridge extends SmartContract {
  @state(Field) root = State<Field>();
  @state(Field) totalBalance = State<Field>();
  @state(Field) count = State<Field>();

  init() {
    super.init();
    this.root.set(Field(0));
    this.totalBalance.set(Field(0));
    this.count.set(Field(0));
  }

  @method async aggregate(
    assets: Assets,
    root: Field,
    totalBalance: Field,
    firstLeafWitness: MerkleWitness20
  ) {
    const { stos } = assets;

    let bal = Field(0);
    let count = Field(0);
    for (let idx = 0; idx < stos.length; idx += 1) {
      const sto = stos[idx];
      bal = bal.add(sto.balance);
      count = count.add(Field(1));

      const leaf = Poseidon.hash([sto.userPublic, sto.isin, sto.balance]);
      leaf.assertEquals(sto.leaf);
    }

    const _root = firstLeafWitness.calculateRoot(stos[0].leaf);
    _root.assertEquals(root);

    bal.assertEquals(totalBalance);

    this.root.set(root);
    this.totalBalance.set(bal);
    this.count.set(count);
  }
}
