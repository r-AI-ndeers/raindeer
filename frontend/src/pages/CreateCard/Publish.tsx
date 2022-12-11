import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export interface PublishProps {
    sharableUrl: string;
}

export function Publish({sharableUrl}: PublishProps) {

    return (
        <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
            <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                <CheckCircleOutlineIcon style={{fontSize: "100px", color: "#00ab41"}}/>
                <Typography variant={"h4"} style={{color: "#00ab41"}}>Congratulations, your card is ready!</Typography>
            </Box>
            <Typography variant={"h5"}>Share your card with the people close to you!</Typography>
            <TextField
                id="outlined-read-only-input"
                style={{backgroundColor: "white"}}
                value={sharableUrl}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <IconButton onClick={
                            () => {
                                navigator.clipboard.writeText(sharableUrl);
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
                style={{backgroundColor: "#2E7D32"}}
            >
                Home
            </Button>
        </Box>
    )
}
