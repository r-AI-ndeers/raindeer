import {Box, Button, Typography} from "@mui/material";
import React from "react";
import {SnowEffect} from "./Snow/SnowEffect";


interface ChristmasCardProps {
    poem: string;
    image: string | null;
    sender: string;
}

export const ChristmasCard = ({image, poem, sender}: ChristmasCardProps) => {

    return (
        <Box maxWidth={"600px"} display={"flex"} flexDirection={"column"}
             gap={"32px"}>
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
            {image !== null && (
                <img
                    style={{
                        height: "auto",
                        aspectRatio: "1",
                        maxWidth: "100%",
                        display: "block",
                        margin: "auto",
                        boxShadow: "5px 5px 12px 2px rgba(0, 0, 0, 0.5)",
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
            <SnowEffect />
        </Box>
    )
}