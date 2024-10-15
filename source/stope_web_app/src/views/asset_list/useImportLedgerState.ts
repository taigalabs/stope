import React from "react";

export function useImportLedgerState({
  state,
  setState,
  setDisplayText,
}: UseImportLedgerStateArgs) {
  return React.useCallback(async () => {
    console.log("Getting zkApp state...");
    setDisplayText("Getting zkApp state...");

    await state.zkappWorkerClient!.fetchAccount({
      publicKey: state.zkappPublicKey!,
    });
    const currentNum = await state.zkappWorkerClient!.getNum();
    setState({ ...state, currentNum });
    console.log(`Current state in zkApp: ${currentNum.toString()}`);
    setDisplayText("");
  }, []);
}

export interface UseImportLedgerStateArgs {
  state: any;
  setState: any;
  setDisplayText: any;
}
