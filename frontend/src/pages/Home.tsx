import React from 'react';
import {Box, Button, CssBaseline, Typography} from "@mui/material";
import {ImageBackgroundLayout} from "../components/Layout";

export function Home() {
  return (
    <div>
      <CssBaseline />
        <ImageBackgroundLayout>
            <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"64px"}>
                <Typography variant="h1">
                    rAIndeer
                </Typography>
                <Typography variant="h3">
                    Create personalised cards for people dear to you with AI!
                </Typography>
                <Box>
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
    </div>
  );
}
