import path from 'path';
import fs from 'fs';
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

import { HEIGHT, MerkleWitness20 } from '../externals/tree';
import { MerklePos } from './merkle_pos';
import { makeUserPublic } from '../externals/make_leaf';
import { mockUser } from '../externals/users';

let proofsEnabled = false;

const DATA_PATH = path.resolve('../../source/stope_mock_data/data');
const stosPath = path.resolve(DATA_PATH, 'stos.json');
const treePath = path.resolve(DATA_PATH, 'tree.json');

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

  it('user_proof_1', async () => {
    await localDeploy();

    const stosJson = JSON.parse(fs.readFileSync(stosPath).toString());
    const treeJson = JSON.parse(fs.readFileSync(treePath).toString());

    const tree = new MerkleTree(HEIGHT);

    const stos = stosJson.map((_sto: any, idx: number) => {
      const sto = {
        leaf: Field.fromJSON(_sto.leaf),
        userPublic: Field.fromJSON(_sto.userPublic),
        isin: Field.fromJSON(_sto._isin),
        balance: Field.fromJSON(_sto._balance),
      };

      tree.setLeaf(BigInt(idx), sto.leaf);

      return sto;
    });

    const root = Field.fromJSON(treeJson.root);
    const witness = new MerkleWitness20(tree.getWitness(0n));
    const sto = stos[0];
    const { secret } = mockUser;
    const { userPublic, _secret } = makeUserPublic(secret);

    console.log('made leaf, userPublic: %s, secret: %s', userPublic, _secret);

    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.membership(
        witness,
        sto.leaf,
        root,
        sto.isin,
        sto.balance,
        _secret
      );
    });

    try {
      const isProven = await txn.prove();
      expect(isProven.toJSON()).toBeTruthy();

      await txn.sign([senderKey]).send();
    } catch (err) {
      throw new Error(`failed to prove, ${err}`);
    }
  });
});
