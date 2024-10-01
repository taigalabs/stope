import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  MerkleTree,
  CircuitString,
  Poseidon,
} from "o1js";
import { STO } from "@taigalabs/stope-entities";
import { Export } from "@taigalabs/stope-bridge-proof/build/src/Export.js";

export const SECRET = "secret";

const dummy: STO[] = [
  {
    userPublic: "public",
    symbol: "symbol",
    isin: "isin",
    totalSupply: "total supply",
    issuerName: "issuer name",
    name: "name",
    pledgedBalances: "pledged balances",
    isTrust: "is trust",
    trustName: "trust name",
    limitedBalances: "limited balances",
    decimals: "decimals",
    lockedBalances: "locked balances",
    balances: "balances",
    issuable: "issuable",
    paused: "paused",
    issuer: "issuer",
    InstitutionBalances: "institution balances",
    usable: "usable",
    whitelistContractAddress: "whitelist",
  },
  {
    userPublic: "public2",
    symbol: "symbol2",
    isin: "isin2",
    totalSupply: "total supply2",
    issuerName: "issuer name",
    name: "name",
    pledgedBalances: "pledged balances",
    isTrust: "is trust",
    trustName: "trust name",
    limitedBalances: "limited balances",
    decimals: "decimals",
    lockedBalances: "locked balances",
    balances: "balances",
    issuable: "issuable",
    paused: "paused",
    issuer: "issuer",
    InstitutionBalances: "institution balances",
    usable: "usable",
    whitelistContractAddress: "whitelist",
  },
];

async function deployContractLocal() {
  const useProof = false;
  const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
  Mina.setActiveInstance(Local);

  const deployerAccount = Local.testAccounts[0];
  const deployerKey = deployerAccount.key;

  // Create a public/private key pair. The public key is your address and where you deploy the zkApp to
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  // create an instance of Square - and deploy it to zkAppAddress
  const zkAppInstance = new Export(zkAppAddress);
  const deployTxn = await Mina.transaction(deployerAccount, async () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    await zkAppInstance.deploy();
  });
  await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

  return { Local, zkApp: zkAppInstance };
}

function makeTree() {
  const Tree = new MerkleTree(dummy.length);
  for (let idx = 0; idx < dummy.length; idx += 1) {
    const sto = dummy[idx];

    const userPublic = CircuitString.fromString(SECRET);
    const secret = Poseidon.hash([userPublic.hash()]);
    const symbol = CircuitString.fromString(sto.symbol);
    const isin = CircuitString.fromString(sto.isin);
    const totalSupply = CircuitString.fromString(sto.totalSupply);

    const leaf = Poseidon.hash([
      secret,
      symbol.hash(),
      isin.hash(),
      totalSupply.hash(),
    ]);

    Tree.setLeaf(BigInt(idx), leaf);
  }

  const root = Tree.getRoot();
  const witness = Tree.getWitness(0n);

  console.log("root", root);
  console.log("witness", witness);

  return Tree;
}

export async function exportSTO() {
  console.log("exporting STO");

  const { Local, zkApp } = await deployContractLocal();

  const num0 = zkApp.num.get();
  console.log("state after init:", num0.toString());

  const senderAccount = Local.testAccounts[1];
  const senderKey = senderAccount.key;

  const Tree = makeTree();

  const txn1 = await Mina.transaction(senderAccount, async () => {
    await zkApp.update();
  });
  await txn1.prove();
  await txn1.sign([senderKey]).send();

  const num1 = zkApp.num.get();
  console.log("state after txn1:", num1.toString());
}
