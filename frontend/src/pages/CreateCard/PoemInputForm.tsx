import { Control, Controller, FieldError, useForm } from "react-hook-form";
import {
    BaseTextFieldProps,
    Box,
    Button, CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { CreationStage } from "../../components/Stepper";
import { GeneratedData } from "./CreateCard";
import { ViewData } from "./Preview";
import { ImageUpload } from "./ImageUpload";
import { BACKEND_URL } from "../../consts";
import { primaryColor } from "../../index";
import { useGenerateImages } from "../../hooks/generateImages";

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
        <Box display={"flex"} flexDirection={"column"} flexGrow={"1"} gap={"8px"}>
            <Typography
                variant={"h6"}>{title}</Typography>
            <Typography variant={"body2"}>{subtitle}</Typography>
            <Controller
                name={field}
                control={control}
                rules={{ required: isRequired }}
                render={({ field }) =>
                    <TextField
                        {...field}
                        error={!!formFieldError}
                        helperText={!!formFieldError && "This field is required"}
                        variant={"outlined"}
                        style={{
                            backgroundColor: "white",
                            opacity: 0.75,
                            borderRadius: 5,
                        }}
                        {...textFieldProps}
                    />
                }
            />
        </Box>
    )
}

interface PoemInputFormProps {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedData>>;
    setViewData: React.Dispatch<React.SetStateAction<ViewData>>;
    generatedData: GeneratedData
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


export function PoemInputForm({
    setActiveStep,
    setGeneratedData,
    setViewData,
    generatedData
}: PoemInputFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<UserInput>();
    const [image, setImage] = React.useState<File | null>(null);
    const [isLoadingPoem, setIsLoadingPoem] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [generatedImages, isImageGenerationLoading] = useGenerateImages(image);

    const onSubmit = handleSubmit(async (data) => {

        setIsLoadingPoem(true);
        // generate image and generate poem
        const generatedPoem = await generatePoem(data)

        if (generatedPoem) {
            setGeneratedData((prevState) => ({
                ...prevState,
                generatedPoems: generatedPoem.results,
            }));
            setViewData((prevState) => ({ ...prevState, sender: data.senderName }))
            setIsLoadingPoem(false);
        } else {
            setIsError(true);
            setIsLoadingPoem(false)
        }
    });

    useEffect(() => {
        setGeneratedData((prevState) => ({
            ...prevState,
            generatedImages: generatedImages
        })
        )
    }, [generatedImages.length, setGeneratedData])

    useEffect(() => {
        const imageAndPoemReady = image !== null && generatedData.generatedPoems.length > 0 && generatedData.generatedImages.length > 0
        const justPoemReady = image === null && generatedData.generatedPoems.length > 0
        if (imageAndPoemReady || justPoemReady) {
            setActiveStep("edit")
        }
    }, [generatedData.generatedPoems.length, generatedData.generatedImages.length, image])

    // since image generation is happening in the background on upload only we don't
    // show loading state when it's happening, only if the poem generation is
    // already done
    const isWaitingOnImageGeneration = isImageGenerationLoading && generatedData.generatedPoems.length > 0;
    const isLoading = isLoadingPoem || isWaitingOnImageGeneration;


    return (
        <form onSubmit={onSubmit}>
            <Box display="flex" flexDirection={"column"} gap={"64px"} maxWidth={"600px"}>
                <ImageUpload setImage={setImage} />
                <Stack display="flex" flexDirection="column" gap="32px">
                    <Typography variant={"h4"}><b>Input for poem</b></Typography>
                    <Box display="flex" gap="32px">
                        <InputTextField
                            title={"From"}
                            placeholder="John"
                            field={"senderName"}
                            control={control}

                            isRequired
                            formFieldError={errors.senderName}
                        />
                        <InputTextField
                            title={"To"}
                            placeholder="Jane"
                            isRequired
                            field={"recipientName"}
                            control={control}
                            formFieldError={errors.recipientName}
                        /></Box>
                    
                    <InputTextField
                        title={"What does this person like?"}
                        placeholder={"bikes, writing poems, having fun with friends"}
                        field={"likes"}

                        isRequired
                        control={control}
                        formFieldError={errors.likes}
                    />
                    <InputTextField
                        title={"Give us a (funny) fact about this person"}
                        isRequired
                        placeholder={"sings in the shower, has travelled 5 countries"}
                        field={"fact"}
                        control={control}
                        formFieldError={errors.fact}
                    />
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}
                        justifyContent={"center"} marginTop={"32px"} gap="16px">
                        <Button
                            disabled={isLoading}
                            variant={"contained"}
                            type={"submit"}
                            size={"large"}
                            style={{ backgroundColor: isLoading ? "grey" : primaryColor }}
                        >
                            {!isLoading ?
                                <Typography>Generate</Typography> :
                                <Box display={"flex"} gap={"4px"} alignItems={"center"}>
                                    <CircularProgress size={"1rem"} />
                                    <Typography>Generating...</Typography>
                                </Box>
                            }
                        </Button>
                        {isError && <Typography variant={"body1"} color={"error"}>{"Something went wrong, please try again"}</Typography>}
                        <Typography color="gray"><i>*Generation can take up to a minute</i></Typography>
                    </Box>
                </Stack>
                <Typography fontSize={"12px"} color={"gray"} textAlign={"center"} marginBottom={"-24px"}>
                    Please note that our Christmas Card generator uses advanced artificial intelligence algorithms like GPT-3 and Stable Diffusion to generate personalized poems and adjust selfies to be in a Christmas style. This is only for entertainment purposes. While we strive to provide high-quality results, please be aware that the content generated by the system is not predictable and may not always be completely accurate, unbiased or suitable for all audiences. We are not responsible for any errors or omissions in the content generated by the system or for any actions taken based on the information provided. We ask you to use the cards responsibly.
                </Typography>
            </Box>
        </form >
    )
}
