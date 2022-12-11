import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import {useEffect} from "react";

interface ImageCarouselProps {
    images: string[]
    setSelectedImage: (image: string) => void;
}

export function ImageCarousel({images, setSelectedImage}: ImageCarouselProps) {
    const theme = useTheme();
    const [currentImageNumber, setCurrentImageNumber] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setCurrentImageNumber((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setCurrentImageNumber((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setCurrentImageNumber(step);
    };

    // TODO: hacky, find a nicer way
    useEffect(() => {
        setSelectedImage(images[currentImageNumber])
    }, [currentImageNumber])

    return (
        <Box sx={{maxWidth: 400, flexGrow: 1}}>
            <SwipeableViews
                containerStyle={{
                    transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
                }}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={currentImageNumber}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((image, index) => (
                    <div key={index}>
                        {Math.abs(currentImageNumber - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    height: "auto",
                                    aspectRatio: "1",
                                    maxWidth: "100%",
                                    display: "block",
                                    margin: "auto",
                                }}
                                src={image}
                            />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={currentImageNumber}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={currentImageNumber === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft/>
                        ) : (
                            <KeyboardArrowRight/>
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack}
                            disabled={currentImageNumber === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight/>
                        ) : (
                            <KeyboardArrowLeft/>
                        )}
                        Back
                    </Button>
                }
            />
        </Box>
    );
}