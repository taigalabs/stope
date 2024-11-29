import { SmartContract, State } from "o1js";
export declare class Bridge extends SmartContract {
    num: State<import("o1js/dist/node/lib/provable/field").Field>;
    init(): void;
    aggregate(): Promise<void>;
}
