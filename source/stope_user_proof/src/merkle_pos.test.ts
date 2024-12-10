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
const witnessesPath = path.resolve(DATA_PATH, 'witnesses.json');

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
    const witnessesJson = JSON.parse(fs.readFileSync(witnessesPath).toString());

    const tree = new MerkleTree(HEIGHT);

    const stos = stosJson.map((_sto: any, idx: number) => {
      const sto = {
        leaf: Field.fromJSON(_sto.leaf),
        userPublic: Field.fromJSON(_sto.userPublic),
        isin: Field.fromJSON(_sto._isin),
        balance: Field.fromJSON(_sto._balance),
        secret: Field.fromJSON(_sto._secret),
      };

      tree.setLeaf(BigInt(idx), sto.leaf);

      return sto;
    });

    const root = Field.fromJSON(treeJson.root);
    const witness = MerkleWitness20.fromJSON(witnessesJson[0]);
    // const witness = new MerkleWitness20(tree.getWitness(0n));
    const leaf = stos[0].leaf;
    const isin = stos[0].isin;
    const balance = stos[0].balance;
    const secret = Field.from(stos[0].secret);

    // const { secret } = mockUser;
    // const { userPublic, _secret } = makeUserPublic(secret);

    // console.log(11, sto.leaf, sto.isin, sto.balance, root, witness, secret);
    const _userPublic = Poseidon.hash([secret]);
    const _leaf = Poseidon.hash([_userPublic, isin, balance]);
    console.log('_userPublic', _userPublic, _leaf);

    console.log('witness', witness.toJSON());
    console.log('leaf', leaf);
    console.log('root', root);
    console.log('secret', secret);
    console.log('isin', isin);
    console.log('balance', balance);

    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.membership(witness, leaf, root, isin, balance, secret);
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
