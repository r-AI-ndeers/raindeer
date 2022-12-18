import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {ImageBackgroundLayout} from "../components/Layout";
import {MOCK_CARD_ID} from "../consts";
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import {primaryColor} from "../index";


export function Home() {

    return (
        <ImageBackgroundLayout>
            <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
                <Typography variant={"h1"}>
                    <b>r<Typography variant="h1" display={"inline"} color={primaryColor}><b>AI</b></Typography>ndeers</b>
                </Typography>
                <Typography variant="h3" textAlign={"center"}>
                    Create sharable and personalised Christmas cards for people dear to you with AI!
                </Typography>
                <Box display={"flex"} gap={"16px"}>
                    <Button
                        variant={"contained"}
                        href={`/card/${MOCK_CARD_ID}`}
                        size={"large"}
                        style={{backgroundColor: "gray"}}
                    >
                        <Typography variant={"h6"}>
                            View example card
                        </Typography>
                    </Button>
                    <Button
                        size="large"
                        href={"/create"}
                        variant={"contained"}
                    >
                        <Typography variant={"h6"} color={"common.white"}>
                            Create a card
                        </Typography>
                    </Button>
                </Box>
                <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={"64px"}>
                    <Box display={"flex"} flex={"0 1 300px"} flexDirection={"column"} gap={"16px"} alignItems={"center"} textAlign={"center"}>
                        <Box display="flex" alignItems={"center"} gap={"16px"}>
                            <ImageIcon style={{fontSize:"48px"} }/>
                            <Typography variant={"h4"}>
                                Photo
                            </Typography>
                        </Box>
                        <Typography variant={"h6"} textAlign={"center"}>
                            Upload a photo of you or your friends and have them modified for the Christmas spirit
                        </Typography>
                    </Box>
                    <Box display={"flex"} flex={"0 1 300px"} flexDirection={"column"} gap={"16px"} alignItems={"center"} textAlign={"center"}>
                        <Box display="flex" alignItems={"center"} gap={"16px"}>
                            <EditIcon style={{fontSize:"48px"} }/>
                            <Typography variant={"h4"}>
                                Poem
                            </Typography>
                        </Box>
                        <Typography variant={"h6"}>
                            Our AI will generate a unique poem for you based on some facts about the person
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </ImageBackgroundLayout>
    );
}
