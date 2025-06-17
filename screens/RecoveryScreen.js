import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

export default function RecoveryScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [credentials, setCredentials] = useState(null); // { email, username, password }

  const sendOtpAndCreds = async () => {
    if (!input) return alert('Enter email or phone number');

    // Query user by email or phone
    const q = query(
      collection(db, 'users'),
      where('email', '==', input)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return alert('User not found!');
    }

    const userData = snapshot.docs[0].data();
    const email = userData.email;
    const username = userData.username;
    const password = userData.password; // Make sure this is stored in plaintext in Firestore!

    if (!password) return alert('Password not stored. Use password reset instead.');

    // Save credentials to state
    setCredentials({ email, username, password });

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(generated);

    // Send via EmailJS
    const templateParams = {
      to_email: email,
      user_otp: generated,
      message: `Here are your Kritun login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nUse the OTP below to continue:\n\nOTP: ${generated}`,
    };

    try {
      await emailjs.send(
        'service_bs8wek6',
        'template_n3uip9d', // Update if you're using a different template
        templateParams,
        'zoiCubBQiuEaaz4Hy'
      );
      alert('OTP and credentials sent to your email!');
      setOtpSent(true);
    } catch (err) {
      alert('Failed to send OTP. Try again.');
    }
  };

  const verifyAndLogin = async () => {
    if (otp !== generatedOtp) {
      return alert('Incorrect OTP!');
    }

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      alert('Logged in!');
      navigation.navigate('Home');
    } catch (err) {
      alert('Auto login failed: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Account Recovery</Text>

      <TextInput
        label="Enter your email or phone number"
        value={input}
        onChangeText={setInput}
        style={styles.input}
        theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
      />

      {otpSent && (
        <TextInput
          label="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          style={styles.input}
          theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={otpSent ? verifyAndLogin : sendOtpAndCreds}
      >
        <Text style={styles.buttonText}>{otpSent ? '✅ Verify & Login' : '📩 Send OTP'}</Text>
      </TouchableOpacity>

      <Text
        onPress={() => navigation.goBack()}
        style={styles.link}
      >
        🔙 Back to Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#6c5ce7',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#2b2b2b',
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#00f2ff',
    marginTop: 20,
    fontSize: 14,
  },
});
