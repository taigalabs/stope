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
import {
  mockAssets,
  mockUser,
  mockWrongUser,
} from '@taigalabs/stope-mock-data';
import { makeLeaf } from '@taigalabs/stope-data-fns';

import { HEIGHT, MerklePos, MerkleWitness20 } from './merkle_pos';

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

  it('generate_1', async () => {
    await localDeploy();

    const tree = new MerkleTree(HEIGHT);

    for (let idx = 0; idx < mockAssets.length; idx += 1) {
      const asset = mockAssets[idx];
      const { secret } = mockUser;
      const { isin, balance } = asset;
      const { leaf, userPublic, _secret } = makeLeaf(secret, isin, balance);

      tree.setLeaf(BigInt(idx), leaf);

      console.log(
        'made leaf, idx: %s, userPublic: %s, secret: %s, _secret: %s',
        idx,
        userPublic.toString(),
        secret,
        _secret.toString()
      );
      console.log('Added to tree, idx: %s, leaf: %s', leaf.toString());
    }

    // Assume the first asset is of interest (testing) and we know the credentials
    const asset = mockAssets[0];
    const { secret } = mockUser;
    const { isin, balance } = asset;
    const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
      secret,
      isin,
      balance
    );

    const root = tree.getRoot();
    // console.log('root', root.toString());

    const witness = new MerkleWitness20(tree.getWitness(0n));
    // console.log('witness', witness.toJSON());

    console.log('made leaf, userPublic: %s, secret: %s', userPublic, _secret);

    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.membership(witness, leaf, root, _isin, _balance, _secret);
    });

    try {
      const isProven = await txn.prove();
      expect(isProven.toJSON()).toBeTruthy();

      await txn.sign([senderKey]).send();
    } catch (err) {
      throw new Error(`failed to prove, ${err}`);
    }
  });

  it('fail_if_wrong_user', async () => {
    await localDeploy();

    const tree = new MerkleTree(HEIGHT);

    for (let idx = 0; idx < mockAssets.length; idx += 1) {
      const asset = mockAssets[idx];
      const { secret } = mockUser;
      const { isin, balance } = asset;
      const { leaf, userPublic } = makeLeaf(secret, isin, balance);

      tree.setLeaf(BigInt(idx), leaf);

      console.log('userPublic', userPublic.toString());
      console.log('Added to tree, idx: %s, leaf: %s', leaf.toString());
    }

    const asset = mockAssets[0];
    const { secret } = mockWrongUser;
    const { isin, balance } = asset;
    const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
      secret,
      isin,
      balance
    );

    const root = tree.getRoot();
    console.log('root', root.toString());

    const witness = new MerkleWitness20(tree.getWitness(0n));
    console.log('witness', witness.toJSON());

    const txn = await Mina.transaction(senderAccount, async () => {
      try {
        await zkApp.membership(witness, leaf, root, _isin, _balance, _secret);
      } catch (err) {
        console.error(`failed to execute zk app, ${err}`);
      }
    });

    let isProven = null;
    try {
      isProven = await txn.prove();
      expect(isProven.toJSON()).toBeTruthy();

      await txn.sign([senderKey]).send();
    } catch (err) {
      console.error(`failed to prove, ${err}`);
    }

    expect(isProven).toBeNull;
  });
});
