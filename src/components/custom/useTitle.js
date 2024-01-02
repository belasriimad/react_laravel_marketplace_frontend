import { useEffect } from "react";


export default function useTitle(title) {
    
    useEffect(() => {
        document.title = `React & Laravel Files Marketplace Stock Images - ${title}`
    }, [title])

    return null
}