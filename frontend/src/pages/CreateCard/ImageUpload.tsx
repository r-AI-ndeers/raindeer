import {Box, Button, IconButton, Typography} from "@mui/material";
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

}

export function ImageUpload({}: ImageUploadProps) {
    const [file, setFile] = React.useState<File | null>(null);
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
        onDrop: acceptedFiles => {
            let file = acceptedFiles[0]
            setFilePreview(URL.createObjectURL(file))
            setFile(file)
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
            <Typography variant={"h4"}>Upload an image</Typography>
            <Typography variant={"body2"}>We will apply special Christmas filters to
                make your image suit the Christmas spirit! It works best when you upload
                a selfie of yourself or the person who you want to gift the card
                to.</Typography>
            <Box>
                {file === null && (
                    // @ts-ignore
                    <div {...getRootProps({className: 'dropzone'})} style={dropboxStyle}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some an image, or click to select files</p>
                    </div>
                )}
                {file !== null && filePreview !== null && (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={"8px"}>
                        <IconButton  onClick={() => {
                            setFile(null)
                            setFilePreview(null)
                        }}>
                            <Replay />
                        </IconButton>
                        <img
                            src={filePreview}
                            style={{
                                width: '400px',
                                height: '400px',
                                objectFit: "cover",
                            }}
                            alt={file.name}
                            loading="lazy"
                        />
                    </Box>
                )}
            </Box>
        </Box>
    )
}