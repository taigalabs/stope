import { PublicKey } from "o1js";
import React from "react";

export const Account: React.FC<AccountProps> = ({
  hasBeenSetup,
  accountExists,
  publicKey,
}) => {
  let accountDoesNotExist;
  if (hasBeenSetup && !accountExists) {
    const faucetLink =
      "https://faucet.minaprotocol.com/?address=" + publicKey!.toBase58();
    accountDoesNotExist = (
      <div>
        <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
        <a href={faucetLink} target="_blank" rel="noreferrer">
          Visit the faucet to fund this fee payer account
        </a>
      </div>
    );
  }

  return accountDoesNotExist;
};

export interface AccountProps {
  hasBeenSetup: boolean;
  accountExists: boolean;
  publicKey: PublicKey | null;
}
