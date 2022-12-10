import React from 'react';
import mainbackground from '../assets/mainbackground.jpg';
import {
    Box,
    CssBaseline,
    Typography,
    TextField,
    Stack,
    Button,
    BaseTextFieldProps
} from "@mui/material";
import {CardStepper, CreationStage} from "../components/Stepper";
import {Control, Controller, useForm} from 'react-hook-form';

interface UserInput {
    recipientName: string;
    senderName: string;
    context: string;
}

type InputTextFieldProps = {
    title: string;
    control: Control<UserInput, string>;
    field: keyof UserInput;
    subtitle?: string;
} & BaseTextFieldProps;

const InputTextField = ({
    title,
    field,
    subtitle,
    control,
    ...textFieldProps
}: InputTextFieldProps) => {

    return (
        <Box width={"400px"}>
            <Stack direction={"column"} gap={"8px"}>
                <Typography variant={"h5"}>{title}</Typography>
                <Typography variant={"body2"}>{subtitle}</Typography>
                <Controller
                    name={field}
                    control={control}
                    render={({field}) =>
                        <TextField
                            {...field}
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
}

function PoemInputForm({setActiveStep}: PoemInputFormProps) {
    const {control, handleSubmit, formState: {errors}} = useForm<UserInput>();

    const onSubmit = handleSubmit(data => {
        console.log(data);
    });

    return (
        <form>
            <Stack direction={"column"} gap={"16px"}>
                <InputTextField
                    title={"From"}
                    field={"senderName"}
                    control={control}
                    placeholder={"Alice"}
                />
                <InputTextField
                    title={"To"}
                    field={"recipientName"}
                    control={control}
                    placeholder={"Bob"}
                />
                <InputTextField
                    title={"Provide us some context"}
                    subtitle={"E.g. what does the person do, their interests, etc."}
                    field={"context"}
                    control={control}
                    multiline={true}
                    placeholder={"Bob is a great person who loves to play football. He is a lawyer and is very good at his job."}
                    rows={"3"}
                />
                <Button
                    variant={"contained"}
                    size={"large"}
                    style={{backgroundColor: "#2E7D32"}}
                    onClick={() => {setActiveStep("edit")}}
                >
                    Next
                </Button>
            </Stack>
        </form>
    )
}


export function CreateCard() {
    const [activeStep, setActiveStep] = React.useState<CreationStage>("input");

    return (
        <div>
            <CssBaseline/>
            <Box
                height="100vh"
                display="flex"
                alignItems="center"
                padding={"64px"}
                flexDirection="column"
                style={{
                    backgroundImage: `url(${mainbackground})`,
                    backgroundSize: "cover",
                }}
            >
                <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"}
                     alignItems={"center"} gap={"64px"}>
                    <CardStepper activeStep={activeStep}/>
                    {activeStep === "input" && <PoemInputForm setActiveStep={setActiveStep}/>}
                    {activeStep === "edit" && <Typography>Next step</Typography>}
                </Box>
            </Box>
        </div>
    );
}
