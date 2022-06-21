import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "antd";

import { useError } from "@cosmicdapp/logic";
import { PageLayout, Loading } from "@cosmicdapp/design";
import { StdFee } from "@cosmjs/stargate";

import { ExecuteMsg } from "../../../contracts/types/cw-cyph";
import { v4 as uuidv4 } from 'uuid';
import { useCosmWasm } from "../../client";
import { useEncrypt } from "../../encrypt";
import { ErrorText, LightText, MainStack, PasswordStack } from "../../style";
import { FormAdd } from "./FormAdd";
import { pathHome } from "../../paths";

const { Title } = Typography;

export function Add(): JSX.Element {
    const { error, setError } = useError();
    const history = useHistory();
    const { address, getClient } = useCosmWasm();
    const contractAddress = "cudos16sxavw8h0uqe565e5t7f9t72dxh8cr8d6ca8mq5xt9nn3djwy5ksu4raah";
    const [loading, setLoading] = useState(false);
    const { encrypt } = useEncrypt();

    const [newName, setNewName] = useState("");
    const [newVenue, setNewVenue] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState(0);

    function tryAdd() {
        setLoading(true);
        const client = getClient();
        const data = { create: { name: newName, venue: newVenue, description: newDescription, id: uuidv4(), price: newPrice } };
        const defaultFee: StdFee = {
            amount: [],
            gas: "200000",
        };

        client
            .execute(address, contractAddress, data, defaultFee)
            .then(() => {
                history.push(pathHome);
                setLoading(false);
            })
            .catch((error: any) => {
                console.error(error);
                setError(Error(error).message);
                setLoading(false);
            });
    }

    return loading ? (
        <Loading loadingText="Creating a magical experience..." />
    ) : (
        <PageLayout>
            <MainStack>
                <PasswordStack>
                    <Title className="bigg" type="danger" level={1}>DEBOOK</Title>
                    <LightText type="danger">Create a new event.</LightText>
                    <FormAdd
                        setNewName={setNewName}
                        setNewVenue={setNewVenue}
                        setNewDescription={setNewDescription}
                        setNewPrice={setNewPrice}
                        addButtonAction={tryAdd}
                    />
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
