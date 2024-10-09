"use client";

import "./reactCOIServiceWorker";

import { Field, PublicKey } from "o1js";
import { useEffect, useState } from "react";

import styles from "./HomeView.module.scss";
import ZkappWorkerClient from "./zkappWorkerClient";
import { Account } from "./Account";
import { AssetList } from "./AssetList";

const ZKAPP_ADDRESS = "B62qraPVBf3H1SGdEbcYJjzz1d1gYWzVFkmNkKPeR74bH1wk3TGuNe6";

export const HomeView = () => {
  const [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentNum: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
  });

  const [displayText, setDisplayText] = useState("");
  const [transactionlink, setTransactionLink] = useState("");

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      if (!state.hasBeenSetup) {
        setDisplayText("Loading web worker...");
        console.log("Loading web worker...");

        console.log("zk app address", ZKAPP_ADDRESS);
        const zkappWorkerClient = new ZkappWorkerClient();
        await timeout(5);

        setDisplayText("Done loading web worker");
        console.log("Done loading web worker");

        const ret = await zkappWorkerClient.setActiveInstanceToDevnet();
        console.log("Set up active instance to devnet", ret);

        const mina = (window as any).mina;

        if (mina == null) {
          setState({ ...state, hasWallet: false });
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);

        setDisplayText("Checking if fee payer account exists...");
        console.log("Checking if fee payer account exists...");

        const res = await zkappWorkerClient.fetchAccount({
          publicKey: publicKey!,
        });
        const accountExists = res.error == null;

        console.log("user account", res);

        await zkappWorkerClient.loadContract();

        console.log("Compiling zkApp...");
        setDisplayText("Compiling zkApp...");
        await zkappWorkerClient.compileContract();
        console.log("zkApp compiled");
        setDisplayText("zkApp compiled...");

        const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);
        // console.log("zk app publicKey", zkappPublicKey);
        //
        await zkappWorkerClient.initZkappInstance(zkappPublicKey);
        setDisplayText("zkApp initialized");

        await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });

        // const currentNum = await zkappWorkerClient.getNum();
        // console.log(`Current state in zkApp: ${currentNum.toString()}`);
        // setDisplayText("");

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          // currentNum,
        });
      }
    })();
  }, []);

  // -------------------------------------------------------
  // Wait for account to exist, if it didn't

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (;;) {
          setDisplayText("Checking if fee payer account exists...");
          console.log("Checking if fee payer account exists...");
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // -------------------------------------------------------
  // Create UI elements
  let hasWallet;
  if (state.hasWallet != null && !state.hasWallet) {
    const auroLink = "https://www.aurowallet.com/";
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        Install Auro wallet here
      </a>
    );
    hasWallet = <div>Could not find a wallet. {auroLinkElem}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.zkapp}>
        <div className={styles.start}>
          {displayText}
          {hasWallet}
        </div>
        <Account
          hasBeenSetup={state.hasBeenSetup}
          accountExists={state.accountExists}
          publicKey={state.publicKey}
        />
      </div>
      <div className={styles.main}>
        {state.hasBeenSetup && state.accountExists && (
          <AssetList zkappWorkerClient={state.zkappWorkerClient!} />
        )}
      </div>
    </div>
  );
};
