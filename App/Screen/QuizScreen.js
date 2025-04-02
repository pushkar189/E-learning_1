import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  useColorScheme
} from 'react-native';
import Colors from '../Utils/Colors';
import { submitQuizAttempt } from '../Services';
import { useUser } from '@clerk/clerk-expo';

const QuizScreen = ({ route, navigation }) => {
  const { quiz, courseId, onQuizComplete } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const { user } = useUser();
  const colorScheme = useColorScheme(); // Detect system color scheme

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    // Check if selected option is correct
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctOptionId) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score (including current question)
      const finalScore = score + (selectedOption === currentQuestion.correctOptionId ? 1 : 0);
      
      // Submit quiz attempt
      submitQuizAttempt(
        user.primaryEmailAddress.emailAddress,
        quiz.id, 
        finalScore, 
        quiz.questions.length
      ).then(() => {
        // Navigate to results screen
        navigation.navigate('QuizResultsScreen', {
          score: finalScore,
          totalQuestions: quiz.questions.length,
          quizTitle: quiz.title,
          onComplete: () => {
            if (onQuizComplete) {
              onQuizComplete(finalScore);
            }
          }
        });
      }).catch(error => {
        console.error("Error submitting quiz:", error);
        alert("Failed to submit quiz. Please try again.");
      });
    }
  };

  // Safety check if quiz data is not available
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <SafeAreaView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
        <Text style={[styles.quizTitle, { color: colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }]}>
          Quiz not available
        </Text>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.nextButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <ScrollView>
        <Text style={[styles.quizTitle, { color: colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }]}>
          {quiz.title}
        </Text>
        <Text style={[styles.progressText, { color: colorScheme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }]}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
        
        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }]}>
            {currentQuestion.questionText}
          </Text>
          
          {currentQuestion.options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                { backgroundColor: colorScheme === 'dark' ? Colors.DARK_CARD : Colors.LIGHT_PRIMARY },
                selectedOption === option.id && { backgroundColor: Colors.PRIMARY }
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Text style={[
                styles.optionText,
                { color: selectedOption === option.id ? Colors.WHITE : (colorScheme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK) }
              ]}>
                {option.optionText}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedOption ? (colorScheme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY) : Colors.GRAY }
        ]}
        onPress={handleNextQuestion}
        disabled={!selectedOption}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex < quiz.questions.length - 1 
            ? 'Next Question' 
            : 'Finish Quiz'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.DARK_BACKGROUND,
  },
  lightContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  quizTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'outfit',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginTop: 20,
    marginBottom: 80,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontFamily: 'outfit',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  nextButtonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
});

export default QuizScreen;