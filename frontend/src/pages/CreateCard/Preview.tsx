import React from "react";
import {Box, Typography} from "@mui/material";


export interface ViewProps {
    poem: string;
    from: string;
}

export function Preview({poem, from}: ViewProps) {

    return (
        <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"16px"}>
            <Typography
                variant={"h3"}
                style={{textAlign: "center", fontFamily: "Dancing Script"}}
            >
                {poem}
            </Typography>
            <Typography
                variant={"h2"}
                style={{textAlign: "center", fontFamily: "Dancing Script"}}
            >
                Merry Christmas!
                - From {from}
            </Typography>
        </Box>
    )
}
