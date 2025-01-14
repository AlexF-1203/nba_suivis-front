import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

  // Fonction pour générer des stats aléatoires
  const getPlayerStats = (playerId) => {
    if (!playerStats[playerId]) {
      // Si les stats n'existent pas encore, on les génère et les stocke
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

  const TeamCard = ({ game }) => (
    <View style={styles.gameCard}>
      <View style={styles.matchupInfo}>
        <View style={styles.teamSection}>
          <Image
            source={{ uri: `${API_URL}${game.team_1?.logo_url}` }}
            style={styles.logo}
            resizeMode="contain"
            defaultSource={require('../../assets/clev.png')}
          />
          <Text style={styles.teamName}>{game.team_1?.name}</Text>
          <Text style={styles.record}>25-14</Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={[styles.score, { color: game.team_1_score > game.team_2_score ? '#4CAF50' : '#FF5252' }]}>
            {game.team_1_score}
          </Text>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={[styles.score, { color: game.team_2_score > game.team_1_score ? '#4CAF50' : '#FF5252' }]}>
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
          <Text style={styles.record}>20-16</Text>
        </View>
      </View>

      {/* <View style={styles.quarterScores}>
        <View style={styles.quarters}>
          {[1, 2, 3, 4].map((quarter) => (
            <View key={quarter} style={styles.quarterItem}>
              <Text style={styles.quarterNumber}>{quarter}</Text>
              <Text style={styles.quarterScore}>
                {Math.floor(Math.random() * 20) + 20}
              </Text>
            </View>
          ))}
        </View>
      </View> */}
    </View>
  );

  const PlayerCard = ({ player }) => {
    const isExpanded = expandedPlayer === player.id;
    const stats = getPlayerStats(player.id);

    return (
      <TouchableOpacity
        style={[styles.playerCard, isExpanded && styles.expandedCard]}
        onPress={() => setExpandedPlayer(isExpanded ? null : player.id)}
        activeOpacity={0.7} // Ajout pour un meilleur feedback visuel
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
    alignItems: 'center',
    flex: 1,
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
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: '#9e9e9e',
    fontSize: 12,
    marginVertical: 4,
  },
  quarterScores: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
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
  }
});

export default FavoritesScreen;
