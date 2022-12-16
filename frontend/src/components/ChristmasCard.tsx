import {Box, Button, Typography} from "@mui/material";
import React from "react";


interface ChristmasCardProps {
    poem: string;
    image: string | null;
    sender: string;
}

export const ChristmasCard = ({image, poem, sender}: ChristmasCardProps) => {

    return (
        <Box maxWidth={"600px"} display={"flex"} flexDirection={"column"}
             gap={"32px"}>
            {image !== null && (
                <img
                    style={{
                        height: "auto",
                        aspectRatio: "1",
                        maxWidth: "100%",
                        display: "block",
                        margin: "auto",
                        boxShadow: "0.3px 0.5px 0.7px hsl(286deg 36% 56% / 36%), 0.8px 1.6px 2px -0.8px hsl(286deg 36% 56% / 36%), 2.1px 4.1px 5.2px -1.7px hsl(286deg 36% 56% / 36%), 5px 10px 12.6px -2.5px hsl(286deg 36% 56% / 36%)",
                        borderRadius: "16px",
                        transform: "rotate(-2deg)",
                    }}
                    src={image}
                />
            )}
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
                - From {sender}
            </Typography>
            <Button
                variant={"contained"}
                style={{marginTop: "64px"}}
                href={"/"}
                size={"large"}
            >
                Create your own card with AI!
            </Button>
        </Box>
    )
}