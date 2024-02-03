import React, {useState, useEffect} from "react";
import {SafeAreaView, View, Text, FlatList, ScrollView} from 'react-native';
import GoogleMap from "./googleMap";

class GooglePlacesRequest{
    constructor(
        lat, 
        long, 
        text_query="dog parks", 
        search_radius=4800, 
        location_type="dog_park",
        max_results=10){
            this.api_key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
            this.places_base_url = "https://places.googleapis.com/v1/places:searchText"
            this.lat = lat
            this.long = long
            this.text_query = text_query
            this.search_radius = search_radius
            this.location_type = location_type
            this.max_results = max_results
    }

    get requestBody(){
        return this.generateRequestBody()
    }

    get headers(){
        return this.generateHeaders()
    }

    generateRequestBody(){
        return JSON.stringify(
            {
            'textQuery': this.text_query,
            'locationBias': {
                "circle": {
                    "center": {"latitude": this.lat, "longitude": this.long},
                    "radius": this.search_radius
                }
            },
            "includedType": this.location_type,
            "maxResultCount": this.max_results

            }
        )
    }

    generateHeaders(){
        return new Headers({
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
            "X-Goog-Api-Key": this.api_key

        })
    }

    submitRequest(){
        console.log(this.headers)
        console.log(this.requestBody)
        return new Promise((resolve, reject) => {
            fetch(
                this.places_base_url, {
                    "method": "POST",
                    "headers": this.headers,
                    "body": this.requestBody
                }
            )
            .then((response) => {
                resolve(response.json())
                }
            )
            .catch(error => {
                reject(error);
            });
        })
    }


}


const DogParkPage = ({route, navigation}) => {
    // these won't change, so no need to make them stateful 
    const {latitude, longitude} = route.params
    console.log(latitude, longitude)

    const [foundPlaces, setFoundPlaces] = useState({"places":[]})
   
    useEffect(() => {
        requester = new GooglePlacesRequest(latitude, longitude)
        requester.submitRequest()
            .then(
                (places) => {
                    console.log(places)
                    console.log(places.places[0].location)
                    setFoundPlaces(places)
                })
            .catch((error) => console.log('there was an error fetching the places' + error)
        )
        return () => {}
    }, [])
     
    return(
        <View style={{flex: 1}}>
                <Text>
                    Default Search Radius = 3 Miles 
                </Text>
                <Text>
                    Another placeholder
                </Text>
                
                <Text>Dog Parks that were found: </Text>
                <View>
                    <GoogleMap props={{
                            "latitude": latitude,
                            "longitude": longitude,
                            "locations": foundPlaces.places
                    }} />                        
                   
                </View>

        </View>
    )
}

export default DogParkPage;
