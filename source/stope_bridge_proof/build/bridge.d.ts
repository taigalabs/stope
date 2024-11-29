import { SmartContract, State } from "o1js";
import { ProcessedSTO } from "@taigalabs/stope-entities";
export declare class Bridge extends SmartContract {
    num: State<import("o1js/dist/node/lib/provable/field").Field>;
    init(): void;
    aggregate(assets: ProcessedSTO[]): Promise<void>;
}
