import React from 'react';
import mainbackground from '../assets/mainbackground.jpg';
import {Box, CssBaseline, Typography} from "@mui/material";
import {CardStepper} from "../components/Stepper";

export function CreateCard() {
  return (
    <div>
      <CssBaseline />
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        padding={"64px"}
        flexDirection="column"
        style={{
            backgroundImage: `url(${mainbackground})`,
            backgroundSize: "cover",
        }}
      >
          <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"64px"}>
              <CardStepper activeStep={"input"} />
              <Typography variant="h1">
                  Create card
              </Typography>
          </Box>
      </Box>
    </div>
  );
}
