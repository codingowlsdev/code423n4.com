import clsx from "clsx";
import React from "react";
import Moralis from "moralis";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import useUser, { UserLoginError } from "../../hooks/UserContext";

import Dropdown from "../Dropdown";

import * as styles from "./Login.module.scss";
import * as dropdownStyles from "../Dropdown.module.scss";

const Login = ({ displayAsButtons = false }) => {
  const { logUserOut, connectWallet } = useUser();
  const { authenticate } = useMoralis();

  const handleLogin = async (
    event: React.MouseEvent,
    provider: Moralis.Web3ProviderType = "metamask"
  ) => {
    event.preventDefault();
    const id = toast.loading("Logging in...", { autoClose: 2000 });

    try {
      const user = await authenticate({ provider });
      if (user === undefined) {
        // user clicked "cancel" when prompted to sign message
        // @todo: update messaging
        toast.update(id, {
          render: "You must sign the message to connect your wallet",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      logUserOut();
      toast.update(id, {
        render: "Something went wrong. Please refresh the page and try again.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      return;
    }

    try {
      const connection = await connectWallet();
      console.log(connection);
      if (connection) {
        toast.update(id, {
          render: "Logged in",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(id, {
          render: "Please register as warden",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      logUserOut();
      if (error === UserLoginError.RegistrationPending) {
        toast.update(id, {
          render: (
            <span>
              It looks like your account registration is pending. Don't forget
              to join us in{" "}
              <a href="https://discord.gg/code4rena" target="_blank">
                Discord
              </a>{" "}
              and give us a howl in #i-want-to-be-a-warden so we can complete
              your registration.
            </span>
          ),
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }
      if (error === UserLoginError.ConnectionPending) {
        toast.update(id, {
          render:
            "Your request to connect your wallet is pending review. Check the progress in GitHub",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
      toast.update(id, {
        render: "Something went wrong. Please refresh the page and try again.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      {displayAsButtons ? (
        <div className={clsx(styles.NoDropdown)}>
          <button
            type="button"
            onClick={(e) => handleLogin(e)}
            className={clsx(
              dropdownStyles.Button,
              styles.ButtonMargin,
              styles.SmallerButton
            )}
          >
            <img
              src="/images/meta-mask-logo.svg"
              alt="logout icon"
              className={styles.Icon}
            />
            Connect MetaMask
          </button>
          <button
            type="button"
            onClick={(e) => handleLogin(e, "walletConnect")}
            className={clsx(dropdownStyles.Button, styles.SmallerButton)}
          >
            <img
              src="/images/wallet-connect-logo.svg"
              alt="logout icon"
              className={styles.Icon}
            />
            Connect WalletConnect
          </button>
        </div>
      ) : (
        <>
          <Dropdown
            wrapperClass={styles.LoginButtonWrapper}
            triggerButtonClass={styles.LoginButton}
            triggerButton="Connect Wallet"
            openOnHover={true}
            className={styles.Desktop}
          >
            <button
              type="button"
              onClick={(e) => handleLogin(e)}
              className={clsx(dropdownStyles.Button, styles.Desktop)}
            >
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Connect MetaMask
            </button>
            <button
              type="button"
              onClick={(e) => handleLogin(e, "walletConnect")}
              className={clsx(dropdownStyles.Button, styles.Desktop)}
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Connect WalletConnect
            </button>
          </Dropdown>
          <div className={styles.Mobile}>
            <a href="" onClick={(e) => handleLogin(e)} className={styles.Link}>
              <img
                src="/images/meta-mask-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Connect MetaMask
            </a>
            <a
              href=""
              onClick={(e) => handleLogin(e, "walletConnect")}
              className={styles.Link}
            >
              <img
                src="/images/wallet-connect-logo.svg"
                alt="logout icon"
                className={styles.Icon}
              />
              Connect WalletConnect
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
