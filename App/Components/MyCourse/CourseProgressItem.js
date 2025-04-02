import { View, Text, Image, useColorScheme, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';
import { Ionicons } from '@expo/vector-icons';
import CourseProgressBar from '../HomeScreen/CourseProgressBar';

export default function CourseProgressItem({ item, completedChapter }) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
            {/* Course Image */}
            <Image 
                source={{ uri: item?.banner?.url }} 
                style={styles.image} 
            />

            {/* Course Info */}
            <View style={styles.infoContainer}>
                <Text style={[styles.title, isDarkMode ? styles.whiteText : styles.blackText]}>
                    {item.name}
                </Text>

                {/* Chapters & Time */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Ionicons name="book-outline" size={18} color={isDarkMode ? Colors.LIGHT_TEXT : Colors.DARK_TEXT} />
                        <Text style={[styles.detailText, isDarkMode ? styles.whiteText : styles.blackText]}>
                            {item?.chapters?.length} Chapters
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={18} color={isDarkMode ? Colors.LIGHT_TEXT : Colors.DARK_TEXT} />
                        <Text style={[styles.detailText, isDarkMode ? styles.whiteText : styles.blackText]}>
                            {item?.time}
                        </Text>
                    </View>
                </View>

                {/* Price */}
                <Text style={[styles.price, { color: Colors.PRIMARY }]}>
                    {item.price == 0 ? 'Free' : `$${item.price}`}
                </Text>
            </View>

            {/* Progress Bar */}
            {completedChapter !== undefined ? (
                <CourseProgressBar 
                    totalChapter={item?.chapters?.length} 
                    completedChapter={completedChapter} 
                />
            ) : null}
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginRight: 15,
        borderRadius: 15,
        elevation: 4, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    darkCard: {
        backgroundColor: Colors.DARK_BACKGROUND, // Dark Mode Card
    },
    lightCard: {
        backgroundColor: Colors.WHITE, // Light Mode Card
    },
    image: {
        width: '100%',
        height: 170,
        borderRadius: 15,
    },
    infoContainer: {
        padding: 8,
    },
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 17,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    detailText: {
        fontFamily: 'outfit',
    },
    price: {
        marginTop: 5,
        fontFamily: 'outfit-medium',
    },
    whiteText: {
        color: Colors.WHITE,
    },
    blackText: {
        color: Colors.BLACK,
    },
});

