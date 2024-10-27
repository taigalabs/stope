// import React from "react";

// const transactionFee = 0.1;

// export function useCreateProof({ state, setState }: UseCreateProofArgs) {
//   return React.useCallback(async () => {
//     setState({ ...state, creatingTransaction: true });

//     console.log("Creating a transaction...");

//     await state.zkappWorkerClient!.fetchAccount({
//       publicKey: state.publicKey!,
//     });

//     // await state.zkappWorkerClient!.createUpdateTransaction();
//     console.log("Creating proof...");
//     await state.zkappWorkerClient!.proveUpdateTransaction();

//     console.log("Requesting send transaction...");
//     const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

//     console.log("Getting transaction JSON...");
//     const { hash } = await (window as any).mina.sendTransaction({
//       transaction: transactionJSON,
//       feePayer: {
//         fee: transactionFee,
//         memo: "",
//       },
//     });

//     const transactionLink = `https://minascan.io/devnet/tx/${hash}`;
//     console.log(`View transaction at ${transactionLink}`);

//     setState({ ...state, creatingTransaction: false });
//   }, [state, setState]);
// }

// export interface UseCreateProofArgs {
//   state: any;
//   setState: any;
// }
