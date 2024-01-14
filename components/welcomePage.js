import {React, useState, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Button, View, SafeAreaView, Text} from 'react-native';
//import Geolocation from 'react-native-geolocation-service'; //I think this is not supported on expo, need to use expo location
import LocationPage from './locationPage';


const Stack = createNativeStackNavigator()

const WelcomeMessage = (props) => {
    return(
        <Text>Welcome to the app: {props.name}</Text>
    )
}

const WelcomePage = ({navigation}) => {
    return(
        <View>

            <WelcomeMessage name="Zach"></WelcomeMessage>
            <Button 
                onPress={() => navigation.navigate('LocationPage')} 
                title="Get Started">
            </Button>

        </View>
    )
}



const Welcome = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="WelcomePage" 
                component={WelcomePage}
            />
            <Stack.Screen 
                name="LocationPage" 
                component={LocationPage}
            />
        </Stack.Navigator>
    )
}

export default Welcome;