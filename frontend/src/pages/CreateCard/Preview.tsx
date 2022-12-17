import React from "react";
import {Box, Button} from "@mui/material";
import {CreationStage} from "../../components/Stepper";
import {BACKEND_URL} from "../../consts";
import {ChristmasCard} from "../../components/ChristmasCard";


export interface ViewData {
    poem: string;
    sender: string;
    image: string | null;
}

type PreviewProps = ViewData & {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Preview({poem, sender, image, setActiveStep, setCardId}: PreviewProps) {

    const publish = async () => {
        await fetch(`${BACKEND_URL}/publish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                poem: poem,
                sender: sender,
                image: image,
            }),
        }).then(response => response.json()).then((data) => {
            setCardId(data.id);
        })
        setActiveStep("publish");
    }

    return (
        <Box display={"flex"} flexDirection={"column"} gap={"32px"}>
            <ChristmasCard poem={poem} image={image} sender={sender} />
            <Box display={"flex"} justifyContent={"flex-end"} gap={"16px"}>
                <Button
                    variant={"contained"}
                    onClick={() => setActiveStep("edit")}
                    size={"large"}
                    style={{backgroundColor: "gray"}}
                >
                    Back
                </Button>
                <Button
                    variant={"contained"}
                    onClick={async () => await publish()}
                    size={"large"}
                >
                    Publish
                </Button>
            </Box>
        </Box>
    )
}
