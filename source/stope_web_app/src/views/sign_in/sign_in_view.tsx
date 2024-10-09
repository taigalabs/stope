"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./sign_in_view.module.scss";

export const SignInView = () => {
  const [state, setState] = useState({});
  const router = useRouter();

  const handleClickSignIn = React.useCallback(() => {
    console.log(111);
    router.push("/asset_list");
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div>
          <p>User ID</p>
          <input type="text" />
        </div>
        <div>
          <p>User Password</p>
          <input type="password" />
        </div>
      </div>
      <div>
        <button type="button" onClick={handleClickSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
};
