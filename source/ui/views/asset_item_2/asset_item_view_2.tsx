"use client";
import React from "react";
import { Field, Poseidon } from "o1js";
import { useEffect, useState } from "react";
// import GradientBG from "../components/GradientBG";
// import styles from "../../styles/Home.module.css";
import styles from "./asset_item_view.module.scss";

import "./reactCOIServiceWorker";
import ZkappWorkerClient from "./zkappWorkerClient";
import { MerkleWitness20 } from "@taigalabs/stope-user-proof";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/requests";

let transactionFee = 0.1;
// const ZKAPP_ADDRESS = "B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP";
const ZKAPP_ADDRESS = "B62qqb8h5WxP59SdawDr4fVgKhXFunaM9HNa2Yi2aCkspDLKQQGZnw5";

export const AssetItemView2: React.FC<AssetItemViewProps> = ({ idx }) => {
  const [zkappWorkerClient, setZkappWorkerClient] =
    useState<null | ZkappWorkerClient>(null);
  const [hasWallet, setHasWallet] = useState<null | boolean>(null);
  const [hasBeenSetup, setHasBeenSetup] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [currentNum, setCurrentNum] = useState<null | Field>(null);
  const [publicKeyBase58, setPublicKeyBase58] = useState("");
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [transactionlink, setTransactionLink] = useState("");

  const displayStep = (step: string) => {
    setDisplayText(step);
    console.log(step);
  };

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    const setup = async () => {
      try {
        if (!hasBeenSetup) {
          displayStep("Loading web worker...");
          const zkappWorkerClient = new ZkappWorkerClient();
          setZkappWorkerClient(zkappWorkerClient);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          displayStep("Done loading web worker");

          await zkappWorkerClient.setActiveInstanceToDevnet();

          const mina = (window as any).mina;
          if (mina == null) {
            setHasWallet(false);
            displayStep("Wallet not found.");
            return;
          }

          const publicKeyBase58: string = (await mina.requestAccounts())[0];
          setPublicKeyBase58(publicKeyBase58);
          displayStep(`Using key:${publicKeyBase58}`);

          displayStep("Checking if fee payer account exists...");
          const res = await zkappWorkerClient.fetchAccount(publicKeyBase58);
          const accountExists = res.error === null;
          setAccountExists(accountExists);

          await zkappWorkerClient.loadContract();

          displayStep("Compiling zkApp...");
          await zkappWorkerClient.compileContract();
          displayStep("zkApp compiled");

          await zkappWorkerClient.initZkappInstance(ZKAPP_ADDRESS);

          displayStep("Getting zkApp state...");
          const acc = await zkappWorkerClient.fetchAccount(ZKAPP_ADDRESS);
          console.log(22, acc);

          const currentNum = await zkappWorkerClient.getRoot();
          setCurrentNum(currentNum);
          console.log(`Current state in zkApp: ${currentNum}`);

          setHasBeenSetup(true);
          setHasWallet(true);
          setDisplayText("");
        }
      } catch (error: any) {
        displayStep(`Error during setup: ${error.message}`);
      }
    };

    setup();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    const checkAccountExists = async () => {
      if (hasBeenSetup && !accountExists) {
        try {
          for (;;) {
            displayStep("Checking if fee payer account exists...");

            const res = await zkappWorkerClient!.fetchAccount(publicKeyBase58);
            const accountExists = res.error == null;
            if (accountExists) {
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        } catch (error: any) {
          displayStep(`Error checking account: ${error.message}`);
        }
      }
      setAccountExists(true);
    };

    checkAccountExists();
  }, [zkappWorkerClient, hasBeenSetup, accountExists]);

  // -------------------------------------------------------
  // Send a transaction
  //
  const onSendTransaction = async () => {
    setCreatingTransaction(true);
    displayStep("Creating a transaction...");

    //
    const { leaf: _leaf, _isin, _balance, _secret } = asset;
    console.log(55, _isin, _balance, _secret, tree, witness);

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
    //

    console.log("publicKeyBase58 sending to worker", publicKeyBase58);
    await zkappWorkerClient!.fetchAccount(publicKeyBase58);

    await zkappWorkerClient!.createUpdateTransaction();

    displayStep("Creating proof...");
    await zkappWorkerClient!.proveUpdateTransaction();

    displayStep("Requesting send transaction...");
    const transactionJSON = await zkappWorkerClient!.getTransactionJSON();

    displayStep("Getting transaction JSON...");
    const { hash } = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: "",
      },
    });

    const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
    setTransactionLink(transactionLink);
    setDisplayText(transactionLink);

    setCreatingTransaction(true);
  };

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

  // -------------------------------------------------------
  // Create UI elements

  let auroLinkElem;
  if (hasWallet === false) {
    const auroLink = "https://www.aurowallet.com/";
    auroLinkElem = (
      <div>
        Could not find a wallet.{" "}
        <a href="https://www.aurowallet.com/" target="_blank" rel="noreferrer">
          Install Auro wallet here
        </a>
      </div>
    );
  }

  const stepDisplay = transactionlink ? (
    <a
      href={transactionlink}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "underline" }}
    >
      View transaction
    </a>
  ) : (
    displayText
  );

  let setup = (
    <div
      className={styles.start}
      style={{ fontWeight: "bold", fontSize: "1.5rem", paddingBottom: "5rem" }}
    >
      {stepDisplay}
      {auroLinkElem}
    </div>
  );

  let accountDoesNotExist;
  if (hasBeenSetup && !accountExists) {
    const faucetLink = `https://faucet.minaprotocol.com/?address='${publicKeyBase58}`;
    accountDoesNotExist = (
      <div>
        <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account
        </a>
      </div>
    );
  }

  let mainContent;
  if (hasBeenSetup && accountExists) {
    mainContent = (
      <div style={{ justifyContent: "center", alignItems: "center" }}>
        <div className={styles.center} style={{ padding: 0 }}>
          Current state in zkApp: {currentNum?.toString()}{" "}
        </div>
        <button
          className={styles.card}
          onClick={onSendTransaction}
          disabled={creatingTransaction}
        >
          Send Transaction
        </button>
        {/* <button className={styles.card} onClick={onRefreshCurrentNum}> */}
        {/*   Get Latest State */}
        {/* </button> */}
      </div>
    );
  }

  return (
    <div className={styles.main} style={{ padding: 0 }}>
      <div className={styles.center} style={{ padding: 0 }}>
        {setup}
        {accountDoesNotExist}
        {mainContent}
      </div>
    </div>
  );
};

export interface AssetItemViewProps {
  idx: string;
}
