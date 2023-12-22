import { useCallback, useState } from "react";

const useOnScreen = () => {
    const [observer, setObserver] = useState();
    const [isIntersecting, setIntersecting] = useState(false);

    const measureRef = useCallback(
        (node) => {
            if (node) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        setIntersecting(entry.isIntersecting);
                    }
                );

                observer.observe(node);
                setObserver(observer);
            }
        },
        []
    );

    return { measureRef, isIntersecting, observer };
};

export default useOnScreen;
