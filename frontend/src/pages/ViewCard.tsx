import React from "react";
import {Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {ImageBackgroundLayout} from "../components/Layout";
import {BACKEND_URL} from "../consts";
import {ChristmasCard} from "../components/ChristmasCard";

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
            <ChristmasCard poem={viewData.poem} image={viewData.image} sender={viewData.sender} />
        </ImageBackgroundLayout>
    )
}
