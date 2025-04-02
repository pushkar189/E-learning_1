import { View, Text, TouchableOpacity, ToastAndroid, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { CompleteChapterContext } from '../../Context/CompleteChapterContext';

export default function ChapterSection({ chapterList, userEnrolledCourse }) {
    const { isChapterComplete, setIsChapterComplete } = useContext(CompleteChapterContext);
    const navigation = useNavigation();

    const OnChapterPress = (chapter) => {
        if (!userEnrolledCourse?.length) {
            ToastAndroid.show('Please Enroll in the Course!', ToastAndroid.LONG);
            return;
        }

        setIsChapterComplete(false);
        navigation.navigate('chapter-content', {
            content: chapter.content,
            chapterId: chapter.id,
            userCourseRecordId: userEnrolledCourse[0]?.courseid,
            recordid: userEnrolledCourse[0]?.id,
            chap: chapterList,
            completedChapters: userEnrolledCourse[0]?.completedChapter,
        });
    };

    const checkIsChapterCompleted = (chapterId) => {
        if (!userEnrolledCourse[0]?.completedChapter?.length) return false;
        return userEnrolledCourse[0]?.completedChapter?.find(item => item.chapterId === chapterId);
    };

    return (
        chapterList && (
            <View style={styles.container}>
                <Text style={styles.heading}>Chapters</Text>
                {chapterList.map((item, index) => (
                    <TouchableOpacity 
                        key={item.id}  // ✅ Added key prop
                        style={[checkIsChapterCompleted(item.id) ? styles.CompleteChapter : styles.inCompleteChapter]}
                        onPress={() => OnChapterPress(item)}
                    >
                        <View style={styles.row}>
                            {checkIsChapterCompleted(item.id) ? (
                                <Ionicons name="checkmark-circle" size={30} color={Colors.GREEN} />
                            ) : (
                                <Text style={styles.indexText}>{index + 1}</Text>
                            )}
                            <Text style={styles.titleText}>{item.title}</Text>
                        </View>
                        {!userEnrolledCourse?.length ? (
                            <Ionicons name="lock-closed" size={25} color={Colors.GRAY} />
                        ) : (
                            <Ionicons name="play" size={25} color={checkIsChapterCompleted(item.id) ? Colors.GREEN : Colors.GRAY} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        marginTop: 20,
        borderRadius: 15,
        marginBottom: 27,
    },
    heading: {
        fontFamily: 'outfit-medium',
        fontSize: 22,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    indexText: {
        fontFamily: 'outfit-medium',
        fontSize: 27,
        color: Colors.GRAY,
    },
    titleText: {
        fontFamily: 'outfit',
        fontSize: 21,
        color: Colors.GRAY,
    },
    inCompleteChapter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        borderColor: Colors.GRAY,
    },
    CompleteChapter: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.LIGHT_GREEN,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        borderColor: Colors.GREEN,
    },
});
