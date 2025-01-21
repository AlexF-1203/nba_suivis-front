import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { API_URL } from '../api/api';
import { format, parseISO, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const HomeScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [games, setGames] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchAvailableDates();
  }, [currentDate]);

  const fetchGames = async () => {
    try {
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const response = await api.get('/games', {
        params: { date: formattedDate }
      });
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const response = await api.get('/games/available_dates');
      setAvailableDates(response.data.dates.map(date => parseISO(date)));
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const goToNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    setCurrentDate(nextDay);
  };

  const goToPreviousDay = () => {
    const previousDay = addDays(currentDate, -1);
    setCurrentDate(previousDay);
  };

  const DateNavigator = () => (
    <View style={styles.dateNavigator}>
      <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {format(currentDate, 'EEEE d MMMM', { locale: fr })}
        </Text>
        {isSameDay(currentDate, new Date()) && (
          <Text style={styles.todayIndicator}>Aujourd'hui</Text>
        )}
      </View>

      <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const TeamCard = ({ game }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const goToGameStats = () => navigation.navigate("GameStats", {gameId: game.id});

    return (
      <TouchableOpacity
        style={[styles.gameCard, isExpanded && styles.expandedCard]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.9}
      >
        <View style={styles.matchupInfo}>
          <View style={styles.teamSection}>
            <Image
              source={{ uri: `${API_URL}${game.team_1?.logo_url}` }}
              style={styles.logo}
              resizeMode="contain"
              defaultSource={require('../../assets/clev.png')}
            />
            <Text style={styles.teamName}>{game.team_1?.city}</Text>
          </View>

          <View style={styles.scoreSection}>
            <Text style={[styles.score_1, { color: game.team_1_score > game.team_2_score ? '#4CAF50' : '#FF5252' }]}>
              {game.team_1_score}
            </Text>
            <Text style={styles.scoreLabel}>VS</Text>
            <Text style={[styles.score_2, { color: game.team_2_score > game.team_1_score ? '#4CAF50' : '#FF5252' }]}>
              {game.team_2_score}
            </Text>
          </View>

          <View style={styles.teamSection}>
            <Image
              source={{ uri: `${API_URL}${game.team_2?.logo_url}` }}
              style={styles.logo}
              resizeMode="contain"
              defaultSource={require('../../assets/clev.png')}
            />
            <Text style={styles.teamName}>{game.team_2?.city}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.quarterScores}>
            <Text style={styles.quartersTitle}>Score par quart-temps</Text>
            <View style={styles.quartersGrid}>
              <View style={styles.quartersHeader}>
                <Text style={styles.quarterLabel}>Équipe</Text>
                <Text style={styles.quarterLabel}>Q1</Text>
                <Text style={styles.quarterLabel}>Q2</Text>
                <Text style={styles.quarterLabel}>Q3</Text>
                <Text style={styles.quarterLabel}>Q4</Text>
              </View>

              <View style={styles.quarterRow}>
                <Text style={styles.quarterTeamName}>{game.team_1?.city}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q1 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q2 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q3 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q4 || '-'}</Text>
              </View>

              <View style={styles.quarterRow}>
                <Text style={styles.quarterTeamName}>{game.team_2?.city}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q1 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q2 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q3 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q4 || '-'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.statsButton}
              onPress={goToGameStats}
            >
              <Text style={styles.statsButtonText}>Game Stats</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.expandIndicator}>
          <Text style={styles.expandText}>
            {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#9e9e9e"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <DateNavigator />
      <ScrollView style={styles.content}>
        {games.length > 0 ? (
          games.map((game, index) => (
            <TeamCard key={index} game={game} />
          ))
        ) : (
          <View style={styles.noGamesContainer}>
            <Text style={styles.noGamesText}>Aucun match ce jour</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  dateNavButton: {
    padding: 8,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  todayIndicator: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  noGamesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noGamesText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 3,
  },
  matchupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  score_1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  score_2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#9e9e9e',
    fontSize: 12,
    marginVertical: 4,
  },
  quarterScores: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  quartersTitle: {
    color: '#9e9e9e',
    fontSize: 14,
    marginBottom: 8,
  },
  quartersGrid: {
    backgroundColor: '#222222',
    borderRadius: 8,
    padding: 12,
  },
  quartersHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    paddingBottom: 8,
  },
  quarterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  quarterLabel: {
    flex: 1,
    color: '#9e9e9e',
    fontSize: 12,
    textAlign: 'center',
  },
  quarterTeamName: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingLeft: 8,
  },
  quarterValue: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  expandIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    marginTop: 12,
  },
  expandText: {
    color: '#9e9e9e',
    fontSize: 14,
    marginRight: 8,
  },
  statsButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  statsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
