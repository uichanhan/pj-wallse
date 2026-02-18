import { useState, useEffect } from 'react';
import { RentData, calculateAccumulatedRent } from '../utils/rentUtils';

export const useRentCounter = (rentData: RentData | null) => {
    const [accumulated, setAccumulated] = useState({
        today: 0,
        monthly: 0,
        thisMonth: 0,
        perSecond: 0,
    });

    useEffect(() => {
        if (!rentData) return;

        const update = () => {
            const result = calculateAccumulatedRent(rentData, new Date());
            setAccumulated({
                today: result.todayAccumulation,
                monthly: result.totalSinceMoveIn,
                thisMonth: result.monthlyAccumulation,
                perSecond: result.rentPerSecond,
            });
        };

        update();
        const interval = setInterval(update, 100); // Update every 100ms for smoother visual if needed, or 1000ms as per requirement

        return () => clearInterval(interval);
    }, [rentData]);

    return accumulated;
};

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.log(error);
        }
    }, [key]);

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};
