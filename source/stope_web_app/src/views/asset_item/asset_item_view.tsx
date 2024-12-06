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

import { makeLeaf } from "../../../externals/make_leaf";
import { API_ENDPOINT } from "@/requests";

const transactionFee = 0.1;

export const AssetItemView: React.FC<AssetItemViewProps> = ({ idx }) => {
  const { state, displayText, hasWallet } = useZkApp();
  const [createProofMsg, setCreateProofMsg] = React.useState("");
  const { username, password } = useUserStore();

  const { data, isFetching } = useQuery({
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

  const asset = React.useMemo(() => {
    if (data && data.sto) {
      return data.sto;
    }
  }, [data]);

  const handleClickCreateProof = React.useCallback(async () => {
    const zkappWorkerClient = state.zkappWorkerClient!;

    console.log("Creating a transaction...");

    const { isin, balance } = asset;

    const { leaf, userPublic, _isin, _balance, _secret } = makeLeaf(
      password,
      isin,
      balance
    );

    const tree = new MerkleTree(HEIGHT);
    const root = tree.getRoot();
    const witness = new MerkleWitness20(tree.getWitness(BigInt(0)));

    console.log("proof gen view, root", root);
    await zkappWorkerClient!.membership(
      witness,
      leaf,
      root,
      _isin,
      _balance,
      _secret
    );

    console.log("Creating proof...");
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
  }, [state, setCreateProofMsg, asset, password]);

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
              Create proof
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
