import axios, { AxiosInstance } from "axios";

const DEFAULT_NODE_URL = "https://node.deso.org/api";

let client: AxiosInstance | null;

export class BitClout {
  baseUrl: string;

  constructor({ baseUrl = DEFAULT_NODE_URL }: { baseUrl?: string }) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get BitClout exchange rate, total amount of nanos sold, and Bitcoin exchange rate.
   */
  async getExchangeRate() {
    const path = "/v0/get-exchange-rate";

    const result = await this.getClient().get(path);

    return result?.data;
  }

  /**
   * Get state of BitClout App, such as cost of profile creation and diamond level map.
   */
  async getAppState() {
    const path = "/v0/get-app-state";

    const result = await this.getClient().post(path, {});

    return result?.data;
  }

  /**
   * Get hodling information about a specific Public Key (isHodlingPublicKey) given
   * a hodler Public Key (publicKey)
   */
  async getIsHodlingPublicKey({
    publicKey,
    isHodlingPublicKey,
  }: {
    publicKey: string;
    isHodlingPublicKey: string;
  }) {
    if (!publicKey) {
      throw new Error("publicKey is required");
    }

    if (!isHodlingPublicKey) {
      throw new Error("isHodlingPublicKey is required");
    }

    const path = "/v0/is-hodling-public-key";
    const data = {
      PublicKeyBase58Check: publicKey,
      IsHodlingPublicKeyBase58Check: isHodlingPublicKey,
    };

    const result = await this.getClient().post(path, data);

    return result?.data;
  }

