import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { getCourseList } from '../../Services';
import SubHeading from '../SubHeading';
import Colors from '../../Utils/Colors';
import CourseItem from './CourseItem';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../Context/ThemeContext';

export default function CourseList({ level }) {
    const [courseList, setCourseList] = useState([]);
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext); // Dark mode support

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            const response = await getCourseList(level);
            setCourseList(response?.courses || []);
        } catch (error) {
            console.error("Error fetching course list:", error);
        }
    };

    return (
        <View style={{ marginTop: 10 }}>
            <SubHeading 
                text={`${level} Courses`} 
                color={theme === 'dark' ? Colors.DARK_TEXT : Colors.LIGHT_TEXT} 
            />
            <FlatList
                data={courseList}
                keyExtractor={(item) => item.id.toString()} // Added keyExtractor
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('course-detail', { course: item })}>
                        <CourseItem item={item} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
