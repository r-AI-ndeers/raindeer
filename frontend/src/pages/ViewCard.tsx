import React from "react";
import {Box, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {ImageBackgroundLayout} from "../components/Layout";

interface ViewData {
    poem: string;
    from: string;
    image: string | null;
}

async function fetchDataForId(id: string) {
    return {
        poem: "This is a poem",
        from: "Maksym",
        image: null,
    }

    // return fetch(`${BACKEND_URL}/card/${id}`).then(res => res.json());
}

export function ViewCard() {
    // Expect the id to be passed down in the url
    let { id } = useParams();
    const [viewData, setViewData] = React.useState<ViewData | undefined>(undefined);

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataForId(id ?? "");
            setViewData(data);
        }
        fetchData()
    }, [id]);


    // FIXME: nicer loading state
    if (viewData === undefined) {
        return (
            <Typography>Loading...</Typography>
        );
    }

    return (
        <ImageBackgroundLayout>
            <Box width={"600px"} display={"flex"} flexDirection={"column"} gap={"32px"}>
                {viewData.image !== null && (
                    <img
                        style={{
                            width: "512",
                            height: "512",
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
                    - From {viewData.from}
                </Typography>
            </Box>
        </ImageBackgroundLayout>
    )
}
