"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./sign_in_view.module.scss";
import { useStore } from "@/store";

export const SignInView = () => {
  const router = useRouter();
  const [state, setState] = useState({ username: "", password: "" });

  const { signIn } = useStore();

  const handleClickSignIn = React.useCallback(() => {
    signIn(state.username, state.password);
    router.push("/asset_list");
  }, [router, state]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div>
          <p>User ID</p>
          <input
            type="text"
            onChange={(ev) => ({ ...state, username: ev.target.value })}
          />
        </div>
        <div>
          <p>Password</p>
          <input
            type="password"
            onChange={(ev) => ({ ...state, password: ev.target.value })}
          />
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
