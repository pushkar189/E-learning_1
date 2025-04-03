import { View, Animated, useColorScheme } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Colors from '../../Utils/Colors';

export default function CourseProgressBar({ totalChapter, completedChapter }) {
  const progress = Math.min(completedChapter / totalChapter, 1); // Cap at 100%
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme(); // Detects dark mode

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress * 100,
      duration: 500, // Smooth transition
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={{
        width: '100%',
        height: 10,
        backgroundColor: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.LIGHT_GRAY,
        borderRadius: 99,
        overflow: 'hidden', // Ensures rounded edges
      }}
    >
      <Animated.View
        style={{
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          height: '100%',
          backgroundColor: Colors.PRIMARY,
          borderRadius: 99,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      />
    </View>
  );
}
