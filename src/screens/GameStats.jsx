import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity  } from 'react-native';
import api from '../api/api';

const GameStats = ({ route }) => {
  const { gameId } = route.params;
  const [activeTab, setActiveTab] = useState('team1');
  const [gameData, setGameData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  useEffect(() => {
    fetchGameStats();
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      const response = await api.get(`/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  const fetchGameStats = async () => {
    try {
      const response = await api.get(`/player_games?game_id=${gameId}`);
      const playerGames = response.data;

      // Séparer les joueurs par équipe
      const team1 = playerGames.filter(pg => pg.team_id === playerGames[0].team_id);
      const team2 = playerGames.filter(pg => pg.team_id !== playerGames[0].team_id);

      setTeam1Players(team1);
      setTeam2Players(team2);
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  };

  const renderPlayerStats = (player) => (
    <View key={player.id} style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Text style={styles.playerName}>{player.id}</Text>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{player.points}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rebonds</Text>
          <Text style={styles.statValue}>{player.rebounds}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Passes</Text>
          <Text style={styles.statValue}>{player.assists}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Minutes</Text>
          <Text style={styles.statValue}>{player.minutes}</Text>
        </View>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'team1' && styles.activeTab]}
          onPress={() => setActiveTab('team1')}
        >
          <Text style={[styles.tabText, activeTab === 'team1' && styles.activeTabText]}>
            {gameData?.team_1?.name || 'Équipe 1'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'team2' && styles.activeTab]}
          onPress={() => setActiveTab('team2')}
        >
          <Text style={[styles.tabText, activeTab === 'team2' && styles.activeTabText]}>
            {gameData?.team_2?.name || 'Équipe 2'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'team1' ?
          team1Players.map(renderPlayerStats) :
          team2Players.map(renderPlayerStats)
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
  },
  tabText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  playerCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  playerHeader: {
    marginBottom: 12,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  statLabel: {
    color: '#9e9e9e',
    fontSize: 14,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default GameStats;
