import { View, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';

export default function ProgressBar({ contentLength, contentIndex }) {
  const arraySize = Array.from({ length: contentLength }, (_, index) => index + 1);
  const width = 100 / contentLength;

  return (
    <View style={styles.container}>
      {arraySize.map((item, index) => (
        <View
          key={index} // Added key to avoid React warnings
          style={[
            styles.progressSegment,
            {
              backgroundColor: index <= contentIndex ? Colors.GREEN : Colors.GRAY,
              width: `${width}%`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10, // Added padding to prevent overflow
    alignSelf: 'stretch', // Ensures it stretches within the parent container
  },
  progressSegment: {
    borderRadius: 10,
    height: 10,
    marginHorizontal: 2, // Adjusted margin for better spacing
    flex: 1,
  },
});