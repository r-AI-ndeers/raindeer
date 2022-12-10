import {Control, Controller, FieldError, useForm} from "react-hook-form";
import {
    BaseTextFieldProps,
    Box,
    Button, CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import {CreationStage} from "../../components/Stepper";
import {GeneratedData} from "./CreateCard";
import {ViewProps} from "./Preview";
import {Simulate} from "react-dom/test-utils";

interface UserInput {
    recipientName: string;
    senderName: string;
    context: string;
}

type InputTextFieldProps = {
    title: string;
    control: Control<UserInput, string>;
    field: keyof UserInput;
    formFieldError?: FieldError;
    subtitle?: string;
} & BaseTextFieldProps;

function InputTextField({
    title,
    field,
    subtitle,
    control,
    formFieldError,
    ...textFieldProps
}: InputTextFieldProps) {

    return (
        <Box width={"400px"}>
            <Stack direction={"column"}>
                <Typography variant={"h5"}>{title}*</Typography>
                <Typography variant={"body2"}>{subtitle}</Typography>
                <Controller
                    name={field}
                    control={control}
                    rules={{required: true}}
                    render={({field}) =>
                        <TextField
                            {...field}
                            error={!!formFieldError}
                            helperText={!!formFieldError && "This field is required"}
                            variant={"outlined"}
                            style={{backgroundColor: "white",}}
                            {...textFieldProps}
                        />
                    }
                />
            </Stack>
        </Box>
    )
}

interface PoemInputFormProps {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedData>>;
    setViewData: React.Dispatch<React.SetStateAction<ViewProps>>;
}

const generateMaterials = async (userInput: UserInput): Promise<GeneratedData> => {
    // FIXME: remove wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {poem: "Poem poem bla bla"}

    // return fetch("/api/generate", {
    //     method: "POST",
    //     body: JSON.stringify(userInput),
    // }).then(response => response.json()).then(data => {
    //     return {
    //         poem: "Poem poem bla bla"
    //     }
    // });
}

export function PoemInputForm({setActiveStep, setGeneratedData, setViewData}: PoemInputFormProps) {
    const {control, handleSubmit, formState: {errors}} = useForm<UserInput>();
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        const generatedMaterials = await generateMaterials(data);
        if (generatedMaterials) {
            setGeneratedData({
                poem: generatedMaterials.poem
            });
        }
        setViewData((prevState) => ({...prevState, from: data.senderName}))
        setIsLoading(false);
        setActiveStep("edit")
    });

    return (
        <form onSubmit={onSubmit}>
            <Stack direction={"column"} gap={"16px"}>
                <InputTextField
                    title={"From"}
                    field={"senderName"}
                    control={control}
                    formFieldError={errors.senderName}
                    placeholder={"Alice"}
                />
                <InputTextField
                    title={"To"}
                    field={"recipientName"}
                    control={control}
                    formFieldError={errors.recipientName}
                    placeholder={"Bob"}
                />
                <InputTextField
                    title={"Provide us some context"}
                    subtitle={"E.g. what does the person do, their interests, etc."}
                    field={"context"}
                    control={control}
                    multiline={true}
                    formFieldError={errors.context}
                    placeholder={"Bob is a great person who loves to play football. He is a lawyer and is very good at his job."}
                    rows={"3"}
                />
                <Button
                    disabled={isLoading}
                    variant={"contained"}
                    type={"submit"}
                    size={"large"}
                    style={{backgroundColor: isLoading ? "grey" : "#2E7D32"}}
                >
                    {!isLoading ? <Typography>Next</Typography> : <CircularProgress/>}
                </Button>
            </Stack>
        </form>
    )
}
