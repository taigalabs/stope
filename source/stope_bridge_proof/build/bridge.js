var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, CircuitString, } from "o1js";
const sto = {
    secret: "secret",
    symbol: "symbol",
    isin: "isin",
    amount: 10,
};
export class Bridge extends SmartContract {
    constructor() {
        super(...arguments);
        this.num = State();
    }
    init() {
        super.init();
        this.num.set(Field(1));
    }
    async aggregate(assets) {
        for (let idx = 0; idx < assets.length; idx += 1) {
            const secret = CircuitString.fromString(sto.secret);
            const isin = CircuitString.fromString(sto.isin);
            const amount = Field.from(sto.amount);
            // makeLeaf
        }
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Bridge.prototype, "num", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], Bridge.prototype, "aggregate", null);
//# sourceMappingURL=bridge.js.map