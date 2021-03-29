import React, {useEffect, useState} from "react";

export const useWindowSize = (onUpdate=(dimensions)=>{}) => {
    const hasWindow = typeof window !== 'undefined';

    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : 1000;
        const height = hasWindow ? window.innerHeight : 1000;
        return {width, height};
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(()=>{
        if(!!windowDimensions && windowDimensions.width !== 1000 && windowDimensions.height !== 1000)
            onUpdate(windowDimensions);
    }, [windowDimensions]);

    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);

    return windowDimensions;
};