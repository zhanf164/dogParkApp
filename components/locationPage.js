import {React, useState, useEffect} from 'react';
import {Button, View, SafeAreaView, Text} from 'react-native';
import * as Location from 'expo-location';





export default function LocationPage() {
    const [hasLocationAccess, setHasLocationAccess] = useState(false);
    if (!hasLocationAccess){
        console.log("Does not have location access " + hasLocationAccess)
    }
    const [currentLocation, setCurrentLocation] = useState("unknown")

    const [errorMsg, setErrorMsg] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
  
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status)
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            else{
                setHasLocationAccess(true)
                console.log("permission access has been set to true")
            }
    
        })(); 
    }, []);


    async function getCurrentLocation(hasAccess) {
        if (!hasAccess){
            return "You have not given location permissions to this app"
        }
        else{
                let location = await Location.getCurrentPositionAsync({})
                console.log(location)
                return location
            }

        }

    function getLocationButtonClicked(hasAccess){
        getCurrentLocation(hasAccess)
        .then((location) => {
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            setCurrentLocation("known")
        })
        .catch((errorReason) => {setErrorMsg(errorReason)})
    }

    return (
        <SafeAreaView>
            <Text>
                Your current location is {currentLocation}
            </Text>
            <Text>
                Lat: {latitude}
                long: {longitude}
            </Text>
            <Button
                onPress={getLocationButtonClicked} title="Get current Location"
            />

        </SafeAreaView>
    )
}
