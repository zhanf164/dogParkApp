import {React, useState, useEffect} from 'react';
import {Button, View, SafeAreaView, Text} from 'react-native';
import * as Location from 'expo-location';
import DogParkPage from './dogParkPage';


class GeocodingRequest{
    constructor(lat, long){
        this.api_key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY 
        this.lat = lat
        this.long = long
    }

    get request(){
        return this.buildRequest()
    }

    buildRequest(){
        return(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                this.lat +
                ',' +
                this.long +
                '&key=' +
                this.api_key
        )    
    }

    getLocationFromLatLong(){
        return new Promise((resolve, reject) => {
            fetch(
                this.request
            )
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status === 'OK') {
                    console.log("resolving the request")
                    console.log(responseJson)
                    resolve(responseJson.results[0].formatted_address);
                } 
                else {
                    reject('not found');
                }
            })
            .catch(error => {
                reject(error);
            });
        })
    }
}


const HasLocationView = ({isError, lat, long, navigation}) => {
    [userAddress, setUserAddress] = useState("Null")
    // isError should be null if there was no error detected while getting the geolocation
    if(isError){
        return(
            <Text>{isError}</Text>
        )
    }

    // otherwise, if the location is known we should use the lat and long to get the city the user is inf and ask them if they would like to proceed with that location.
    
    else{
        if(userAddress == "Null"){
            requester = new GeocodingRequest(lat, long)
            console.log("The request is: " + requester.request)
            requester.getLocationFromLatLong()
                .then(
                    (address) => {
                        console.log(address)
                        setUserAddress(address)
                    })
                .catch((error) => console.log('there was an error fetching the address' + error))
        }
        else{
            return(
                <SafeAreaView>
                    <Text>It looks like your address is close to: </Text>
                    <Text>{userAddress}</Text>
                    <Button onPress={() => 
                        navigation.navigate(
                            'DogParkPage',
                                
                            {
                                "latitude": lat,
                                "longitude": long
                            }
                        )
                        }
                        title='Use this address to find dog parks!'></Button>
                </SafeAreaView>
            )
        }
            
    }

}
 


const LocationPage = ({navigation}) => {
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
                Put this in here for fun to see if it shows up.
            </Text>
            <Text>
                Lat: {latitude}
                long: {longitude}
            </Text>
            <Button
                onPress={getLocationButtonClicked} title="Get current Location"
            />
            {currentLocation == 'known'? <HasLocationView isError={errorMsg} lat={latitude} long={longitude} navigation={navigation}></HasLocationView>:<View></View>} 

        </SafeAreaView>
    )
}

export default LocationPage;
