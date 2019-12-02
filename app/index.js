import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

import Svg, { Image, Circle, ClipPath } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const { Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing,
    clockRunning, interpolate, Extrapolate, concat } = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 600,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

export default class MusicApp extends React.Component {
    constructor() {
        super();
        this.buttonOpacity = new Value(1)

        this.onStateChange = event([
            {
                nativeEvent: ({ state }) => block([cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))])
            }
        ])
        this.onCloseState = event([
            {
                nativeEvent: ({ state }) => block([cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))])
            }
        ])
        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });
        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3 - 50, 0],
            extrapolate: Extrapolate.CLAMP
        });
        this.textInputZIndex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });
        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });
        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });
        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <Animated.View style={{ ...StyleSheet.absoluteFill, transform: [{ translateY: this.bgY }] }}>
                    <Svg height={height + 50} width={width}>
                        <ClipPath id="clip">
                            <Circle r={height + 50} cx={width / 2} />
                        </ClipPath>
                        <Image
                            href={require('../assets/images/manas.jpeg')}
                            height={height + 50} width={width}
                            preserveAspectRatio='xMidYMid slice'
                            clipPath="url(#clip)"
                        />
                    </Svg>
                </Animated.View>
                <View style={{ height: height / 3, justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View style={{ ...styles.button, opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View style={{ ...styles.button, backgroundColor: '#2E71DC', opacity: this.buttonOpacity, transform: [{ translateY: this.buttonY }] }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>SIGN IN WITH FACEBOOK</Text>
                    </Animated.View>
                    <Animated.View style={{ height: height / 3, ...StyleSheet.absoluteFill, top: null, justifyContent: 'center', zIndex: this.textInputZIndex, opacity: this.textInputOpacity, transform: [{ translateY: this.textInputY }] }}>
                        <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                            <Animated.View style={styles.closeButton}>
                                <Animated.Text style={{ fontSize: 15, transform: [{ rotate: concat(this.rotateCross, 'deg') }] }}>
                                    X
                                </Animated.Text>
                            </Animated.View>
                        </TapGestureHandler>

                        <TextInput
                            placeholder="EMAIL"
                            style={styles.textInput}
                            placeholderTextColor='#000'
                        />
                        <TextInput
                            placeholder="PASSWORD"
                            style={styles.textInput}
                            placeholderTextColor='#000'
                        />
                        <Animated.View style={styles.button}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                SIGN IN
                            </Text>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end'
    },
    button: {
        backgroundColor: '#fff',
        height: 70,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#000',
        shadowOpacity: 0.2
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        top: -20,
        position: 'absolute',
        left: width / 2 - 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: '#000',
        shadowOpacity: 0.2
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
    },

});
