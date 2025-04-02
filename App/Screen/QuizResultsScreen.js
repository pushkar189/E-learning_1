import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import Colors from '../Utils/Colors';
import { getUserQuizAttempts, GetUserQuizPerformance } from '../Services';
import { useUser } from '@clerk/clerk-expo';

const QuizResultsScreen = ({ route, navigation }) => {
  const { score, totalQuestions, quizTitle, courseId } = route.params;
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPerformance, setUserPerformance] = useState(null);
  const { user } = useUser();
  const colorScheme = useColorScheme(); // Detect system color scheme
  
  const percentScore = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      fetchUserPerformance();
    }
  }, [user]);
  
  const fetchUserPerformance = async () => {
    try {
      setIsLoading(true);
      const userEmail = user.primaryEmailAddress.emailAddress;
      const performanceData = await GetUserQuizPerformance(userEmail);
      
      if (performanceData && performanceData.userDetail) {
        setUserPerformance(performanceData.userDetail);
        
        const pointsEarned = calculatePointsEarned(score, totalQuestions);
        setUserRank({
          position: estimateRankPosition(performanceData.userDetail.point),
          pointsEarned: pointsEarned
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user performance:', error);
      setIsLoading(false);
    }
  };
  
  const calculatePointsEarned = (score, total) => {
    const basePoints = 10;
    const scorePercentage = (score / total) * 100;
    let bonusPoints = 0;
    
    if (scorePercentage >= 90) bonusPoints = 15;
    else if (scorePercentage >= 80) bonusPoints = 10;
    else if (scorePercentage >= 70) bonusPoints = 5;
    
    return (score * basePoints) + bonusPoints;
  };
  
  const estimateRankPosition = (totalPoints) => {
    if (totalPoints > 500) return "Top 10%";
    if (totalPoints > 300) return "Top 25%";
    if (totalPoints > 200) return "Top 50%";
    return "Keep going!";
  };

  const getResultMessage = () => {
    if (percentScore >= 80) return "Excellent!";
    if (percentScore >= 60) return "Good job!";
    if (percentScore >= 40) return "Not bad!";
    return "Keep practicing!";
  };

  return (
    <SafeAreaView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <Text style={[styles.quizTitle, { color: colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }]}>
        {quizTitle}
      </Text>
      <Text style={[styles.resultMessage, { color: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
        {getResultMessage()}
      </Text>
      
      <View style={[
        styles.scoreContainer,
        { backgroundColor: colorScheme === 'dark' ? Colors.DARK_CARD : Colors.LIGHT_PRIMARY }
      ]}>
        <Text style={[styles.scoreLabel, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
          Your Score
        </Text>
        <Text style={[styles.scoreValue, { color: colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }]}>
          {score}/{totalQuestions}
        </Text>
        <Text style={[styles.percentageText, { color: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
          {percentScore}%
        </Text>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentScore}%` },
              percentScore >= 70 ? styles.highScore : 
              percentScore >= 40 ? styles.mediumScore : styles.lowScore
            ]} 
          />
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={[styles.loadingText, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
            Updating leaderboard...
          </Text>
        </View>
      ) : userRank ? (
        <View style={[
          styles.leaderboardPreview,
          { backgroundColor: colorScheme === 'dark' ? Colors.DARK_CARD : Colors.WHITE }
        ]}>
          <Text style={[styles.leaderboardTitle, { color: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
            Leaderboard Update
          </Text>
          
          <View style={styles.pointsEarnedContainer}>
            <Text style={[styles.pointsEarnedLabel, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
              Points Earned
            </Text>
            <Text style={[styles.pointsEarnedValue, { color: '#4CAF50' }]}>
              +{userRank.pointsEarned}
            </Text>
          </View>
          
          <View style={styles.rankContainer}>
            <Text style={[styles.rankLabel, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
              Your Standing
            </Text>
            <Text style={[styles.rankValue, { color: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
              {userRank.position}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.viewLeaderboardButton,
              { backgroundColor: colorScheme === 'dark' ? Colors.DARK_CARD : Colors.LIGHT_PRIMARY }
            ]}
            onPress={() => navigation.navigate('LeaderBoard')}
          >
            <Text style={[styles.viewLeaderboardText, { color: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
              View Full Leaderboard
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            { borderColor: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.buttonSecondaryText, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
            Go to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.DARK_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ...existing styles...
});

export default QuizResultsScreen;