import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";

import { useError } from "@cosmicdapp/logic";
import { PageLayout, Loading } from "@cosmicdapp/design";
import { v4 as uuidv4 } from 'uuid';

import { GetAllResponse } from "../../../contracts/types/cw-cyph";
import { useCosmWasm } from "../../client";
import { useEncrypt } from "../../encrypt";
import { ErrorText, LightText, MainStack, PasswordStack } from "../../style";
import { pathAdd, pathTickets } from "../../paths";
import { StdFee } from "@cosmjs/stargate";

const { Title } = Typography;

export function Home(): JSX.Element {
  const { error, setError } = useError();
  const { address, getClient } = useCosmWasm();
  const { decrypt } = useEncrypt();
  const contractAddress = "cudos16sxavw8h0uqe565e5t7f9t72dxh8cr8d6ca8mq5xt9nn3djwy5ksu4raah";
  const [response, setResponse] = useState<GetAllResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const client = getClient();
    const queryAll: any = { get_events: {} };
    setLoading(true);
    client
      .queryContractSmart(contractAddress, queryAll)
      .then((result) => {
        setResponse(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(Error(error).message);
        setLoading(false);
      });
  }, [getClient, setError, address]);

  const moneyMoney = (eventName: string, owner: string, price: string) => {
    const client = getClient()
    const createTicket = { buy_ticket: { event: eventName, ticketId: uuidv4(), id: uuidv4() } };

    const defaultFee: StdFee = {
      amount: [],
      gas: "200000",
    };

    client.execute(address, contractAddress, createTicket, defaultFee)
    .then(() => {
      client.sendTokens(address, owner, [{ denom: "CUDOS", amount: price }], { amount: [], gas: "200000" })
      .then(res => {
        alert("You have bought 1 ticket for " + eventName)
      })
    })
    .catch((err: any) => {
        console.log(err)
    })
  }

  return loading ? (
    <Loading loadingText="Loading the best events in town..." />
  ) : (
    <PageLayout>
      <MainStack>
        <PasswordStack>
          <div style={{ display: "flex", width: "110%", justifyContent: "space-between", alignItems: "center", height: "10vh" }}>
            <Link to={pathTickets} style={{ color: "#ff4d4f" }}>Your Tickets</Link>
            <Title style={{ margin: 0 }} className="bigg" type="danger" level={1}>DEBOOK</Title>
            <Link to={pathAdd} style={{ color: "#ff4d4f" }}>Create Event</Link>
          </div>
          <p style={{ color: "#ff4d4f", fontSize: "24px" }}>Popular Events</p>
          {response && response.entries.map(({ name, venue, description, owner, price }) => (
            <Typography style={{ border: "2px solid red", padding: 10, borderRadius: 10, boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px" }}>
              <LightText style={{ fontWeight: "bold" }} type="danger">{name} </LightText>
              <LightText type="danger">Venue: {venue}</LightText>
              <LightText type="danger" className="short" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{description} </LightText>
              <br />
              <Button danger type="primary" shape="round" onClick={() => moneyMoney(name, owner as string, (price as number).toString())}>Book</Button>
            </Typography>
          ))}
          {error && <ErrorText>{error}</ErrorText>}

          <LightText type="danger">Interested in Hosting an event? <Link to={pathAdd} style={{ color: "#ff4d4f", textDecoration: "underline" }}>Create a new event.</Link></LightText>
        </PasswordStack>
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
