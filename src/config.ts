import { AppConfig, getAppConfig, NetworkConfigs } from "@cosmicdapp/logic";

const local: AppConfig = {
  chainId: "cudos-testnet-public-3",
  chainName: "Cudos Testnet",
  addressPrefix: "cudos",
  rpcUrl: "http://sentry1.gcp-uscentral1.cudos.org:26657",
  httpUrl: "http://sentry1.gcp-uscentral1.cudos.org:1317",
  faucetUrl: "http://sentry1.gcp-uscentral1.cudos.org:26657",
  feeToken: "cudos",
  stakingToken: "cudos",
  coinMap: {
    cudos: { denom: "CUDOS", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
};

const sandynet: AppConfig = {
  chainId: "sandynet-1",
  chainName: "sandynet-1",
  addressPrefix: "wasm",
  rpcUrl: "https://rpc.sandynet.cosmwasm.com:443",
  httpUrl: "https://lcd.sandynet.cosmwasm.com",
  faucetUrl: "https://faucet.sandynet.cosmwasm.com",
  feeToken: "ubay",
  stakingToken: "umaya",
  coinMap: {
    ubay: { denom: "BAY", fractionalDigits: 6 },
    umaya: { denom: "MAYA", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
};

const configs: NetworkConfigs = { local, sandynet };
export const config = getAppConfig(configs);
