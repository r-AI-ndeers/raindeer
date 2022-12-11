import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {ImageBackgroundLayout} from "../components/Layout";
import {MOCK_CARD_ID} from "../consts";


export function Home() {
    return (
        <ImageBackgroundLayout>
            <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"}
                 alignItems={"center"} gap={"64px"}>
                <Typography variant="h1">
                    rAIndeer
                </Typography>
                <Typography variant="h3">
                    Create personalised cards for people dear to you with AI!
                </Typography>
                <Box display={"flex"} gap={"16px"}>
                    <Button
                        variant={"contained"}
                        href={`/card/${MOCK_CARD_ID}`}
                        size={"large"}
                        style={{backgroundColor: "gray"}}
                    >
                        View example card
                    </Button>
                    <Button
                        size="large"
                        href={"/create"}
                        variant={"contained"}
                    >
                        <Typography color={"common.white"}>
                            Create a card
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </ImageBackgroundLayout>
    );
}
