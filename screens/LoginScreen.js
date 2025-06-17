import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🎬 Animation setup
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      // Reset values on every focus
      slideAnim.setValue(60);
      fadeAnim.setValue(0);
  
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );
  
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth || !db) throw new Error('Firebase not initialized properly');
        console.log('Firebase auth initialized:', !!auth);
        console.log('Firebase db initialized:', !!db);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        alert('Error initializing app. Please try again.');
      }
    };
    checkAuth();
  }, []);

  const loginUser = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const q = query(collection(db, 'users'), where('username', '==', username.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert('User not found');
        return;
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigation.replace('Home');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.code === 'auth/wrong-password' ? 'Invalid password' : 'Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View
      style={[
        styles.bg,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.titleContainer}>
        <Icon name="gamepad-variant-outline" size={36} color="#6c5ce7" />
        <Text style={styles.kritun}>Kritun</Text>
        <Text style={styles.tagline}>Login to unlock your gaming arena</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Login to your Account</Text>
          <Text style={styles.subtext}>Enter username and password</Text>
        </View>

        <View style={styles.cardBody}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoComplete="username"
            disabled={isLoading}
            theme={{
              colors: {
                text: '#fff',
                primary: '#6c5ce7',
                background: '#2b2b2b',
                placeholder: '#bbb',
              },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            autoComplete="password"
            textContentType="password"
            disabled={isLoading}
            theme={{
              colors: {
                text: '#fff',
                primary: '#6c5ce7',
                background: '#2b2b2b',
                placeholder: '#bbb',
              },
            }}
          />

          <TouchableOpacity
            style={[styles.createBtn, isLoading && styles.disabledBtn]}
            onPress={loginUser}
            disabled={isLoading}
          >
            <Text style={styles.createBtnText}>
              {isLoading ? '🔄 Loading...' : '🔓 Login'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don't have an account?{' '}
            <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>Sign up</Text>
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  kritun: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
  },
  cardHeader: {
    backgroundColor: '#282c70',
    padding: 20,
    alignItems: 'center',
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
  },
  cardBody: {
    padding: 20,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#2b2b2b',
  },
  createBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledBtn: {
    backgroundColor: '#4a4a4a',
    opacity: 0.7,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
  link: {
    color: '#00f2ff',
    fontWeight: 'bold',
  },
});
