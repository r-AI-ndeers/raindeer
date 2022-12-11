import React from "react";
import {CreationStage} from "../../components/Stepper";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, TextField, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {GeneratedData} from "./CreateCard";
import {ViewData} from "./Preview";

interface PoemEditFormProps {
    generatedData: GeneratedData,
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setViewData: React.Dispatch<React.SetStateAction<ViewData>>;
}

interface EditDataProps {
    selectedPoem: string;
}

export function PoemEditForm({
    generatedData,
    setActiveStep,
    setViewData
}: PoemEditFormProps) {
    const {control, handleSubmit, setValue} = useForm<EditDataProps>({
        defaultValues: {
            selectedPoem: generatedData.results[0].poem,
        }
    });

    const [selectedStyle, setSelectedStyle] = React.useState<string>(generatedData.results[0].style);

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newStyle: string,
    ) => {
        setSelectedStyle(newStyle);
        const newPoem = generatedData.results.find((result) => result.style === newStyle)?.poem
        if (newPoem) {
            setValue("selectedPoem", newPoem);
        }
    };


    const onSubmit = handleSubmit(async (data) => {
        setViewData(prevState => ({
            ...prevState,
            poem: data.selectedPoem,
        }))
        setActiveStep("preview")
    });

    return (
        <form onSubmit={onSubmit}>
            <Box width={"400px"} display={"flex"} flexDirection={"column"} gap={"16px"}>
                <Typography variant={"h4"}>Edit your poem</Typography>
                <Typography variant={"h5"}>Select style</Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={selectedStyle}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    {generatedData.results.map((result, index) => (
                            <ToggleButton value={result.style}>{result.style}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
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
                <Button
                    variant={"contained"}
                    type={"submit"}
                    size={"large"}
                    style={{backgroundColor: "#2E7D32"}}
                >
                    Preview
                </Button>
            </Box>
        </form>
    )
}
