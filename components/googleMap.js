import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: 400,
   width: 400,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

const GoogleMap = ({props}) =>{
    const {latitude, longitude, locations} = props; //these are used for the initial state of the map
    console.log(props) 
    console.log("These are the coords" + latitude + "   " + longitude)
    locations.map((item, index) => console.log(item.location.latitude))
    locations.map((item, index) => console.log(item.location))

    return(
            <View style={styles.container}>
                <MapView  
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >

                    {locations.map((item, index) => {
                        return(
                            <Marker 
                                key={index}
                                coordinate={{latitude: item.location.latitude, longitude: item.location.longitude}}
                                title={item.displayName.text}
                                description={item.formattedAddress}
                            />
                        )
                    })}     
                    
                </MapView>

                    
            </View>
    )
}

export default GoogleMap;
