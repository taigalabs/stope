var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, CircuitString, Poseidon, } from "o1js";
// import { ProcessedSTO, STO } from 'stope-entities';
const sto = {
    secret: "secret",
    symbol: "symbol",
    isin: "isin",
    amount: 10,
};
export class Export extends SmartContract {
    constructor() {
        super(...arguments);
        this.num = State();
    }
    init() {
        super.init();
        this.num.set(Field(1));
    }
    async update() {
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
        // console.log("leaf", leaf);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Export.prototype, "num", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Export.prototype, "update", null);
//# sourceMappingURL=Export.js.map