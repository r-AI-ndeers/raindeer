import "./snow.scss"
import {Box} from "@mui/material";
import {useWindowDimensions} from "../../hooks/useWindowDimensions";


export function SnowEffect() {
    const { width } = useWindowDimensions()

    // Adjust the number of snowflakes depending on screen size
    const numSnowflakes = Math.ceil((width / 800) * 1000);
    console.log(numSnowflakes)

    return (
        <Box style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            margin: 0,
        }}>
            {[...Array(numSnowflakes)].map((e, i) => <span className="snow" key={i}/>)}
        </Box>
    )
}