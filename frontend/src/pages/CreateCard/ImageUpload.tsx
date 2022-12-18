import {Box, IconButton, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {useDropzone} from 'react-dropzone';
import {Replay} from "@mui/icons-material";


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

interface ImageUploadProps {
    setImage: (image: File) => void;
}

export function ImageUpload({setImage}: ImageUploadProps) {
    const [previewFile, setPreviewFile] = React.useState<File | null>(null);
    const [filePreview, setFilePreview] = React.useState<string | null>(null);

    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
        isFocused
    } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: async (acceptedFiles) => {
            let file = acceptedFiles[0]
            setFilePreview(URL.createObjectURL(file))
            // This file is just for the preview and the other image is for the actual upload
            setPreviewFile(file)
            setImage(file)
        }
    });

    const dropboxStyle = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
            <Typography variant={"h4"}><b>Upload a selfie</b></Typography>
            <Typography variant={"body1"}>We will apply special Christmas filters to
                make your image suit the Christmas spirit! It works best when you upload
                a selfie of yourself or the person who you want to gift the card
                to.
            </Typography>
            <Box>
                {previewFile === null && (
                    // @ts-ignore
                    <div {...getRootProps({className: 'dropzone'})} style={dropboxStyle}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop an image, or click to select files</p>
                    </div>
                )}
                {previewFile !== null && filePreview !== null && (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}
                         gap={"8px"}>
                        <IconButton onClick={() => {
                            setPreviewFile(null)
                            setFilePreview(null)
                        }}>
                            <Replay/>
                        </IconButton>
                        <img
                            src={filePreview}
                            style={{
                                height: "auto",
                                maxWidth: "100%",
                                display: "block",
                                margin: "auto",
                            }}
                            alt={previewFile.name}
                            loading="lazy"
                        />
                    </Box>
                )}
            </Box>
        </Box>
    )
}