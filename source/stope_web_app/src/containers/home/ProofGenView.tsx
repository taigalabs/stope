import styles from "./ProofGenView.module.scss";

export const ProofGenView: React.FC<ProofGenViewProps> = ({
  createProof,
  state,
  importLedgerState,
}) => {
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      {/* <div className={styles.center} style={{ padding: 0 }}> */}
      {/*   Current state in zkApp: {state.currentNum!.toString()}{" "} */}
      {/* </div> */}
      {/* <button */}
      {/*   className={styles.card} */}
      {/*   onClick={createProof} */}
      {/*   disabled={state.creatingTransaction} */}
      {/* > */}
      {/*   Create proof */}
      {/* </button> */}
      {/* <button className={styles.card} onClick={importLedgerState}> */}
      {/*   Get Latest State */}
      {/* </button> */}
    </div>
  );
};

export interface ProofGenViewProps {
  createProof: any;
  importLedgerState: any;
  state: any;
}
