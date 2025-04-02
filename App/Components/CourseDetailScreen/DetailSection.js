import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../../Utils/Colors';
import OptionItem from './OptionItem';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function DetailSection({ course, enrollCourse, userEnrolledCourse }) {
    if (!course) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Course details not available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: course?.banner?.url || 'https://via.placeholder.com/150' }} 
                style={styles.imageStyle} 
            />
            
            <View style={{ padding: 10 }}>
                <Text style={styles.title}>{course?.name || 'No Title'}</Text>
                
                <View>
                    <View style={styles.rowStyle}>
                        <OptionItem icon={'book-outline'} value={(course?.chapters?.length || 0) + " Chapters"} />
                        <OptionItem icon={'time-outline'} value={course?.time || 'N/A'} />
                    </View>
                    <View style={styles.rowStyle}>
                        <OptionItem icon={'person-circle-outline'} value={course?.author || 'Unknown'} />
                        <OptionItem icon={'cellular-outline'} value={course?.level || 'N/A'} />
                    </View>
                </View>
                
                <View>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{course?.description?.markdown || 'No description available.'}</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    {userEnrolledCourse?.length === 0 ? (
                        <TouchableOpacity onPress={enrollCourse} style={styles.enrollButton}>
                            <Text style={styles.buttonText}>Enroll For Free</Text>
                        </TouchableOpacity>
                    ) : null}
                    
                    <TouchableOpacity style={styles.membershipButton}>
                        <Text style={styles.buttonText}>Membership $2.99/Mon</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    imageStyle: {
        width: Dimensions.get('screen').width * 0.85,
        height: 190,
        borderRadius: 15,
    },
    title: {
        fontSize: 22,
        fontFamily: 'outfit-medium',
        marginTop: 10,
    },
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    descriptionTitle: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
    },
    descriptionText: {
        fontFamily: 'outfit',
        color: Colors.GRAY,
        lineHeight: 23,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 20,
    },
    enrollButton: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
    },
    membershipButton: {
        padding: 15,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 10,
    },
    buttonText: {
        fontFamily: 'outfit',
        color: Colors.WHITE,
        textAlign: 'center',
        fontSize: 17,
    },
});
