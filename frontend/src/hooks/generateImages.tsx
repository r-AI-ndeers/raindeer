import {BACKEND_URL} from "../consts";
import {useEffect, useState} from "react";


interface GenerateImageResponse {
    results: string[];
}

export const generateImages = async (image: File | null) => {
    if (image === null) {
        return {results: []}
    }

    let data = new FormData()
    data.append('file', image)

    return fetch(`${BACKEND_URL}/generate/image`, {
        method: 'POST',
        body: data
    }).then(response => response.json()).then((data: GenerateImageResponse) => {
        return data
    }).catch((error) => {
        console.log(error)
    })
}

export function useGenerateImages(image: File | null): [string[], boolean] {
    const [imageResults, setImageResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        generateImages(image).then((data) => {
            if (data) {
                setImageResults(data.results)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }, [image])

    if (image === null) {
        return [[], false]
    }
    return [imageResults, isLoading]
}