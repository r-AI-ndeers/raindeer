import React from 'react';
import mainbackground from './assets/mainbackground.jpg';
import {Box, Button, CssBaseline, Typography} from "@mui/material";
import './App.css';

function App() {
  return (
    <div>
      <CssBaseline />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        style={{
            backgroundImage: `url(${mainbackground})`,
            backgroundSize: "cover",
        }}
      >
          <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"64px"}>
              <Typography variant="h1">
                  rAIndeer
              </Typography>
              <Typography variant="h3">
                  Create personalised cards for people dear to you with AI!
              </Typography>
              <Box>
                  <Button variant={"contained"} style={{backgroundColor: "#2E7D32"}}>Create a card</Button>
              </Box>
          </Box>
      </Box>
    </div>
  );
}

export default App;
