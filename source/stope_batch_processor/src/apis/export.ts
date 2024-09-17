import { Field, Mina, PrivateKey, AccountUpdate, MerkleTree } from "o1js";
import { STO } from "@taigalabs/stope-entities";
import { Export } from "@taigalabs/stope-bridge-proof/build/src/Export.js";

const dummy: STO[] = [
  {
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

const Tree = new MerkleTree(8);

// STOs
Tree.setLeaf(0n, Field(0));
Tree.setLeaf(0n, Field(1));
Tree.setLeaf(0n, Field(2));
Tree.setLeaf(0n, Field(3));

const root = Tree.getRoot();
const witness = Tree.getWitness(0n);

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

export async function exportSTO() {
  console.log("exporting STO");

  const { Local, zkApp } = await deployContractLocal();

  const num0 = zkApp.num.get();
  console.log("state after init:", num0.toString());

  const senderAccount = Local.testAccounts[1];
  const senderKey = senderAccount.key;

  const txn1 = await Mina.transaction(senderAccount, async () => {
    await zkApp.update();
  });
  await txn1.prove();
  await txn1.sign([senderKey]).send();

  const num1 = zkApp.num.get();
  console.log("state after txn1:", num1.toString());
}
