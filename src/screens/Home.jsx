import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import api from '../api/api';

const GameScores = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const formatScore = (score) => {
    const formattedScore = String(score);
    const isWinning = score > 100;
    return (
      <Text style={[styles.score, { color: isWinning ? '#4CAF50' : '#FF5252' }]}>
        {formattedScore}
      </Text>
    );
  };

  const TeamLogo = ({ logoUrl, teamName }) => {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logoUrl }}
          defaultSource={require('../../assets/clev.png')} // Assurez-vous d'avoir une image par défaut
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {games.map((game, index) => (
        <View key={index} style={styles.gameCard}>
          <View style={styles.matchupInfo}>
            <View style={styles.teamSection}>
              <TeamLogo
                logoUrl={game.team_1.logo_url}
                teamName={game.team_1.name}
              />
              <Text style={styles.teamName}>{game.team_1.name}</Text>
              <Text style={styles.record}>25-14</Text>
            </View>

            <View style={styles.scoreSection}>
              {formatScore(game.team_1_score)}
              <Text style={styles.scoreLabel}>Score</Text>
              {formatScore(game.team_2_score)}
            </View>

            <View style={styles.teamSection}>
              <TeamLogo
                logoUrl={game.team_2.logo_url}
                teamName={game.team_2.name}
              />
              <Text style={styles.teamName}>{game.team_2.name}</Text>
              <Text style={styles.record}>20-16</Text>
            </View>
          </View>

          <View style={styles.quarterScores}>
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
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    marginBottom: 12,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
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
});

export default GameScores;
