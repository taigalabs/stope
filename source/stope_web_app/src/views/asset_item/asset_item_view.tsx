"use client";

import React from "react";
import { CircuitString, Field, MerkleTree, Poseidon } from "o1js";
import {
  HEIGHT,
  MerkleWitness20,
} from "@taigalabs/stope-user-proof/src/merkle_pos";
import { useQuery } from "@tanstack/react-query";

import styles from "./asset_item_view.module.scss";
import { useZkApp } from "@/components/zkapp/useZkApp";
import { ZkAppAccount } from "./zk_app_account";
import { useUserStore } from "@/store";

import { API_ENDPOINT } from "@/requests";

const transactionFee = 0.1;

export const AssetItemView: React.FC<AssetItemViewProps> = ({ idx }) => {
  const { state, displayText, hasWallet } = useZkApp();
  const [createProofMsg, setCreateProofMsg] = React.useState("");
  const { username, password } = useUserStore();

  const { data: stoData, isFetching } = useQuery({
    queryKey: ["get_sto"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API_ENDPOINT}/get_sto`, {
          method: "post",
          body: JSON.stringify({ sto_id: idx }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  const { data: treeData } = useQuery({
    queryKey: ["get_tree"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API_ENDPOINT}/get_tree`, {
          method: "post",
          body: JSON.stringify({ sto_id: idx }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  const { data: witnessData } = useQuery({
    queryKey: ["get_witness"],
    queryFn: async () => {
      try {
        const resp = await fetch(`${API_ENDPOINT}/get_witness`, {
          method: "post",
          body: JSON.stringify({ sto_id: idx }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await resp.json();
        return data;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  });

  const asset = React.useMemo(() => {
    if (stoData && stoData.sto) {
      return stoData.sto;
    }
  }, [stoData]);

  const tree = React.useMemo(() => {
    if (treeData && treeData.tree) {
      return treeData.tree;
    }
  }, [treeData]);

  const witness = React.useMemo(() => {
    if (witnessData && witnessData.witness) {
      return witnessData.witness;
    }
  }, [witnessData]);

  // console.log(33, tree, witness, asset, state.zkappWorkerClient);

  const handleClickCreateProof = React.useCallback(async () => {
    const zkappWorkerClient = state.zkappWorkerClient!;

    if (!zkappWorkerClient) {
      return;
    }

    console.log("Creating a transaction...", zkappWorkerClient);

    const { leaf: _leaf, _isin, _balance, _secret } = asset;
    console.log(55, _isin, _balance, _secret, tree, witness);

    // const { userPublic, _secret: secret } = makeUserPublic("mirae");

    const isin = Field.fromJSON(_isin);
    const balance = Field.fromJSON(_balance);
    const secret = Field.fromJSON(_secret);
    const leaf = Field.fromJSON(_leaf);

    const root = Field.fromJSON(tree.root);
    const wit = MerkleWitness20.fromJSON(witness);

    const _userPublic = Poseidon.hash([secret]);
    const madeLeaf = Poseidon.hash([_userPublic, isin, balance]);

    console.log("_userPublic", _userPublic);
    console.log("madeLeaf", madeLeaf);

    console.log("witness", wit.toJSON());
    console.log("leaf", leaf);
    console.log("root", root);
    console.log("secret", secret);
    console.log("isin", isin);
    console.log("balance", balance);

    console.log("Creating proof...");
    await zkappWorkerClient!.membership(wit, leaf, root, isin, balance, secret);

    console.log("Creating transaction...");
    await zkappWorkerClient!.proveUpdateTransaction();

    console.log("Requesting send transaction...");
    const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

    console.log("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const txLink = `https://minascan.io/devnet/tx/${hash}`;
    console.log(`View transaction at ${txLink}`);

    setCreateProofMsg(`Proof has been created, hash: ${hash}, link: ${txLink}`);
  }, [state, setCreateProofMsg, asset, password, tree, witness]);

  return (
    asset && (
      <div className={styles.wrapper}>
        <div className={styles.zkapp}>
          <div className={styles.start}>
            {displayText}
            {hasWallet}
          </div>
          <ZkAppAccount
            hasBeenSetup={state.hasBeenSetup}
            accountExists={state.accountExists}
            publicKey={state.publicKey}
            zkAppAddress={state.zkAppAddress}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.item}>
              <span>asset id: </span>
              <span>{asset.assetId}</span>
            </div>
            <div className={styles.item}>
              <span>user public: </span>
              <span>{asset.userPublic}</span>
            </div>
            <div className={styles.item}>
              <span>symbol: </span>
              <span>{asset.symbol}</span>
            </div>
            <div className={styles.item}>
              <span>ISIN: </span>
              <span>{asset.isin}</span>
            </div>
            <div className={styles.item}>
              <span>total supply: </span>
              <span>{asset.totalSupply}</span>
            </div>
            <div className={styles.item}>
              <span>issuer name: </span>
              <span>{asset.issuerName}</span>
            </div>
            <div className={styles.item}>
              <span>name: </span>
              <span>{asset.name}</span>
            </div>
            <div className={styles.item}>
              <span>is trust: </span>
              <span>{asset.isTrust === true ? "true" : "false"}</span>
            </div>
            <div className={styles.item}>
              <span>trust name: </span>
              <span>{asset.trustName}</span>
            </div>
            <div className={styles.item}>
              <span>decimals: </span>
              <span>{asset.decimals}</span>
            </div>
            <div className={styles.item}>
              <span>balance: </span>
              <span>{asset.balance}</span>
            </div>
          </div>
          <div className={styles.btnArea}>
            <button type="button" onClick={handleClickCreateProof}>
              Create proof (Auro wallet)
            </button>
            <div>{createProofMsg}</div>
          </div>
        </div>
      </div>
    )
  );
};

export interface AssetItemViewProps {
  idx: string;
}
