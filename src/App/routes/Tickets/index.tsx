import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";

import { useError } from "@cosmicdapp/logic";
import { PageLayout, Loading } from "@cosmicdapp/design";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { GetAllResponse, QueryMsg } from "../../../contracts/types/cw-cyph";
import { useCosmWasm } from "../../client";
import { useEncrypt } from "../../encrypt";
import { ErrorText, LightText, MainStack, PasswordStack } from "../../style";
import { pathAdd, pathHome } from "../../paths";

const { Title } = Typography;

export function Tickets(): JSX.Element {
    const { error, setError } = useError();
    const { address, getClient } = useCosmWasm();
    const { decrypt } = useEncrypt();
    const contractAddress = "cudos16sxavw8h0uqe565e5t7f9t72dxh8cr8d6ca8mq5xt9nn3djwy5ksu4raah";
    const [response, setResponse] = useState<any>(null);
    const [tickets, setTickets] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const client = getClient();
        const queryAll: any = { get_tickets: {} };
        setLoading(true);
        client
            .queryContractSmart(contractAddress, queryAll)
            .then((result) => {
                setResponse(result);
                let _tickets = []
                for (let i = 0; i < result.tickets.length; i++) {
                    const ticket = result.tickets[i];
                    if (ticket.owner === address) {
                        _tickets.push(ticket)
                    }
                }
                setTickets(_tickets)
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError(Error(error).message);
                setLoading(false);
            });
    }, [getClient, setError, address]);

    return loading ? (
        <Loading loadingText="Loading the best events in town..." />
    ) : (
        <PageLayout>
            <MainStack>
                <PasswordStack>
                    <Title className="bigg" type="danger" level={1}>DEBOOK</Title>
                    <p style={{ color: "#ff4d4f", fontSize: "24px" }}>Your Tickets:</p>
                    {tickets.length === 0 ? (
                        <div>
                            <LightText type="danger">No tickets yet... <Link to={pathHome} style={{ color: "#ff4d4f", textDecoration: "underline" }}>book one.</Link></LightText>
                        </div>
                    ) : null}
                    {tickets.map(({ event, id }: any) => (
                        <>
                            <LightText type="danger">Ticket { id.substring(0, 13) }</LightText>
                            <LightText type="danger" style={{ margin: 0 }}>Event: { event }</LightText>
                        </>
                    ))}
                    {error && <ErrorText>{error}</ErrorText>}

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
