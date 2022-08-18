import {useRef, useEffect} from 'react';

function useInterval(callback, delay){
    const saveCallback = useRef();

    useEffect(() => {
        saveCallback.current = callback;
    });

    useEffect(() => {
            function tick(){
                saveCallback.current();
            }
            if(delay !== null){
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
    }, [delay]);

    return saveCallback.current;
}

export default useInterval;