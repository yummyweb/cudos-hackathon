import { Button } from "antd";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import React from "react";
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

interface FormAddProps {
    readonly setNewName: (value: React.SetStateAction<string>) => void;
    readonly setNewVenue: (value: React.SetStateAction<string>) => void;
    readonly setNewDescription: (value: React.SetStateAction<string>) => void;
    readonly setNewPrice: (value: React.SetStateAction<number>) => void;
    readonly addButtonAction: () => void;
}

export function FormAdd({
    setNewName,
    setNewVenue,
    setNewDescription,
    setNewPrice,
    addButtonAction,
}: FormAddProps): JSX.Element {
    const history = useHistory();
    return (
        <Formik
            initialValues={{ name: "", venue: "", description: "", price: 0 }}
            onSubmit= {addButtonAction}
        >
            {(formikProps) => (
                <Form>
                    <FormItem name="name">
                        <Input
                            name="name"
                            placeholder="Enter name"
                            onChange={(event) => {
                                setNewName(event.target.value);
                            }}
                        />
                    </FormItem>
                    <FormItem name="venue">
                        <Input
                            name="venue"
                            placeholder="Enter venue"
                            onChange={(event) => {
                                setNewVenue(event.target.value);
                            }}
                        />
                    </FormItem>
                    <FormItem name="description">
                        <Input
                            name="description"
                            placeholder="Enter description"
                            onChange={(event) => {
                                setNewDescription(event.target.value);
                            }}
                        />
                    </FormItem>
                    <FormItem name="price">
                        <Input
                            name="price"
                            placeholder="Enter price"
                            onChange={(event) => {
                                setNewPrice(parseInt(event.target.value));
                            }}
                        />
                    </FormItem>
                    <LeftOutlined onClick= {() => history.goBack()} />
                    <Button
                        type="primary"
                        danger
                        shape="round"
                        onClick={addButtonAction}
                        disabled={!(formikProps.isValid && formikProps.dirty)}>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
}