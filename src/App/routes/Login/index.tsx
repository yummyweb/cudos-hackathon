import React from "react";
import { config } from "../../../config";
import { pathHome } from "../../paths";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading, PageLayout } from "@cosmicdapp/design";
import { ErrorText, LightText, MainStack, WelcomeStack } from "../../style";
import { Button, Typography } from "antd";
import { configKeplr, useError } from "@cosmicdapp/logic";
import { useCosmWasm } from "../../client";
import { LoadingOutlined } from "@ant-design/icons";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow { }
}

export interface RedirectLocation {
  readonly redirectPathname: string;
  readonly redirectState: any;
}

const { Title } = Typography;

export function Login(): JSX.Element {
  const history = useHistory();
  const { error, setError, clearError } = useError();
  const [initializing, setInitializing] = useState(false);
  const cosmWasm = useCosmWasm();

  async function initKeplr() {
    const anyWindow: any = window;
    try {
      if (!anyWindow.keplr) {
        throw Error("Keplr extension not found, please install browser extension")
      }
      await anyWindow.keplr.experimentalSuggestChain(configKeplr(config));
      await anyWindow.keplr.enable(config.chainId);

      setInitializing(true);
      clearError();

      const offlineSigner = await anyWindow.getOfflineSigner(config.chainId);
      cosmWasm.init(offlineSigner);
    } catch (error) {
      console.error(error);
      if (typeof error === "string") {
        setError(Error(error).message);
      } else if (error instanceof Error) {
        setError(error.message);
      }
      setInitializing(false);
    }
  }

  useEffect(() => {
    if (cosmWasm.initialized) {
      history.push(pathHome);
    }
  }, [cosmWasm.initialized]);

  return initializing ? (
    <Loading loadingText="Loading an amazing experience..." />
  ) : (
    <PageLayout>
      <MainStack>
        <WelcomeStack>
          <Typography>
            <Title className="bigg" type="danger" level={1}>DEBOOK</Title>
            <LightText type="danger" className="bigg">Book Tickets, With <span className="highlight">Confidence!</span></LightText>
            <br />
            <LightText type="danger">Please connect your Keplr wallet to continue.</LightText>
          </Typography>
          {error && <ErrorText>{error}</ErrorText>}
          <Button danger type="primary" shape="round" onClick={initKeplr}>
            Connect Wallet
          </Button>
        </WelcomeStack>
        <LightText type="secondary">Built with &nbsp;
          <a href="https://github.com/CosmWasm/cosmwasm"
            target="_blank"
            rel="noreferrer noopener">CosmWasm</a>
          &nbsp; and &nbsp;
          <a href="https://github.com/cosmos/cosmjs"
            target="_blank"
            rel="noreferrer noopener">CosmJS</a>
          &nbsp; by &nbsp;
          <a href="/"
            rel="noreferrer noopener">Team Blue Coders</a>.
        </LightText>
      </MainStack>
    </PageLayout>
  );
}
