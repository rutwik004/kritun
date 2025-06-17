import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      // Reset animation values
      slideAnim.setValue(40);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigation.replace('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.container}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
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
    </Animated.ScrollView>
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
