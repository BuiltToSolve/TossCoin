import * as Haptics from 'expo-haptics';
import { DeviceMotion } from 'expo-sensors';
import React, { useEffect, useState, useRef } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export default function HomeScreen() {
    const [result, setResult] = useState('HEADS');
    const [isFlipping, setIsFlipping] = useState(false);
    const rotation = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [pitch, setPitch] = useState(0);
    const pitchRef = useRef(0);
    const [isManualControl, setIsManualControl] = useState(false);

    useEffect(() => {
        // 1. Set how often you want updates (in ms)
        DeviceMotion.setUpdateInterval(100);

        // 2. Subscribe to motion changes
        const subscription = DeviceMotion.addListener((data) => {
            if (data.rotation) {
                // beta is rotation around X-axis in radians
                // Convert to degrees: radians * (180 / Math.PI)
                const pitchInDegrees = data.rotation.beta * (180 / Math.PI);
                setPitch(pitchInDegrees);
                pitchRef.current = pitchInDegrees;
            }
        });

        return () => subscription.remove();
    }, []);

    const flipCoin = () => {
        if (isFlipping) return;

        setIsFlipping(true);

        const upDuration = 1200;
        const downDuration = 1200;
        const totalDuration = upDuration + downDuration;

        // Toss up and down
        translateY.value = withTiming(-300, { duration: upDuration }, () => {
            translateY.value = withTiming(0, { duration: downDuration });
        });

        // Start initial spin
        const currentPos = rotation.value;
        rotation.value = withTiming(currentPos + 3600, { duration: totalDuration });

        // Decide the result at the apex of the toss so user can choose while in air
        setTimeout(() => {
            const isHeads = isManualControl
                ? parseFloat(pitchRef.current.toFixed(2)) > 0
                : Math.random() < 0.5;

            // Calculate target value based on current mid-air rotation
            const midPos = rotation.value;
            let targetValue = midPos + 720; 
            const remainder = targetValue % 360;

            if (isHeads) {
                targetValue = targetValue - remainder; // Align to 0/360
            } else {
                targetValue = targetValue - remainder + 180; // Align to 180
            }

            // Override spin animation to land on the chosen side
            rotation.value = withTiming(targetValue, { duration: downDuration }, () => {
                scheduleOnRN(setIsFlipping, false);
                scheduleOnRN(setResult, isHeads ? 'HEADS' : 'TAILS');
            });
        }, upDuration);
    };

    const toggleManualControl = () => {
        setIsManualControl((prev) => !prev);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const panGesture = Gesture.Pan().onEnd((event) => {
        if (event.velocityY < -500) scheduleOnRN(flipCoin);
    });

    const longPressGesture = Gesture.LongPress()
        .minDuration(800)
        .onStart(() => {
            runOnJS(toggleManualControl)();
        });

    // Exclusive: if it's a long press, don't pan? Or Race? 
    // Usually Simultaneous is okay if one is vertical pan and other is static long press, 
    // but Race makes sense to prevent tossing if holding too long.
    const gestures = Gesture.Race(panGesture, longPressGesture);

    // Swipe Back to Exit Gesture
    const startX = useSharedValue(0);
    const exitGesture = Gesture.Pan()
        .onStart((e) => {
            startX.value = e.absoluteX;
        })
        .onEnd((e) => {
            if (startX.value < 50 && e.translationX > 100 && e.velocityX > 500) {
                setIsManualControl(false);
                runOnJS(BackHandler.exitApp)();
            }
        });

    const frontStyle = useAnimatedStyle(() => {
        const rot = rotation.value % 360;
        return {
            transform: [{ rotateX: `${rotation.value}deg` }],
            opacity: rot > 90 && rot < 270 ? 0 : 1,
        };
    });

    const backStyle = useAnimatedStyle(() => {
        const rot = rotation.value % 360;
        return {
            // Offset by 180 so it faces the user when rotation is at 180
            transform: [{ rotateX: `${rotation.value + 180}deg` }],
            opacity: rot > 90 && rot < 270 ? 1 : 0,
        };
    });

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={exitGesture}>
                <Animated.View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.ui}>
                        <Text style={styles.label}>{isFlipping ? 'FLIPPING...' : 'SWIPE UP TO TOSS'}</Text>
                        <Text style={styles.resultText}>{!isFlipping && result}</Text>
                    </View>

                    {/* GestureDetector has exactly ONE child: Animated.View */}
                    <GestureDetector gesture={gestures}>
                        <Animated.View style={[styles.coinWrapper, containerStyle]}>
                            <View style={styles.coinSize}>
                                <Animated.View style={[styles.face, styles.heads, frontStyle]}>
                                    <View style={styles.innerCircle}><Text style={styles.symbol}>H</Text></View>
                                </Animated.View>

                                <Animated.View style={[styles.face, styles.tails, backStyle]}>
                                    <View style={styles.innerCircle}><Text style={styles.symbol}>T</Text></View>
                                </Animated.View>
                            </View>
                        </Animated.View>
                    </GestureDetector>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
    ui: { position: 'absolute', top: 80, alignItems: 'center' },
    label: { color: '#888', letterSpacing: 2, fontSize: 14, fontWeight: '600' },
    resultText: { color: '#fff', fontSize: 52, fontWeight: '900', marginTop: 10 },
    coinWrapper: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' }, coinSize: { width: 200, height: 200 }, // Fixed container for faces
    face: {
        width: 200, height: 200, borderRadius: 100, position: 'absolute',
        alignItems: 'center', justifyContent: 'center', borderWidth: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8, shadowRadius: 15, elevation: 10,
        backfaceVisibility: 'hidden',
    },
    heads: { backgroundColor: '#FFD700', borderColor: '#B8860B' },
    tails: { backgroundColor: '#FFD700', borderColor: '#B8860B' },
    innerCircle: {
        width: 160, height: 160, borderRadius: 80, borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center',
    },
    symbol: { fontSize: 80, fontWeight: 'bold', color: 'rgba(0,0,0,0.4)' },
});

