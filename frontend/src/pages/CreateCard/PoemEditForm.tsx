import React from "react";
import {CreationStage} from "../../components/Stepper";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, TextField} from "@mui/material";
import {GeneratedData} from "./CreateCard";
import {ViewProps} from "./Preview";

interface PoemEditFormProps {
    generatedData: GeneratedData,
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setViewData: React.Dispatch<React.SetStateAction<ViewProps>>;
}

interface EditDataProps {
    selectedPoem: string;
}

export function PoemEditForm({generatedData, setActiveStep, setViewData}: PoemEditFormProps) {
    const {control, handleSubmit} = useForm<EditDataProps>({
        defaultValues: {
            selectedPoem: generatedData.poem,
        }
    });

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
                    onClick={() => {
                        setActiveStep("edit")
                    }}
                >
                    Preview
                </Button>
            </Box>
        </form>
    )
}
