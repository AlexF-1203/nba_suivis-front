import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import api, { API_URL } from '../api/api';
import { StatusBar } from 'expo-status-bar';

const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, playersRes] = await Promise.all([
        api.get('/teams'),
        api.get('/players')
      ]);

      setTeams(teamsRes.data);
      setPlayers(playersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleFavoriteTeam = async (teamId) => {
    try {
      if (favoriteTeams.includes(teamId)) {
        await api.delete(`/favorite_teams/${teamId}`);
        setFavoriteTeams(favoriteTeams.filter(id => id !== teamId));
      } else {
        await api.post('/favorite_teams', { team_id: teamId });
        setFavoriteTeams([...favoriteTeams, teamId]);
      }
    } catch (error) {
      console.error('Error toggling favorite team:', error);
    }
  };

  const toggleFavoritePlayer = async (playerId) => {
    try {
      if (favoritePlayers.includes(playerId)) {
        await api.delete(`/favorite_players/${playerId}`);
        setFavoritePlayers(favoritePlayers.filter(id => id !== playerId));
      } else {
        await api.post('/favorite_players', { player_id: playerId });
        setFavoritePlayers([...favoritePlayers, playerId]);
      }
    } catch (error) {
      console.error('Error toggling favorite player:', error);
    }
  };

  const TeamCard = ({ team }) => {
    const isFavorite = favoriteTeams.includes(team.id);

    return (
      <View style={styles.teamCard}>
        <Image
          source={{ uri: `${API_URL}${team.logo_url}` }}
          style={styles.logo}
          resizeMode="contain"
          defaultSource={require('../../assets/clev.png')}
        />
        <Text style={styles.teamName}>{team.name}</Text>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={() => toggleFavoriteTeam(team.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const PlayerCard = ({ player }) => {
    const isFavorite = favoritePlayers.includes(player.id);

    return (
      <View style={styles.playerCard}>
        <Text style={styles.playerName}>{player.name}</Text>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={() => toggleFavoritePlayer(player.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
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
            Équipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'players' && styles.activeTab]}
          onPress={() => setActiveTab('players')}
        >
          <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>
            Joueurs
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'teams' ? (
          teams.map((team) => <TeamCard key={team.id} team={team} />)
        ) : (
          players.map((player) => <PlayerCard key={player.id} player={player} />)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: StatusBar.currentHeight,
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
  teamCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    alignItems: 'center',
  },
  playerCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  favoriteButtonActive: {
    backgroundColor: '#FF5252',
  },
  favoriteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
