import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import { API_URL } from '../api/api';

const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    fetchFavorites();
    // Mettre à jour les scores toutes les 30 secondes
    const interval = setInterval(fetchFavorites, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFavorites = async () => {
    try {
      // Fetch teams
      const teamsResponse = await api.get('/games');
      setFavoriteTeams(teamsResponse.data);

      // Fetch players
      const playersResponse = await api.get('/players');
      setFavoritePlayers(playersResponse.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const getPlayerStats = (playerId) => {
    if (!playerStats[playerId]) {
      const stats = {
        pts: Math.floor(Math.random() * 30),
        reb: Math.floor(Math.random() * 15),
        pd: Math.floor(Math.random() * 10),
        min: Math.floor(Math.random() * 40),
        oreb: Math.floor(Math.random() * 8),
        dreb: Math.floor(Math.random() * 10),
        blk: Math.floor(Math.random() * 5),
        stl: Math.floor(Math.random() * 5),
        ftPercentage: Math.floor(Math.random() * 100),
        tsPercentage: Math.floor(Math.random() * 100),
        seasonTrends: {
          pts: Math.random() > 0.5 ? 'up' : 'down',
          reb: Math.random() > 0.5 ? 'up' : 'down',
          pd: Math.random() > 0.5 ? 'up' : 'down',
          min: Math.random() > 0.5 ? 'up' : 'down'
        }
      };
      setPlayerStats(prev => ({
        ...prev,
        [playerId]: stats
      }));
      return stats;
    }
    return playerStats[playerId];
  };

  const StatItem = ({ label, value, trend }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {trend && (
          <Text style={[
            styles.trendIndicator,
            { color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#FF5252' : '#9e9e9e' }
          ]}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '─'}
          </Text>
        )}
      </View>
    </View>
  );

  const QuarterScores = ({ game }) => (
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
          <Text style={styles.quarterTeamName}>{game.team_1?.name}</Text>
          <Text style={styles.quarterValue}>{game.team_1_q1 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_1_q2 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_1_q3 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_1_q4 || '-'}</Text>
        </View>

        <View style={styles.quarterRow}>
          <Text style={styles.quarterTeamName}>{game.team_2?.name}</Text>
          <Text style={styles.quarterValue}>{game.team_2_q1 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_2_q2 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_2_q3 || '-'}</Text>
          <Text style={styles.quarterValue}>{game.team_2_q4 || '-'}</Text>
        </View>
      </View>
    </View>
  );

  const TeamCard = ({ game }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
            <Text style={styles.teamName}>{game.team_1?.name}</Text>
            {/* <Text style={styles.record}>{game.team_2?.wins}-{game.team_2?.losses}</Text> */}
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
            <Text style={styles.teamName}>{game.team_2?.name}</Text>
            {/* <Text style={styles.record}>{game.team_2?.wins}-{game.team_2?.losses}</Text> */}
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
                <Text style={styles.quarterTeamName}>{game.team_1?.name}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q1 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q2 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q3 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_1_q4 || '-'}</Text>
              </View>

              <View style={styles.quarterRow}>
                <Text style={styles.quarterTeamName}>{game.team_2?.name}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q1 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q2 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q3 || '-'}</Text>
                <Text style={styles.quarterValue}>{game.team_2_q4 || '-'}</Text>
              </View>
            </View>
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

  const PlayerCard = ({ player }) => {
    const isExpanded = expandedPlayer === player.id;
    const stats = getPlayerStats(player.id);

    return (
      <TouchableOpacity
        style={[styles.playerCard, isExpanded && styles.expandedCard]}
        onPress={() => setExpandedPlayer(isExpanded ? null : player.id)}
        activeOpacity={1}
      >
        <View style={styles.playerBasicInfo}>
          <Image
            source={{ uri: player.team?.logo_url }}
            style={styles.teamLogo}
            defaultSource={require('../../assets/clev.png')}
          />
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={[styles.statusText, { color: Math.random() > 0.5 ? '#4CAF50' : '#FF5252' }]}>
            {Math.random() > 0.5 ? 'Win' : 'Lose'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatItem label="Pts" value={stats.pts} />
          <StatItem label="Reb" value={stats.reb} />
          <StatItem label="PD" value={stats.pd} />
          <StatItem label="Min" value={stats.min} />
        </View>

        {isExpanded && (
          <>
            <View style={styles.advancedStatsRow}>
              <StatItem label="OReb" value={stats.oreb} />
              <StatItem label="DReb" value={stats.dreb} />
              <StatItem label="BLK" value={stats.blk} />
              <StatItem label="STL" value={stats.stl} />
              <StatItem label="FT%" value={`${stats.ftPercentage}%`} />
              <StatItem label="TS%" value={`${stats.tsPercentage}%`} />
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Stats saison</Text>
            <View style={styles.seasonStatsRow}>
              <StatItem label="Pts" value={stats.pts} trend={stats.seasonTrends.pts} />
              <StatItem label="Reb" value={stats.reb} trend={stats.seasonTrends.reb} />
              <StatItem label="PD" value={stats.pd} trend={stats.seasonTrends.pd} />
              <StatItem label="Min" value={stats.min} trend={stats.seasonTrends.min} />
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'teams' && styles.activeTab]}
          onPress={() => setActiveTab('teams')}
        >
          <Text style={[styles.tabText, activeTab === 'teams' && styles.activeTabText]}>
            Équipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'players' && styles.activeTab]}
          onPress={() => setActiveTab('players')}
        >
          <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>
            Joueur
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'teams' ? (
          favoriteTeams.map((game, index) => (
            <TeamCard key={index} game={game} />
          ))
        ) : (
          favoritePlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))
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
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  record: {
    color: '#9e9e9e',
    fontSize: 12,
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
  },
  quarterValue: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  playerCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  playerBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  advancedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 50,
    marginVertical: 4,
  },
  statLabel: {
    color: '#9e9e9e',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIndicator: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 12,
  },
  sectionTitle: {
    color: '#9e9e9e',
    fontSize: 14,
    marginBottom: 8,
  },
  seasonStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedCard: {
    backgroundColor: '#2a2a2a',
  },
  quarters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quarterItem: {
    alignItems: 'center',
  },
  quarterNumber: {
    color: '#9e9e9e',
    fontSize: 12,
    marginBottom: 4,
  },
  quarterScore: {
    color: '#ffffff',
    fontSize: 14,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
  gameCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 3,
  },
  expandedCard: {
    backgroundColor: '#2a2a2a',
  },
  quarterScores: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
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
  }
});

export default FavoritesScreen;
