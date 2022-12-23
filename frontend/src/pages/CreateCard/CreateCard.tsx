import React from 'react';
import {
    Box,
    CssBaseline,
} from "@mui/material";
import {CardStepper, CreationStage} from "../../components/Stepper";
import {PoemEditForm} from "./PoemEditForm";
import {PoemInputForm} from "./PoemInputForm";
import {Preview, ViewData} from "./Preview";
import {ImageBackgroundLayout} from "../../components/Layout";
import {Publish} from "./Publish";

interface GeneratedPoem {
    style: string;
    poem: string;
}

export interface GeneratedData {
    generatedPoems: GeneratedPoem[];
    // A list of urls
    generatedImages: string[];
}

export function CreateCard() {
    // TODO: do everything through a reducer here
    const [activeStep, setActiveStep] = React.useState<CreationStage>("input");
    const [generatedData, setGeneratedData] = React.useState<GeneratedData>({generatedPoems: [], generatedImages: []});
    const [viewData, setViewData] = React.useState<ViewData>({poem: "", sender: "", image: null});
    const [cardId, setCardId] = React.useState<string | null>(null);

    return (
        <div>
            <CssBaseline/>
            <ImageBackgroundLayout>
                <Box maxWidth={"1024px"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"32px"}>
                    <CardStepper activeStep={activeStep}/>
                    {activeStep === "input" &&
                        <PoemInputForm
                            setActiveStep={setActiveStep}
                            setGeneratedData={setGeneratedData}
                            setViewData={setViewData}
                            generatedData={generatedData}
                        />
                    }
                    {activeStep === "edit" &&
                        <PoemEditForm
                            setActiveStep={setActiveStep}
                            generatedData={generatedData}
                            setViewData={setViewData}
                            setGeneratedData={setGeneratedData}
                        />
                    }
                    {activeStep === "preview" &&
                        <Preview
                            poem={viewData.poem}
                            sender={viewData.sender}
                            image={viewData.image}
                            setActiveStep={setActiveStep}
                            setCardId={setCardId}
                        />
                    }
                    {activeStep === "publish" && cardId !== null &&
                        <Publish
                            cardId={cardId}
                        />
                    }
                </Box>
            </ImageBackgroundLayout>
        </div>
    );
}
