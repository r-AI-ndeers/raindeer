import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {CreationStage} from "../../components/Stepper";


export interface ViewData {
    poem: string;
    from: string;
    image: string | null;
}

type PreviewProps = ViewData & {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
}

export function Preview({poem, from, image, setActiveStep}: PreviewProps) {

    const publish = async () => {
        // await fetch(`${BACKEND_URL}/publish`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         poem: poem,
        //         from: from,
        //     }),
        // })
        setActiveStep("publish");
    }

    return (
        <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
            {image !== null && (
                <img
                    style={{
                        width: "512",
                        height: "512",
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
                    style={{backgroundColor: "#2E7D32"}}
                >
                    Publish
                </Button>
            </Box>
        </Box>
    )
}
