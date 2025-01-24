import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

import api from '../api/api';

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const PlayerCard = ({ playerGame, playerName, isExpanded, onToggleExpand }) => {
  return (
    <TouchableOpacity
      style={[styles.playerCard, isExpanded && styles.expandedCard]}
      onPress={() => onToggleExpand(playerGame.id)}
      activeOpacity={1}
    >
      <View style={styles.playerBasicInfo}>
        <Text style={styles.playerName}>{playerName}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatItem label="Pts" value={playerGame.points} />
        <StatItem label="Reb" value={playerGame.rebounds} />
        <StatItem label="Ast" value={playerGame.assists} />
        <StatItem label="Min" value={playerGame.minutes} />
      </View>

      {isExpanded && (
        <>
          <View style={styles.separator} />

          <View style={styles.advancedStatsRow}>
            <StatItem label="Off Reb" value={playerGame.offensive_rebounds} />
            <StatItem label="Def Reb" value={playerGame.defensive_rebounds} />
            <StatItem label="Blk" value={playerGame.blocks} />
            <StatItem label="Stl" value={playerGame.steals} />
          </View>

          <View style={styles.advancedStatsRow}>
            <StatItem label="FT%" value={`${Math.round(playerGame.free_throw_percentage)}%`} />
            <StatItem label="3P%" value={`${Math.round(playerGame.three_point_percentage)}%`} />
            <StatItem label="TO" value={playerGame.turnovers} />
            <StatItem label="PF" value={playerGame.personal_fouls} />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const GameStats = ({ route }) => {
  const { gameId } = route.params;
  const [activeTab, setActiveTab] = useState('team1');
  const [gameData, setGameData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [players, setPlayers] = useState({});
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameResponse = await api.get(`/games/${gameId}`);
        setGameData(gameResponse.data);

        const statsResponse = await api.get(`/player_games?game_id=${gameId}`);
        const playerGames = statsResponse.data;

        const playersResponse = await api.get('/players');
        const playersData = playersResponse.data;
        const playersMap = {};
        playersData.forEach(player => {
          playersMap[player.id] = player.name;
        });
        setPlayers(playersMap);

        // Trier les joueurs par points
        const sortedTeam1Players = playerGames
          .filter(pg => pg.team_id === gameResponse.data.team_1.id)
          .sort((a, b) => b.points - a.points);

        const sortedTeam2Players = playerGames
          .filter(pg => pg.team_id === gameResponse.data.team_2.id)
          .sort((a, b) => b.points - a.points);

        setTeam1Players(sortedTeam1Players);
        setTeam2Players(sortedTeam2Players);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [gameId]);

  const togglePlayerExpand = (playerId) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'team1' && styles.activeTab]}
            onPress={() => setActiveTab('team1')}
          >
            <Text style={[styles.tabText, activeTab === 'team1' && styles.activeTabText]}>
              {gameData?.team_1?.city || 'Équipe 1'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'team2' && styles.activeTab]}
            onPress={() => setActiveTab('team2')}
          >
            <Text style={[styles.tabText, activeTab === 'team2' && styles.activeTabText]}>
              {gameData?.team_2?.city || 'Équipe 2'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {(activeTab === 'team1' ? team1Players : team2Players).map((playerGame) => (
            <PlayerCard
              key={playerGame.id}
              playerGame={playerGame}
              playerName={players[playerGame.player_id] || 'Joueur inconnu'}
              isExpanded={expandedPlayer === playerGame.id}
              onToggleExpand={togglePlayerExpand}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    marginTop: 48,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    marginBottom: 10,
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  playerCard: {
    backgroundColor: '#2a2a2a',
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playerBasicInfo: {
    marginBottom: 12,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 40,
  },
  advancedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#9e9e9e',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 12,
  },
  expandedCard: {
    backgroundColor: '#2a2a2a',
  }
});

export default GameStats;
