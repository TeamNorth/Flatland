/* Written by James Hryniw (c) */

"use strict";

import React from 'React';
import { Animated, Easing, View, Text, StyleSheet, Platform, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { BoldenTheme as theme } from '../styles/theme';

export default class BoldenButton extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.offset = new Animated.ValueXY({x: -4, y: -4}); //X and Y initial offset
    
        let buttonAnimation = () => {Animated.sequence([
                Animated.timing(this.offset, {toValue: {x: 0, y: 0}, easing: Easing.linear, duration: 50}),
                Animated.timing(this.offset, {toValue: {x: -4, y: -4}, easing: Easing.linear, duration: 50})
            ]).start();};

        this.animatedOnPress = () => {
            buttonAnimation();
            this.props.onPress();
        };      
    }
    
    render() {    
        let TouchableWrapper = ( Platform.OS == 'ios' ) ? TouchableHighlight : TouchableNativeFeedback;
        
        return (
            <View style={styles.buttonContainer}>
                <View style={styles.buttonBack}/>
                <Animated.View style={[{
                    transform: this.offset.getTranslateTransform()},
                    styles.button]}>

                    <TouchableWrapper onPress={this.animatedOnPress} delayPressIn={0}>
                        <View>
                            <Text style={styles.buttonText}>{this.props.text}</Text>
                        </View>
                    </TouchableWrapper> 

                </Animated.View>
            </View>
        );
    }
    
    /*_animateAuthentication() {
        let text = this.state.text
        if (text == 'Login')
            text = 'Authenticating';

        let dotCount = text.replace(/[^.]/g, '').length; //Gets number of .s in string

        if (dotCount < 3) {
            text = text.trim() + '.';
            while (text.length < 17) {text += ' ';} //Adds whitespace to always produce 17 character string
        }
        else
            text = 'Authenticating   ';
        
        if (this.state.authenticating) {
            this.setState({text});
            setTimeout(this._animateAuthentication, 500);
        }
        else {
            this.setState({text: 'Login'});
        }
    }*/
}

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 0,
        height: 42,
        maxHeight: 42,
        flex: 0.8,
        minWidth: 280,
        padding: 4
    },
    buttonBack: {
        position: 'absolute',
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
        height: 34,
        margin: 0,
        backgroundColor: theme.colors.onyx_black, 
    },
    button: {
        height: 34, //42-8
        backgroundColor: 'white',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderColor: theme.colors.onyx_black,
        borderWidth: 4
    },
    buttonText: {
        alignSelf: 'center',
        color: theme.colors.onyx_black,
        fontSize: 16,
        fontWeight: 'bold',
    },
});