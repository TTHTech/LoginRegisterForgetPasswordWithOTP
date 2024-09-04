import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  HomeScreen: undefined;
};

type EnterOtpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

const EnterOtpScreen: React.FC<{ navigation: EnterOtpScreenNavigationProp }> = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://172.16.2.178:8080/api/auth/login-otp', {
        email,
        otp,
        type: 'login', // Tham số phân biệt OTP đăng nhập
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful');
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Text>Enter OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

export default EnterOtpScreen;
