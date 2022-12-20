import {ImageBackgroundLayout} from "../components/Layout";
import {Box, Button, Typography} from "@mui/material";
import React from "react";


export function NotFound() {

    return (
        <ImageBackgroundLayout>
            <Box maxWidth={"800px"} display={"flex"} flexGrow={1} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
                <Typography variant={"h2"}>
                    <b>Page not found :(</b>
                </Typography>
                <Typography variant={"h4"}>
                    Sorry but we couldn't find the page you were looking for.
                </Typography>
                <Button
                    variant={"contained"}
                    href={"/"}
                    size={"large"}
                >
                    Go back home
                </Button>
            </Box>
        </ImageBackgroundLayout>
    )
}