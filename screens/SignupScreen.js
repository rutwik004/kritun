import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCred) => {
          const user = userCred.user;
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            username: user.displayName || 'Gamer',
            createdAt: new Date(),
          });
          navigation.navigate('Home');
        })
        .catch((err) => alert(err.message));
    }
  }, [response]);

  const handleSignup = async () => {
    if (!agree) {
      alert('Please accept the terms to proceed.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        username,
        createdAt: new Date(),
      });
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.titleContainer}>
        <Icon name="gamepad-variant-outline" size={36} color="#6c5ce7" />
        <Text style={styles.kritun}>Kritun</Text>
        <Text style={styles.tagline}>Join the ultimate gaming experience</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Create Your Account</Text>
          <Text style={styles.subtext}>Level up your gaming journey</Text>
        </View>

        <View style={styles.cardBody}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            left={<TextInput.Icon icon={() => <Icon name="account" color="#ccc" size={20} />} />}
            style={styles.input}
            theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon={() => <Icon name="email-outline" color="#ccc" size={20} />} />}
            style={styles.input}
            theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            left={<TextInput.Icon icon={() => <Icon name="lock-outline" color="#ccc" size={20} />} />}
            style={styles.input}
            theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
          />

          <View style={styles.checkRow}>
            <Checkbox
              status={agree ? 'checked' : 'unchecked'}
              onPress={() => setAgree(!agree)}
              color="#6c5ce7"
            />
            <Text style={styles.checkText}>
              I agree to the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Solid color "Create Account" button */}
          <TouchableOpacity style={styles.createBtn} onPress={handleSignup}>
            <Text style={styles.createBtnText}>🚀 Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.or}>──────────  or  ──────────</Text>

          <View style={styles.altBtns}>
            <Button
              icon="google"
              mode="outlined"
              textColor="#ccc"
              style={styles.altButton}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              Google
            </Button>
            <Button icon="discord" mode="outlined" textColor="#ccc" style={styles.altButton} disabled>
              Discord
            </Button>
          </View>

          <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Sign In</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// Styles remain unchanged
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkText: {
    color: '#bbb',
    fontSize: 12,
    flexShrink: 1,
  },
  link: {
    color: '#00c6ff',
    fontWeight: 'bold',
  },
  createBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  or: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  altBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  altButton: {
    flex: 1,
    borderColor: '#444',
    borderRadius: 8,
    marginHorizontal: 6,
  },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
});
