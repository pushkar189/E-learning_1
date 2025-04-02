import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect } from 'react';
import Header from '../Components/HomeScreen/Header';
import Colors from '../Utils/Colors';
import CourseList from '../Components/HomeScreen/CourseList';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { createNewUser, getUserDetail } from '../Services';
import { UserPointsContext } from '../Context/UserPointsContext';
import CourseProgress from '../Components/HomeScreen/CourseProgress';
import { ThemeContext } from '../Context/ThemeContext'; // Import ThemeContext

export default function HomeScreen() {
  const { isLoaded, signOut } = useAuth();
  const { user } = useUser();
  const { userPoints, setUserPoints } = useContext(UserPointsContext);
  const { theme } = useContext(ThemeContext); // Use theme from context

  useEffect(() => {
    user && createUser();
  }, [user]);

  const createUser = () => {
    if (user) {
      createNewUser(user.fullName, user.primaryEmailAddress.emailAddress, user.imageUrl)
        .then(resp => {
          if (resp) GetUser();
        });
    }
  };

  const GetUser = () => {
    getUserDetail(user.primaryEmailAddress.emailAddress).then(resp => {
      console.log("--", resp.userDetail?.point);
      setUserPoints(resp.userDetail?.point);
    });
  };

  return (
    <ScrollView style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: theme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY },
        ]}
      >
        <Header userPoints={userPoints} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.courseProgressContainer}>
          <CourseProgress theme={theme} />
          <CourseList level={'basic'} theme={theme} />
        </View>
        <CourseList level={'advance'} theme={theme} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: Colors.DARK_BACKGROUND,
    flex: 1,
  },
  lightContainer: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    flex: 1,
  },
  headerContainer: {
    height: 250,
    padding: 20,
  },
  contentContainer: {
    paddingLeft: 20,
    paddingTop: 20,
  },
  courseProgressContainer: {
    marginTop: -90,
  },
});
