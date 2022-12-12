import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {ImageBackgroundLayout} from "../components/Layout";
import {BACKEND_URL} from "../consts";

interface ViewData {
    poem: string;
    sender: string;
    image: string | null;
}

async function fetchDataForId(id: string) {
    return fetch(`${BACKEND_URL}/cards/${id}`).then(res => res.json()).then((data) => {
        return data;
    })
}

export function ViewCard() {
    // Expect the id to be passed down in the url
    let {id} = useParams();
    const [viewData, setViewData] = React.useState<ViewData | undefined>(undefined);

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataForId(id ?? "");
            setViewData({
                poem: data.poem,
                sender: data.sender,
                image: data.image || null,
            });
        }
        fetchData()
    }, [id]);


    if (viewData === undefined) {
        return (
            <ImageBackgroundLayout>
                <Typography>Loading...</Typography>
            </ImageBackgroundLayout>
        );
    }

    return (
        <ImageBackgroundLayout>
            <Box maxWidth={"600px"} display={"flex"} flexDirection={"column"}
                 gap={"32px"}>
                {viewData.image !== null && (
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
                        src={viewData.image}
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
                    {viewData.poem}
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
                    - From {viewData.sender}
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
        </ImageBackgroundLayout>
    )
}
