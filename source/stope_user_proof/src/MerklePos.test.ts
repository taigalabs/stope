import {
  AccountUpdate,
  Field,
  MerkleTree,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'o1js';

import { MerklePos } from './MerklePos';
import { HEIGHT, MerkleWitness20 } from './MerkleTree20';

let proofsEnabled = false;

describe('MerklePos', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: MerklePos;

  beforeAll(async () => {
    if (proofsEnabled) await MerklePos.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new MerklePos(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('test22', async () => {
    await localDeploy();

    const tree = new MerkleTree(HEIGHT);
    const leaf = Poseidon.hash([Field.from(0)]);
    tree.setLeaf(0n, leaf);

    const root = tree.getRoot();
    const witness = new MerkleWitness20(tree.getWitness(0n));

    // update transaction
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.membership(witness, leaf, root);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  });
});
