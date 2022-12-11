import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {CreationStage} from "../../components/Stepper";


export interface ViewData {
    poem: string;
    from: string;
}

type PreviewProps = ViewData & {
    setActiveStep: React.Dispatch<React.SetStateAction<CreationStage>>;
}

export function Preview({poem, from, setActiveStep}: PreviewProps) {

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
            <Button
                variant={"contained"}
                onClick={async () => await publish()}
                size={"large"}
                style={{backgroundColor: "#2E7D32"}}
            >
                Publish
            </Button>
        </Box>
    )
}
