import React from 'react';
import mainbackground from '../../assets/mainbackground.jpg';
import {
    Box,
    CssBaseline,
} from "@mui/material";
import {CardStepper, CreationStage} from "../../components/Stepper";
import {PoemEditForm} from "./PoemEditForm";
import {PoemInputForm} from "./PoemInputForm";
import {Preview, ViewProps} from "./Preview";

export interface GeneratedData {
    poem: string;
}

export function CreateCard() {
    // TODO: do everything through a reducer here
    const [activeStep, setActiveStep] = React.useState<CreationStage>("input");
    const [generatedData, setGeneratedData] = React.useState<GeneratedData>({poem: ""});
    const [viewData, setViewData] = React.useState<ViewProps>({poem: "", from: ""});

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
                    {activeStep === "input" &&
                        <PoemInputForm
                            setActiveStep={setActiveStep}
                            setGeneratedData={setGeneratedData}
                            setViewData={setViewData}
                        />
                    }
                    {activeStep === "edit" &&
                        <PoemEditForm
                            setActiveStep={setActiveStep}
                            generatedData={generatedData}
                            setViewData={setViewData}
                        />
                    }
                    {activeStep === "preview" &&
                        <Preview
                            poem={viewData.poem}
                            from={viewData.from}
                        />
                    }
                </Box>
            </Box>
        </div>
    );
}
