import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Colors from '../Utils/Colors';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { GetAllProgressCourse } from '../Services';
import CourseProgressItem from '../Components/MyCourse/CourseProgressItem';
import { ThemeContext } from '../Context/ThemeContext';

export default function MyCourse() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [progressCourseList, setProgressCourseList] = useState();
  const { theme } = useContext(ThemeContext); // Get theme from context

  useEffect(() => {
    user && GetAllProgressCourseList();
  }, [user]);

  const GetAllProgressCourseList = () => {
    GetAllProgressCourse(user.primaryEmailAddress.emailAddress).then(resp => {
      setProgressCourseList(resp.uSerEnrolledCourses);
    });
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
        <Text style={[styles.headerText, theme === 'dark' ? styles.whiteText : styles.blackText]}>My Course</Text>
      </View>
      <FlatList
        data={progressCourseList}
        style={styles.courseList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.courseItem, theme === 'dark' ? styles.darkCard : styles.lightCard]}
            onPress={() =>
              navigation.navigate('course-detail', {
                course: item.course,
              })
            }
          >
            <CourseProgressItem
              item={item.course}
              completedChapter={item?.completedChapter?.length}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  lightContainer: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  header: {
    height: 160,
    padding: 30,
  },
  headerText: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
  },
  whiteText: {
    color: Colors.WHITE,
  },
  blackText: {
    color: Colors.BLACK,
  },
  courseList: {
    marginTop: -50,
  },
  courseItem: {
    margin: 8,
    padding: 5,
    borderRadius: 10,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: Colors.DARK_CARD,
  },
  lightCard: {
    backgroundColor: Colors.LIGHT_CARD,
  },
});
