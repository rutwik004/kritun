import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🎮 Welcome to Kritun</Text>
      <Text style={styles.subtext}>Your gamer identity, powered up.</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <Icon name="trophy-outline" size={22} color="#FFD700" /> Achievements
          </Title>
          <Text style={styles.cardText}>Track your in-game milestones and badges earned.</Text>
          <Button style={styles.button} mode="contained" buttonColor="#007cf0">
            View My Stats
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <Icon name="account-group-outline" size={22} color="#00f2ff" /> Connect
          </Title>
          <Text style={styles.cardText}>Build your gaming network and discover new teammates.</Text>
          <Button style={styles.button} mode="contained" buttonColor="#00c3ff">
            Discover Players
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <Icon name="controller-classic-outline" size={22} color="#8e44ad" /> Teams & Tournaments
          </Title>
          <Text style={styles.cardText}>Join a team or host your own gaming event.</Text>
          <Button style={styles.button} mode="contained" buttonColor="#8e44ad">
            Create Team
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f0f',
    padding: 20,
    alignItems: 'stretch',
  },
  header: {
    fontSize: 26,
    color: '#00f2ff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtext: {
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
    borderRadius: 16,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  cardText: {
    color: '#ccc',
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
  },
});
