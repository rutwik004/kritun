import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome Back</Title>
          <Text style={styles.subtext}>Log in to your Kritun profile</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon={() => <Icon name="email-outline" color="#ccc" size={20} />} />}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { text: '#fff', background: '#1a1a1a' }, roundness: 8 }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            left={<TextInput.Icon icon={() => <Icon name="lock-outline" color="#ccc" size={20} />} />}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { text: '#fff', background: '#1a1a1a' }, roundness: 8 }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginBtn}
            contentStyle={styles.loginBtnContent}
          >
            🔐 Sign In
          </Button>

          <Text style={styles.bottomText}>
            Don't have an account?{' '}
            <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>Sign up</Text>
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#00f2ff',
    marginBottom: 6,
  },
  subtext: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: '#007cf0',
    borderRadius: 10,
    marginTop: 4,
  },
  loginBtnContent: {
    paddingVertical: 6,
  },
  bottomText: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#00f2ff',
    fontWeight: 'bold',
  },
});
