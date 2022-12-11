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
    const [viewData, setViewData] = React.useState<ViewData>({poem: "", from: "", image: null});
    console.log(viewData)

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
                            image={viewData.image}
                            setActiveStep={setActiveStep}
                        />
                    }
                    {activeStep === "publish" &&
                        <Publish
                            //FIXME
                            sharableUrl={"http://localhost:3000/card/123"}
                        />
                    }
                </Box>
            </ImageBackgroundLayout>
        </div>
    );
}
