import React from "react";
import {Box, Button, Typography} from "@mui/material";


export interface ViewProps {
    poem: string;
    from: string;
}

export function Preview({poem, from}: ViewProps) {

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
                type={"submit"}
                size={"large"}
                style={{backgroundColor: "#2E7D32"}}
            >
                Publish
            </Button>
        </Box>
    )
}
