import { useState, useEffect } from 'react';

export const useGeolocation = (onSuccess) => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        if (userLocation) {
            console.log('User location set:', userLocation);
        }
    }, [userLocation]);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Location found:', { latitude, longitude });

                setUserLocation({ latitude, longitude });
                setIsLocating(false);

                if (onSuccess) {
                    onSuccess({ latitude, longitude });
                }
            },
            (err) => {
                let errorMessage = 'Unable to retrieve your location.';
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while retrieving your location.';
                        break;
                }
                setLocationError(errorMessage);
                setIsLocating(false);
                console.error('Geolocation error:', err);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };

    const clearLocationError = () => setLocationError(null);

    return { 
        userLocation, 
        locationError, 
        isLocating, 
        handleGetLocation, 
        clearLocationError 
    };
};
