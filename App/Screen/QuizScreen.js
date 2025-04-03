import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Colors from '../Utils/Colors';
import { submitQuizAttempt } from '../Services';
import { useUser } from '@clerk/clerk-expo';

const QuizScreen = ({ route, navigation }) => {
  const { quiz, courseId, onQuizComplete } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15); // 15 seconds per question
  const { user } = useUser();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (quiz?.questions?.length > 0) {
      // Reset timer when question changes
      setTimer(15);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctOptionId) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      const finalScore = score + (selectedOption === currentQuestion.correctOptionId ? 1 : 0);
      submitQuizAttempt(
        user.primaryEmailAddress.emailAddress,
        quiz.id, 
        finalScore, 
        quiz.questions.length
      ).then(() => {
        navigation.replace('QuizResultsScreen', {
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <SafeAreaView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
        <Text style={styles.quizTitle}>Quiz not available</Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.goBack()}>
          <Text style={styles.nextButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <ScrollView>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</Text>
        <Text style={styles.timerText}>Time left: {timer}s</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
          {currentQuestion.options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && { backgroundColor: Colors.PRIMARY }
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Text style={styles.optionText}>{option.optionText}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: selectedOption ? Colors.PRIMARY : Colors.GRAY }]}
        onPress={handleNextQuestion}
        disabled={!selectedOption}
      >
        <Text style={styles.nextButtonText}>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  darkContainer: { flex: 1, padding: 20, backgroundColor: Colors.DARK_BACKGROUND },
  lightContainer: { flex: 1, padding: 20, backgroundColor: Colors.WHITE },
  quizTitle: { fontSize: 24, fontFamily: 'outfit-bold', marginBottom: 10, textAlign: 'center' },
  progressText: { fontSize: 16, fontFamily: 'outfit', marginBottom: 10, textAlign: 'center' },
  timerText: { fontSize: 14, fontFamily: 'outfit-medium', marginBottom: 10, color: 'red', textAlign: 'center' },
  questionContainer: { marginTop: 20, marginBottom: 80 },
  questionText: { fontSize: 18, fontFamily: 'outfit-medium', marginBottom: 20 },
  optionButton: { padding: 15, borderRadius: 10, marginBottom: 10, backgroundColor: Colors.LIGHT_PRIMARY },
  optionText: { fontFamily: 'outfit' },
  nextButton: { padding: 15, borderRadius: 10, position: 'absolute', bottom: 20, left: 20, right: 20 },
  nextButtonText: { color: Colors.WHITE, textAlign: 'center', fontFamily: 'outfit-medium', fontSize: 16 },
});

export default QuizScreen;