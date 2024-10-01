import { SmartContract, State } from "o1js";
export declare class Export extends SmartContract {
    num: State<import("o1js/dist/node/lib/provable/field").Field>;
    init(): void;
    update(): Promise<void>;
    isMember(): Promise<void>;
}
