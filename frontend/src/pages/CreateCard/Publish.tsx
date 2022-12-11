import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {FRONTEND_URL} from "../../consts";

export interface PublishProps {
    cardId: string;
}

export function Publish({cardId}: PublishProps) {

    return (
        <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
            <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                <CheckCircleOutlineIcon style={{fontSize: "100px", color: "#00ab41"}}/>
                <Typography variant={"h4"} style={{color: "#00ab41"}}>Congratulations, your card is ready!</Typography>
            </Box>
            <Typography variant={"h5"}>Share your card with the person close to you!</Typography>
            <TextField
                id="outlined-read-only-input"
                style={{backgroundColor: "white"}}
                value={`${FRONTEND_URL}/card/${cardId}`}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <IconButton onClick={
                            () => {
                                navigator.clipboard.writeText(cardId);
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
