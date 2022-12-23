import React from "react";
import {CreationStage} from "../../components/Stepper";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {GeneratedData} from "./CreateCard";
import {ViewData} from "./Preview";
import { ImageCarousel } from "../../components/ImageCarousel";

interface PoemEditFormProps {
    generatedData: GeneratedData,
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setViewData: React.Dispatch<React.SetStateAction<ViewData>>;
    setGeneratedData: React.Dispatch<React.SetStateAction<GeneratedData>>;
}

interface EditDataProps {
    selectedPoem: string;
    selectedImage: string | null;
}

export function PoemEditForm({
    generatedData,
    setActiveStep,
    setViewData,
    setGeneratedData
}: PoemEditFormProps) {
    const {control, handleSubmit, setValue} = useForm<EditDataProps>({
        defaultValues: {
            selectedPoem: generatedData.generatedPoems[0]?.poem || "",
            selectedImage: generatedData.generatedImages[0] ?? null,
        }
    });

    const [selectedStyle, setSelectedStyle] = React.useState<string>(generatedData.generatedPoems[0].style);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newStyle: string | null,
    ) => {
        if (newStyle !== null) {
            setSelectedStyle(newStyle);
            const newPoem = generatedData.generatedPoems.find((result) => result.style === newStyle)?.poem
            if (newPoem) {
                setValue("selectedPoem", newPoem);
            }
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        setViewData(prevState => ({
            ...prevState,
            poem: data.selectedPoem,
            image: data.selectedImage,
        }))
        setActiveStep("preview")
    });

    return (
        <form onSubmit={onSubmit}>
            <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} gap={"16px"}>
                <Typography variant={"h4"}>Edit your poem</Typography>
                <Typography variant={"h5"}>Select style</Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={selectedStyle}
                    style={{backgroundColor: "white", width: "fit-content"}}
                    exclusive
                    onChange={handleChange}
                >
                    {generatedData.generatedPoems.map((result, index) => (
                            <ToggleButton key={index} value={result.style}>{result.style}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <Typography variant={"body1"}>You can still edit the poem if you wish</Typography>
                <Controller
                    name={"selectedPoem"}
                    control={control}
                    render={({field}) =>
                        <TextField
                            {...field}
                            variant={"outlined"}
                            style={{backgroundColor: "white",}}
                            multiline
                            rows={16}
                        />
                    }
                />
                {generatedData.generatedImages.length > 0 && (
                    <Box display={"flex"} flexDirection={"column"}>
                        <Typography variant={"h4"}>Select image</Typography>
                        <ImageCarousel
                            images={generatedData.generatedImages}
                            setSelectedImage={(image: string) => { setValue("selectedImage", image) }}
                        />
                    </Box>
                )}
                <Box display={"flex"} justifyContent={"flex-end"} gap={"16px"}>
                    <Button
                        variant={"contained"}
                        onClick={() => {
                            setActiveStep("input")
                            setGeneratedData({
                                generatedPoems: [],
                                generatedImages: [],
                            })
                        }}
                        size={"large"}
                        style={{backgroundColor: "gray"}}
                    >
                        Back
                    </Button>
                    <Button
                        variant={"contained"}
                        type={"submit"}
                        size={"large"}
                    >
                        Preview
                    </Button>
                </Box>
            </Box>
        </form>
    )
}
