import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { GetAllUsers } from '../Services';
import Colors from '../Utils/Colors';
import Gold from './../../assets/images/gold-medal.png';
import Silver from './../../assets/images/silver-medal.png';
import Bronze from './../../assets/images/bronze-medal.png';
import { ThemeContext } from '../Context/ThemeContext';

export default function LeaderBoard() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' or 'quizzes'
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const resp = await GetAllUsers();
      if (resp && resp.userDetails) {
        setUserList(resp.userDetails);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
    setIsLoading(false);
  };

  const renderMedal = (index) => {
    if (index < 3) {
      return (
        <Image 
          source={index === 0 ? Gold : index === 1 ? Silver : Bronze}
          style={{ width: 40, height: 40 }}
        />
      );
    }
    return null;
  };

  const defaultProfileImage = 'https://via.placeholder.com/60';

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? Colors.DARK_PRIMARY : Colors.PRIMARY }]}>
        <Text style={[styles.headerText, { color: Colors.WHITE }]}>LeaderBoard</Text>

        <View style={[styles.tabContainer, { backgroundColor: theme === 'dark' ? Colors.DARK_CARD : Colors.LIGHT_PRIMARY }]}>
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: activeTab === 'overall' ? Colors.WHITE : 'transparent' }]}
            onPress={() => setActiveTab('overall')}>
            <Text style={{ color: activeTab === 'overall' ? Colors.PRIMARY : Colors.WHITE }}>Overall Points</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: activeTab === 'quizzes' ? Colors.WHITE : 'transparent' }]}
            onPress={() => setActiveTab('quizzes')}>
            <Text style={{ color: activeTab === 'quizzes' ? Colors.PRIMARY : Colors.WHITE }}>Quiz Champions</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: -40, flex: 1 }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme === 'dark' ? Colors.DARK_TEXT : Colors.GRAY }}>Loading leaderboard...</Text>
          </View>
        ) : (
          <FlatList
            data={userList}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={[styles.listItem, { backgroundColor: theme === 'dark' ? Colors.DARK_CARD : Colors.WHITE }]}>
                <View style={styles.listItemContent}>
                  <View style={[styles.rankCircle, { backgroundColor: theme === 'dark' ? Colors.DARK_PRIMARY : Colors.LIGHT_PRIMARY }]}>
                    <Text style={{ color: Colors.PRIMARY }}>{index + 1}</Text>
                  </View>
                  <Image source={{ uri: item.profileImage || defaultProfileImage }} style={styles.profileImage} />
                  <View>
                    <Text style={{ color: theme === 'dark' ? Colors.DARK_TEXT : Colors.BLACK }}>{item.userName}</Text>
                    <Text style={{ color: theme === 'dark' ? Colors.DARK_GRAY : Colors.GRAY }}>{item.point} Points</Text>
                  </View>
                </View>
                {renderMedal(index)}
              </View>
            )}
          />
        )}
      </View>
    </View>
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
  header: {
    height: 160,
    padding: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 15,
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    margin: 8,
    borderRadius: 15,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
});
