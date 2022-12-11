import mainbackground from "../assets/mainbackground.jpg";
import {Box} from "@mui/material";


export function ImageBackgroundLayout({children}: {children: React.ReactNode}) {

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            paddingY={"64px"}
            flexDirection="column"
            style={{
                backgroundImage: `url(${mainbackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            {children}
        </Box>
    )
}