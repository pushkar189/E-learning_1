import { View } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';

export default function CourseProgressBar({ totalChapter, completedChapter }) {
  // Ensure width does not exceed 100%
  const progress = Math.min(completedChapter / totalChapter, 1); // Cap progress at 1 (100%)
  const width = progress * 100 + "%";

  return (
    <View style={{
        width: '100%',
        height: 7,
        backgroundColor: Colors.GRAY,
        borderRadius: 99,
    }}>
      <View style={{
          width: width,
          height: 7,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 99,
      }}>
      </View>
    </View>
  );
}