import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, StyleSheet, useColorScheme } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DetailSection from '../Components/CourseDetailScreen/DetailSection';
import ChapterSection from '../Components/CourseDetailScreen/ChapterSection';
import { enrollCourse, getUserEnrolledCourse } from '../Services';
import { useUser } from '@clerk/clerk-expo';
import { CompleteChapterContext } from '../Context/CompleteChapterContext';

export default function CourseDetailScreen() {
  const navigate = useNavigation();
  const params = useRoute().params;
  const { isChapterComplete, setIsChapterComplete } = useContext(CompleteChapterContext);
  const [userEnrolledCourse, setUserEnrolledCourse] = useState([]);
  const { user } = useUser();
  const colorScheme = useColorScheme(); // Detect system color scheme

  useEffect(() => {
    if (user && params.course) {
      GetUserEnrolledCourse();
    }
  }, [params.course, user]);

  useEffect(() => {
    isChapterComplete && GetUserEnrolledCourse();
  }, [isChapterComplete]);

  const UserEnrollCourse = () => {
    enrollCourse(params.course.id, user.primaryEmailAddress.emailAddress)
      .then(resp => {
        if (resp) {
          ToastAndroid.show('Course Enrolled successfully!', ToastAndroid.LONG);
          GetUserEnrolledCourse();
        }
      });
  };

  const GetUserEnrolledCourse = () => {
    getUserEnrolledCourse(params.course.id, user.primaryEmailAddress.emailAddress)
      .then(resp => {
        console.log("--jh", resp.uSerEnrolledCourses);
        setUserEnrolledCourse(resp.uSerEnrolledCourses);
      });
  };

  return params.course && (
    <ScrollView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <TouchableOpacity onPress={() => navigate.goBack()}>
        <Ionicons
          name="arrow-back-circle"
          size={40}
          color={colorScheme === 'dark' ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <DetailSection
        course={params.course}
        userEnrolledCourse={userEnrolledCourse}
        enrollCourse={() => UserEnrollCourse()}
      />
      <ChapterSection
        chapterList={params.course.chapters}
        userEnrolledCourse={userEnrolledCourse}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: '#121212', // Dark background
    flex: 1,
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF', // Light background
    flex: 1,
    padding: 20,
  },
});