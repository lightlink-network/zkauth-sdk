import { SendTxParams, SiteData } from "./types";

const STORAGE_KEY = "zkauth:current_user";

export class ZKAuth {
  site: SiteData;
  endpoint: string;

  constructor(
    site: SiteData,
    endpoint = "https://s0sco0ogg88ckokk8ck00kwc.5.223.44.80.sslip.io"
  ) {
    this.site = site;
    this.endpoint = endpoint;
  }

  /**
   * Check if the user is connected
   * @returns true if the user is connected, false otherwise
   */
  connected(): boolean {
    if (window.localStorage) {
      return localStorage.getItem(STORAGE_KEY) !== null;
    }
    return false;
  }

  /**
   * Get the current user
   * @returns the wallet address of the current user, or null if the user is not connected
   */
  currentUser(): string | null {
    if (window.localStorage) {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  }

  /**
   * Connect to the ZKAuth service
   * @param direct - optional direct, will attempt to login directly with the provider
   * @returns a promise that resolves to the wallet address of the user
   */
  connect(direct?: "google"): Promise<string> {
    const opts: any = {
      network: "ll_pegasus",
      flow: "true",
      redirect: this.site.url,
      site: JSON.stringify(this.site),
    };
    if (direct) opts.direct = direct;

    const connectURL =
      `${this.endpoint}/flow/connect?` + new URLSearchParams(opts).toString();

    const popup = window.open(
      connectURL,
      "PopupWindow",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );

    return new Promise((resolve, reject) => {
      if (!popup) {
        reject(new Error("Failed to open popup"));
        return;
      }

      // create a listener for the message event
      const listener = (event: MessageEvent) => {
        console.log("[ZKAuth] Received message:", event.data);

        // Check if the message is from a trusted origin
        if (event.origin !== this.endpoint) {
          console.error(
            "Received message from unauthorized origin:",
            event.origin
          );
          return;
        }

        if (event.data.type === "zkauth:login") {
          const walletAddress = event.data.payload.walletAddress;
          console.log("Received wallet address:", walletAddress);

          // Resolve the promise
          popup?.close(); // Optionally close the popup
          // Remove the listener
          window.removeEventListener("message", listener);

          if (window.localStorage) {
            localStorage.setItem(STORAGE_KEY, walletAddress);
          }
          resolve(walletAddress);
        }
      };

      console.log("[ZKAuth] Waiting for message from popup");
      window.addEventListener("message", listener);
    });
  }

  /**
   * Reconnect to the ZKAuth service
   * @param direct - optional direct, will attempt to login directly with the provider
   * @returns a promise that resolves to the wallet address of the user
   */
  reconnect(direct?: "google"): Promise<string> {
    if (window.localStorage) {
      const walletAddress = localStorage.getItem(STORAGE_KEY);
      if (walletAddress) {
        return Promise.resolve(walletAddress);
      }
    }

    return this.connect(direct);
  }

  /**
   * Disconnect from the ZKAuth service
   */
  disconnect() {
    if (window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Send a transaction
   * @param tx - the transaction parameters
   * @returns a promise that resolves to the transaction object
   */
  sendTx(tx: SendTxParams) {
    const opts: any = {
      network: tx.network,
      to: tx.to,
      amount: tx.amount,
      data: tx.data,
      site: JSON.stringify(this.site),
      redirect: this.site.url,
      flow: "true",
    };

    const txURL =
      `${this.endpoint}/flow/send?` + new URLSearchParams(opts).toString();

    const popup = window.open(
      txURL,
      "PopupWindow",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );

    return new Promise((resolve, reject) => {
      if (!popup) {
        reject(new Error("Failed to open popup"));
        return;
      }

      const listener = (event: MessageEvent) => {
        console.log("[ZKAuth] Received message:", event.data);

        if (event.data.type === "zkauth:txSent") {
          resolve(event.data.payload.tx);
        }

        // Remove the listener
        window.removeEventListener("message", listener);
        popup?.close();
      };

      window.addEventListener("message", listener);
    });
  }
}
