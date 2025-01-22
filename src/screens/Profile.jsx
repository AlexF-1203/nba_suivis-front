import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnexion',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  const StatCard = ({ label, value }) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const MenuButton = ({ icon, label, onPress, isDestructive = false }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.menuButton}
    >
      <Ionicons
        name={icon}
        size={24}
        color={isDestructive ? '#FF4444' : '#FFFFFF'}
      />
      <Text style={[
        styles.menuButtonText,
        isDestructive && styles.destructiveText
      ]}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={isDestructive ? '#FF4444' : '#9e9e9e'}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  const testNotification = async () => {
    try {
      const response = await api.post('/test_notification');
      console.log('Test notification response:', response.data);
      Alert.alert('Succès', 'Notification de test envoyée');
    } catch (error) {
      console.error('Test notification error:', error.response?.data || error);
      Alert.alert('Erreur', "Échec de l'envoi de la notification de test");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard label="Équipes favorites" value="12" />
          <StatCard label="Joueurs suivis" value="8" />
          <StatCard label="Matchs suivis" value="24" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>PARAMÈTRES DU COMPTE</Text>

        <MenuButton
          icon="person-outline"
          label="Modifier le profil"
          onPress={() => {}}
        />
        <MenuButton
          icon="notifications-outline"
          label="Notifications"
          onPress={() => {}}
        />
        <MenuButton
          icon="lock-closed-outline"
          label="Mot de passe & sécurité"
          onPress={() => {}}
        />
        <MenuButton
          icon="color-palette-outline"
          label="Apparence"
          onPress={() => {}}
        />

        <Text style={[styles.sectionTitle, styles.supportSection]}>SUPPORT</Text>

        <MenuButton
          icon="help-circle-outline"
          label="Centre d'aide"
          onPress={() => {}}
        />
        <MenuButton
          icon="mail-outline"
          label="Contactez-nous"
          onPress={() => {}}
        />
        <MenuButton
          icon="notifications-outline"
          label="Test Notification"
          onPress={testNotification}
        />


        <MenuButton
          icon="log-out-outline"
          label="Déconnexion"
          onPress={handleLogout}
          isDestructive={true}
        />

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#2a2a2a',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#9e9e9e',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  statLabel: {
    color: '#9e9e9e',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    color: '#9e9e9e',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  supportSection: {
    marginTop: 24,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  destructiveText: {
    color: '#FF4444',
  },
  chevron: {
    marginLeft: 'auto',
  },
  version: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
});

export default ProfileScreen;
