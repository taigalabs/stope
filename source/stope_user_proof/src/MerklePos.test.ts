import {
  AccountUpdate,
  CircuitString,
  Field,
  MerkleTree,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'o1js';
import { mockAssets, mockUser } from '@taigalabs/stope-mock-data';

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
    for (let idx = 0; idx < mockAssets.length; idx += 1) {
      const asset = mockAssets[idx];
      const { secret } = mockUser;
      const { isin, amount } = asset;

      const _isin = CircuitString.fromString(isin).hash();
      const _secret = CircuitString.fromString(secret).hash();
      const leaf = Poseidon.hash([_isin, Field.from(BigInt(amount)), _secret]);

      console.log('leaf', leaf.toString());

      // tree
      tree.setLeaf(BigInt(idx), leaf);
    }

    const root = tree.getRoot();
    console.log('root', root.toString())

    const witness = new MerkleWitness20(tree.getWitness(1n));
    console.log('witness', witness.toJSON());

    // // update transaction
    // const txn = await Mina.transaction(senderAccount, async () => {
    //   await zkApp.membership(witness, leaf, root);
    // });
    // await txn.prove();
    // await txn.sign([senderKey]).send();
  });
});