  /**
   * Get information about single profile.
   */
  async getSingleProfile({
    publicKey,
    username,
  }: {
    publicKey?: string;
    username?: string;
  }) {
    if (!publicKey && !username)
      throw new Error("publicKey or username is required");

    const path = "/v0/get-single-profile";
    const data: any = {};
    if (publicKey) {
      data.PublicKeyBase58Check = publicKey;
    } else if (username) {
      data.username = username;
    }

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Get information about users. Request contains a list of public keys of users to fetch.
   */
  async getUsersStateless({ publicKeys }: { publicKeys: string[] }) {
    const path = "/v0/get-users-stateless";
    const data = {
      PublicKeysBase58Check: publicKeys,
      SkipForLeaderboard: true,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Get followers for given Public Key.
   */
  async getFollowsStateless({
    publicKey,
    getEntriesFollowingUsername,
    numToFetch,
  }: {
    publicKey: string;
    getEntriesFollowingUsername: boolean;
    numToFetch: number;
  }) {
    const path = "/v0/get-follows-stateless";
    const data = {
      PublicKeyBase58Check: publicKey,
      GetEntriesFollowingUsername: getEntriesFollowingUsername,
      NumToFetch: numToFetch,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Get BalanceEntryResponses for hodlings
   */
  async getHoldersForPublicKey({
    publicKey,
    username,
    numToFetch,
    fetchHodlings,
    lastPublicKey,
    fetchAll,
  }: {
    publicKey: string;
    username?: string;
    numToFetch: number;
    fetchHodlings?: boolean;
    lastPublicKey?: string;
    fetchAll?: boolean;
  }) {
    if (!publicKey && !username) {
      throw new Error("publicKey or username are required");
    }

    if (!numToFetch) {
      throw new Error("numToFetch is required");
    }

    const path = "/v0/get-hodlers-for-public-key";
    const data = {
      Username: username,
      FetchAll: fetchAll,
      PublicKeyBase58Check: publicKey,
      NumToFetch: numToFetch,
      LastPublicKeyBase58Check: lastPublicKey,
      FetchHodlings: fetchHodlings,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Get notifications for a given public key.
   * All parameters are required to get a response.
   * fetchStartIndex can be set to -1.
   */
  async getNotifications({
    publicKey,
    fetchStartIndex,
    numToFetch,
  }: {
    publicKey: string;
    fetchStartIndex: number;
    numToFetch: number;
  }) {
    if (!publicKey) {
      throw new Error("publicKey is required");
    }

    if (!fetchStartIndex) {
      throw new Error("fetchStartIndex is required");
    }

    if (!numToFetch) {
      throw new Error("numToFetch is required");
    }

    const path = "/v0/get-notifications";
    const data = {
      PublicKeyBase58Check: publicKey,
      FetchStartIndex: fetchStartIndex,
      NumToFetch: numToFetch,
    };

    const result = await this.getClient().post(path, data);

    return result?.data;
  }

  /**
   * Check if Txn is currently in mempool.
   */
  async getTransaction({ txnHashHex }: { txnHashHex: string }) {
    if (!txnHashHex) {
      throw new Error("txnHashHex is required");
    }

    const path = "/v0/get-txn";
    const data = {
      TxnHashHex: txnHashHex,
    };

    const result = await this.getClient().post(path, data);

    return result?.data;
  }

  /**
   * Submit transaction to BitClout blockchain.
   */
  async submitTransaction({ transactionHex }: { transactionHex: string }) {
    if (!transactionHex) {
      throw new Error("transactionHex is required");
    }

    const path = "/v0/submit-transaction";
    const data = {
      TransactionHex: transactionHex,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Authorize or delete a derived key.
   */
  async authorizeDerivedKey({
    ownerPublicKeyBase58Check,
    derivedPublicKeyBase58Check,
    expirationBlock,
    accessSignature,
    deleteKey,
    derivedKeySignature,
    minFeeRateNanosPerKB,
  }: {
    ownerPublicKeyBase58Check: string;
    derivedPublicKeyBase58Check: string;
    expirationBlock: number;
    accessSignature: string;
    deleteKey: boolean;
    derivedKeySignature: string;
    minFeeRateNanosPerKB: number;
  }) {
    if (!ownerPublicKeyBase58Check) {
      throw new Error("ownerPublicKeyBase58Check is required");
    }

    if (!derivedPublicKeyBase58Check) {
      throw new Error("derivedPublicKeyBase58Check is required");
    }

    if (!expirationBlock) {
      throw new Error("expirationBlock is required");
    }

    if (!accessSignature) {
      throw new Error("accessSignature is required");
    }

    if (deleteKey === undefined) {
      throw new Error("deleteKey is required");
    }

    if (!minFeeRateNanosPerKB) {
      throw new Error("minFeeRateNanosPerKB is required");
    }

    const path = "/v0/authorize-derived-key";
    const data = {
      OwnerPublicKeyBase58Check: ownerPublicKeyBase58Check,
      DerivedPublicKeyBase58Check: derivedPublicKeyBase58Check,
      ExpirationBlock: expirationBlock,
      AccessSignature: accessSignature,
      DeleteKey: deleteKey,
      DerivedKeySignature: derivedKeySignature,
      MinFeeRateNanosPerKB: minFeeRateNanosPerKB,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Append extra data to a transaction.
   */
  async appendExtraData({
      transactionHex,
      extraData,
  }: {
    transactionHex: string;
    extraData: any;
  }) {
    if (!transactionHex) {
      throw new Error("transactionHex is required");
    }

    if (!extraData) {
      throw new Error("extraData is required");
    }

    const path = "/v0/append-extra-data";
    const data = {
      TransactionHex: transactionHex,
      ExtraData: extraData,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  /**
   * Get all authorized derived keys.
   */
  async getUserDerivedKeys({ publicKeyBase58Check }: { publicKeyBase58Check: string; }) {
    if (!publicKeyBase58Check) {
      throw new Error("publicKeyBase58Check is required");
    }

    const path = "/v0/get-user-derived-keys";
    const data = {
      PublicKeyBase58Check: publicKeyBase58Check,
    };

    const result = await this.getClient().post(path, data);
    return result?.data;
  }

  private getClient() {
    if (client) return client;
    client = axios.create({
      baseURL: this.baseUrl
    });
    return client;
  }
}
