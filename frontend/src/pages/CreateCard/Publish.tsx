import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {FRONTEND_URL} from "../../consts";
import {primaryColor} from "../../index";

export interface PublishProps {
    cardId: string;
}

export function Publish({cardId}: PublishProps) {

    const url = `${FRONTEND_URL}/card/${cardId}`

    return (
        <Box maxWidth={"800px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
            <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                <CheckCircleOutlineIcon style={{fontSize: "100px", color: primaryColor}}/>
                <Typography variant={"h4"} style={{color: primaryColor}}>Congratulations, your card is ready!</Typography>
            </Box>
            <Typography variant={"h5"}>Share your card with the person close to you!</Typography>
            <TextField
                id="outlined-read-only-input"
                style={{backgroundColor: "white"}}
                value={url}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <IconButton onClick={
                            () => {
                                navigator.clipboard.writeText(url);
                            }
                        }>
                            <ContentCopyIcon/>
                        </IconButton>
                    ),
                }}
            />
            <Button
                variant={"contained"}
                href={"/"}
                size={"large"}
            >
                Home
            </Button>
        </Box>
    )
}
