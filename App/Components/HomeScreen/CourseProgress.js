import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import SubHeading from '../SubHeading';
import Colors from '../../Utils/Colors';
import { GetAllProgressCourse } from '../../Services';
import { useUser } from '@clerk/clerk-expo';
import CourseItem from './CourseItem';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../Context/ThemeContext';

export default function CourseProgress() {
    const { user } = useUser();
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext); // Dark mode support
    const [progressCourseList, setProgressCourseList] = useState([]);
    const [refresh, setRefresh] = useState(false); // Trigger re-render

    useEffect(() => {
        if (user) {
            GetAllProgressCourseList();
        }
    }, [user, refresh]); // Added refresh dependency to update progress

    const GetAllProgressCourseList = async () => {
        try {
            const response = await GetAllProgressCourse(user.primaryEmailAddress.emailAddress);
            console.log("Fetched Progress Data:", response);
            setProgressCourseList(response?.uSerEnrolledCourses || []);
        } catch (error) {
            console.error("Error fetching progress courses:", error);
        }
    };

    return progressCourseList.length > 0 && (
        <View>
            <SubHeading text={'In Progress'} color={theme === 'dark' ? Colors.DARK_TEXT : Colors.LIGHT_TEXT} />

            <FlatList
                data={progressCourseList}
                keyExtractor={(item, index) => index.toString()} // Ensure unique key
                horizontal
                showsHorizontalScrollIndicator={false}
                extraData={refresh} // Ensure list re-renders when progress updates
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('course-detail', { course: item.course });
                        setRefresh(!refresh); // Force re-fetch on navigation
                    }}>
                        <CourseItem item={item.course} completedChapter={item?.completedChapter?.length || 0} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
