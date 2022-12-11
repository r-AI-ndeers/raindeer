import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {ImageBackgroundLayout} from "../components/Layout";
import {MOCK_CARD_ID} from "../consts";
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';


export function Home() {
    return (
        <ImageBackgroundLayout>
            <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"}
                 alignItems={"center"} gap={"64px"}>
                <Typography variant="h1">
                    <b>rAIndeers</b>
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
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"64px"}>
                    <Box display={"flex"} flexDirection={"column"} gap={"16px"} alignItems={"center"} justifyContent={"center"}>
                        <Box display="flex" alignItems={"center"} gap={"16px"}>
                            <ImageIcon style={{fontSize:"48px"} }/>
                            <Typography variant={"h4"}>
                                Photos
                            </Typography>
                        </Box>
                        <Typography variant={"h5"} textAlign={"center"}>
                            Upload photo of you or your friends and have them modified for the Christmas spirit!
                        </Typography>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} gap={"16px"} alignItems={"center"} textAlign={"center"}>
                        <Box display="flex" alignItems={"center"} gap={"16px"}>
                            <EditIcon style={{fontSize:"48px"} }/>
                            <Typography variant={"h4"}>
                                Poem
                            </Typography>
                        </Box>
                        <Typography variant={"h5"}>
                            Our AI will generate a unique poem for you based on some facts about the person.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ImageBackgroundLayout>
    );
}
