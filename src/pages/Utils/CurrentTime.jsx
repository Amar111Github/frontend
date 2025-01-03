import React, { useEffect, useState } from 'react';

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const options = {
        weekday: "long",  // Adding the day of the week
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    const formattedTime = currentTime.toLocaleDateString(undefined, options);

    return <span className='text-uppercase' style={{ fontWeight: 'lighter', fontSize: '.9rem' }}>{formattedTime}</span>;
};

export default CurrentTime;
