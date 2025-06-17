import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Image } from 'react-native';
import { Animated } from 'react-native';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import emailjs from '@emailjs/browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userOTP, setUserOTP] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '666850243256-o3oai5muogm3b8bss4cdnl7un31h29fc.apps.googleusercontent.com',
    iosClientId: '666850243256-lqu2jdabv8706vkgd7jejdmcbpqku1b4.apps.googleusercontent.com',
    androidClientId: '666850243256-lnuqiic98qb733va357jodlt0j9atrf7.apps.googleusercontent.com',
    webClientId: '666850243256-o3oai5muogm3b8bss4cdnl7un31h29fc.apps.googleusercontent.com',
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

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOTPEmail = async () => {
    if (!email) return alert('Please enter a valid email');

    const otp = generateOTP();
    setGeneratedOTP(otp);

    try {
      await emailjs.send(
        'service_bs8wek6',
        'template_n3uip9d',
        { to_email: email, user_otp: otp },
        'zoiCubBQiuEaaz4Hy'
      );
      setOtpSent(true);
      alert('OTP sent to your email!');
    } catch (err) {
      console.error('OTP send error:', err.message);
      alert('Failed to send OTP. Please check your email.');
    }
  };

  const handleSignup = async () => {
    if (!agree) {
      alert('Please accept the terms to proceed.');
      return;
    }

    if (userOTP !== generatedOTP) {
      alert('Invalid OTP. Please try again.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        username,
        verified: true,
        createdAt: new Date(),
        gamerTag: 'ShadowFury#999',
        bio: 'Hardcore FPS lover',
        avatarUrl: 'https://yourcdn.com/avatar.jpg',
      });

      alert('Signup successful! Redirecting...');
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };
  const slideAnim = useState(new Animated.Value(20))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
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
      })
    ]).start();
  }, []);
  
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
        <Text style={styles.tagline}>Join the ultimate gaming experience</Text>
      </View>
  
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
            keyboardType="email-address"
            autoCapitalize="none"
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
  
          {otpSent && (
            <TextInput
              label="Enter OTP"
              value={userOTP}
              onChangeText={setUserOTP}
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
              theme={{ colors: { text: '#fff', background: '#2b2b2b' } }}
            />
          )}
  
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
  
          {!otpSent ? (
            <TouchableOpacity style={styles.createBtn} onPress={sendOTPEmail}>
              <Text style={styles.createBtnText}>📩 Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.createBtn} onPress={handleSignup}>
              <Text style={styles.createBtnText}>🚀 Verify & Sign Up</Text>
            </TouchableOpacity>
          )}
  
          <Text style={styles.or}>──────────  or  ──────────</Text>
  
          <View style={styles.altBtnsSingle}>
            <Text style={styles.signUpWithText}>Sign up with</Text>
  
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => promptAsync()}
              disabled={!request}
              activeOpacity={0.8}
            >
              <Image
                source={require('../assets/google-text.png')}
                style={styles.googleImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
  
          <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Sign In</Text>
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
  altBtnsSingle: {
  alignItems: 'center',
  marginTop: 12,
},

signUpWithText: {
  color: '#ccc',
  fontSize: 14,
  marginBottom: 10,
},

googleBtn: {
  backgroundColor: '#ffffff',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 24,
  alignItems: 'center',
  justifyContent: 'center',
},

googleImg: {
  width: 100,
  height: 24,
},

  
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
  },
  cardHeader: {
    backgroundColor: '#282c70',
    padding: 16, // ↓ was 20
    alignItems: 'center',
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: 18, // ↓ was 20
    fontWeight: 'bold',
  },
  subtext: {
    color: '#ccc',
    fontSize: 12, // ↓ was 13
    marginTop: 2,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  input: {
    marginBottom: 12, // ↓ was 14
    backgroundColor: '#2b2b2b',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // ↓ was 14
  },
  checkText: {
    color: '#bbb',
    fontSize: 11, // ↓ was 12
    flexShrink: 1,
  },
  createBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 10, // ↓ was 12
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14, // ↓ was 16
  },
  createBtnText: {
    color: '#fff',
    fontSize: 15, // ↓ was 16
    fontWeight: 'bold',
  },
  or: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 10, // ↓ was 12
  },
  signUpWithText: {
    color: '#ccc',
    fontSize: 13, // ↓ was 14
    marginBottom: 8,
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8, // ↓ was 10
    paddingHorizontal: 20, // ↓ was 24
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleImg: {
    width: 90, // ↓ was 100
    height: 20, // ↓ was 24
  },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 16, // ↓ was 20
    fontSize: 12.5, // ↓ was 13
  },
  link: {
    color: 'rgb(0, 242, 255)',
    fontWeight: 'bold',
  },
  
    
});
