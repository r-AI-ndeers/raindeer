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
import {green} from "@mui/material/colors";

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
            <Stack direction={"column"}>
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
        interests: userInput.interests,
        // Verse count is just hardcoded to 3 for now
        verseCount: 3,
        person: userInput.person,
        fact: userInput.fact,
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
    });
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
    });
}

export function PoemInputForm({
    setActiveStep,
    setGeneratedData,
    setViewData
}: PoemInputFormProps) {
    const {control, handleSubmit, formState: {errors}} = useForm<UserInput>();
    const [image, setImage] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        const generatedPoem = await generatePoem(data);
        const generatedImages = await generateImages(image);
        if (generatedPoem) {
            setGeneratedData({
                generatedPoems: generatedPoem.results,
                generatedImages: generatedImages.results,
            });
        }
        setViewData((prevState) => ({...prevState, from: data.senderName}))
        setIsLoading(false);
        setActiveStep("edit")
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
                    title={"What interests this person?"}
                    subtitle={"For example “games“ or “coding“."}
                    field={"interests"}
                    isRequired
                    control={control}
                    formFieldError={errors.interests}
                />
                {/* commented out for now because it's just too many fields */}
                {/*<InputTextField*/}
                {/*    title={"Who is this person to you?"}*/}
                {/*    subtitle={"For example “an awesome friend”, “a great colleague”, “my grandma“, etc."}*/}
                {/*    field={"person"}*/}
                {/*    control={control}*/}
                {/*    formFieldError={errors.person}*/}
                {/*/>*/}
                {/*<InputTextField*/}
                {/*    title={"Tell us a random fact about this person"}*/}
                {/*    subtitle={"For example “recently moved“, “loves and hates her PhD“, etc."}*/}
                {/*    field={"fact"}*/}
                {/*    control={control}*/}
                {/*    formFieldError={errors.fact}*/}
                {/*/>*/}
                <ImageUpload setImage={setImage}  />
                <Button
                    disabled={isLoading}
                    variant={"contained"}
                    type={"submit"}
                    size={"large"}
                    style={{backgroundColor: isLoading ? "grey" : green[500]}}
                >
                    {!isLoading ? <Typography>Next</Typography> : <CircularProgress/>}
                </Button>
            </Stack>
        </form>
    )
}
