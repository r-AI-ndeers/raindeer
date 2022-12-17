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
import {ViewData} from "./Preview";
import {ImageUpload} from "./ImageUpload";
import {BACKEND_URL} from "../../consts";
import {primaryColor} from "../../index";

interface UserInput {
    recipientName: string;
    senderName: string;
    likes: string;
    interests: string;
    person: string;
    fact: string;
}

type InputTextFieldProps = {
    title: string;
    control: Control<UserInput, string>;
    field: keyof UserInput;
    formFieldError?: FieldError;
    subtitle?: string;
    isRequired?: boolean;
} & BaseTextFieldProps;

function InputTextField({
    title,
    field,
    subtitle,
    control,
    formFieldError,
    isRequired = false,
    ...textFieldProps
}: InputTextFieldProps) {

    return (
        <Box display={"flex"}>
            <Stack direction={"column"} gap={"8px"}>
                <Typography
                    variant={"h5"}>{title}{isRequired ? "*" : " (optional)"}</Typography>
                <Typography variant={"body2"}>{subtitle}</Typography>
                <Controller
                    name={field}
                    control={control}
                    rules={{required: isRequired}}
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
    setViewData: React.Dispatch<React.SetStateAction<ViewData>>;
}

interface GeneratePoemResponse {
    results: { style: string; poem: string; }[];
}

interface GenerateEndpointRequest {
    receiver: string,
    likes: string,
    interests: string,
    verseCount: number,
    person: string,
    fact: string,
}

function userInputToGenerateRequest(userInput: UserInput): GenerateEndpointRequest {
    return {
        receiver: userInput.recipientName,
        likes: userInput.likes,
        fact: userInput.fact || "",
        interests: userInput.interests || "",
        // Verse count is just hardcoded to 3 for now
        verseCount: 3,
        person: userInput.person || "",
    }
}

const generatePoem = async (userInput: UserInput) => {
    return fetch(`${BACKEND_URL}/generate/poem`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(userInputToGenerateRequest(userInput)),
    }).then(response => response.json()).then((data: GeneratePoemResponse) => {
        return data
    }).catch((error) => {
        console.log(error)
    })
}

interface GenerateImageResponse {
    results: string[];
}

const generateImages = async (image: File | null) => {
    if (image === null) {
        return {results: []}
    }

    let data = new FormData()
    data.append('file', image)

    return fetch(`${BACKEND_URL}/generate/image`, {
      method: 'POST',
      body: data
    }).then(response => response.json()).then((data: GenerateImageResponse) => {
        return data
    }).catch((error) => {
        console.log(error)
    })
}

export function PoemInputForm({
    setActiveStep,
    setGeneratedData,
    setViewData
}: PoemInputFormProps) {
    const {control, handleSubmit, formState: {errors}} = useForm<UserInput>();
    const [image, setImage] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const onSubmit = handleSubmit(async (data) => {

        setIsLoading(true);
        // generate image and generate poem in concurrently
        const [generatedPoem, generatedImages] = await Promise.all([
            generatePoem(data),
            generateImages(image),
        ]);

        if (generatedPoem && generatedImages) {
            setGeneratedData({
                generatedPoems: generatedPoem.results,
                generatedImages: generatedImages.results,
            });
            setViewData((prevState) => ({...prevState, sender: data.senderName}))
            setIsLoading(false);
            setActiveStep("edit")
        } else {
            setIsError(true);
            setIsLoading(false)
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <Stack direction={"column"} gap={"16px"} maxWidth={"600px"}>
                <Typography variant={"h3"}>Input for poem</Typography>
                <InputTextField
                    title={"From"}
                    field={"senderName"}
                    control={control}
                    isRequired
                    formFieldError={errors.senderName}
                />
                <InputTextField
                    title={"To"}
                    isRequired
                    field={"recipientName"}
                    control={control}
                    formFieldError={errors.recipientName}
                />
                <InputTextField
                    title={"What does this person like?"}
                    subtitle={"For example “bikes”, “writing poems”, “having fun with friends”, etc."}
                    field={"likes"}
                    isRequired
                    control={control}
                    formFieldError={errors.likes}
                />
                <InputTextField
                    title={"Give us a (funny) fact about this person"}
                    isRequired
                    subtitle={"For example “sings in the shower“, “has travelled 5 countries“, etc."}
                    field={"fact"}
                    control={control}
                    formFieldError={errors.fact}
                />
                <ImageUpload setImage={setImage}  />
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} marginTop={"32px"}>
                    <Typography>(Generation can take up to a minute)</Typography>
                    <Button
                        disabled={isLoading}
                        variant={"contained"}
                        type={"submit"}
                        size={"large"}
                        style={{backgroundColor: isLoading ? "grey" : primaryColor }}
                    >
                        {!isLoading ?
                            <Typography>Generate</Typography> :
                            <Box display={"flex"} gap={"4px"} alignItems={"center"}>
                                <CircularProgress size={"1rem"}/>
                                <Typography>Generating...</Typography>
                            </Box>
                        }
                    </Button>
                </Box>
                <Typography variant={"body1"} color={"error"}>{isError && "Something went wrong, please try again"}</Typography>
            </Stack>
        </form>
    )
}
