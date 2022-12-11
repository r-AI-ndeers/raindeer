import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {CreationStage} from "../../components/Stepper";
import {BACKEND_URL} from "../../consts";


export interface ViewData {
    poem: string;
    from: string;
    image: string | null;
}

type PreviewProps = ViewData & {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
    setCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Preview({poem, from, image, setActiveStep, setCardId}: PreviewProps) {

    const publish = async () => {
        await fetch(`${BACKEND_URL}/publish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                poem: poem,
                sender: from,
                image: image,
            }),
        }).then(response => response.json()).then((data) => {
            setCardId(data.id);
        })
        setActiveStep("publish");
    }

    return (
        <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
            {image !== null && (
                <img
                    style={{
                        height: "auto",
                        aspectRatio: "1",
                        maxWidth: "100%",
                        display: "block",
                        margin: "auto",
                    }}
                    src={image}
                />
            )}
            <Typography
                variant={"h4"}
                style={{
                    textAlign: "center",
                    fontFamily: "Dancing Script",
                    whiteSpace: "pre-line",
                }}
            >
                {poem}
            </Typography>
            <Typography
                variant={"h3"}
                style={{
                    textAlign: "center",
                    fontFamily: "Dancing Script",
                    whiteSpace: "pre-line",
                }}
            >
                Merry Christmas! <br/>
                - From {from}
            </Typography>
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
