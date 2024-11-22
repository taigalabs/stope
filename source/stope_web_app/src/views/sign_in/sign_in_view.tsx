"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import styles from "./sign_in_view.module.scss";
import { useStore } from "@/store";
import { API_ENDPOINT } from "@/requests";

export const SignInView = () => {
  const router = useRouter();
  const [state, setState] = useState({ username: "", password: "" });

  console.log('state', state)

  const { signIn } = useStore();

  const { mutateAsync } = useMutation({
    mutationFn: async ({ username, password }: any) => {
      if (state.username && state.password) {
        const resp = await fetch(`${API_ENDPOINT}/sign_in`, {
          method: "POST",
          body: JSON.stringify({
            username, password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        return resp.json();
      }
    },
  });

  const handleClickSignIn = React.useCallback(async () => {
    const ret = await mutateAsync({ username: state.username, password: state.password });

    if (ret.ok) {
      signIn(state.username, state.password);
      router.push("/asset_list");
    }
  }, [router, state, mutateAsync]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.logo}>STOPE: STO Privacy Extension</p>
      <div>
        <div className={styles.inputElem}>
          <p>User ID</p>
          <input
            type="text"
            onChange={(ev) => setState({ ...state, username: ev.target.value })}
          />
        </div>
        <div className={styles.inputElem}>
          <p>Password</p>
          <input
            type="password"
            onChange={(ev) => setState({ ...state, password: ev.target.value })}
          />
        </div>
      </div>
      <div className={styles.btnArea}>
        <button type="button" onClick={handleClickSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
};
