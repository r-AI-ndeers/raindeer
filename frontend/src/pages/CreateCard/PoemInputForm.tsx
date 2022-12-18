import {Control, Controller, FieldError, useForm} from "react-hook-form";
import {
    BaseTextFieldProps,
    Box,
    Button, CircularProgress,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect} from "react";
import {CreationStage} from "../../components/Stepper";
import {GeneratedData} from "./CreateCard";
import {ViewData} from "./Preview";
import {ImageUpload} from "./ImageUpload";
import {BACKEND_URL} from "../../consts";
import {primaryColor} from "../../index";
import {useGenerateImages} from "../../hooks/generateImages";

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
    const {control, handleSubmit, formState: {errors}} = useForm<UserInput>();
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
            setViewData((prevState) => ({...prevState, sender: data.senderName}))
            setIsLoadingPoem(false);
        } else {
            setIsError(true);
            setIsLoadingPoem(false)
        }
    });

    useEffect(() => {
        console.log("setting images useeffect")
        setGeneratedData((prevState) => ({
                ...prevState,
                generatedImages: generatedImages
            })
        )
    }, [generatedImages.length, setGeneratedData])

    useEffect(() => {
        if (image !== null && generatedData.generatedPoems.length > 0 && generatedData.generatedImages.length > 0) {
            setActiveStep("edit")
        }
    }, [generatedData.generatedPoems.length, generatedData.generatedImages.length, image])

    // clear previous data on load
    // TODO: better save state when going back
    useEffect(() => {
        setGeneratedData((prevState) => ({
            generatedPoems: [],
            generatedImages: [],
        }))
    }, [])

    // since image generation is happening in the background on upload only we don't
    // show loading state when it's happening, only if the poem generation is
    // already done
    const isWaitingOnImageGeneration = isImageGenerationLoading && generatedData.generatedPoems.length > 0;
    const isLoading = isLoadingPoem || isWaitingOnImageGeneration;

    console.log(isLoading, generatedData, image, generatedImages)


    return (
        <form onSubmit={onSubmit}>
            <Stack direction={"column"} gap={"16px"} maxWidth={"600px"}>
                <ImageUpload setImage={setImage}/>
                <Typography variant={"h4"}>Input for poem</Typography>
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
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"}
                     justifyContent={"center"} marginTop={"32px"}>
                    <Typography>(Generation can take up to a minute)</Typography>
                    <Button
                        disabled={isLoading}
                        variant={"contained"}
                        type={"submit"}
                        size={"large"}
                        style={{backgroundColor: isLoading ? "grey" : primaryColor}}
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
                <Typography variant={"body1"}
                            color={"error"}>{isError && "Something went wrong, please try again"}</Typography>
            </Stack>
        </form>
    )
}
