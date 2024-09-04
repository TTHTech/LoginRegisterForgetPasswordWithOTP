import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  RequestOtpScreen: undefined;
  EnterOtpScreen: { email: string };
};

type RequestOtpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RequestOtpScreen'
>;

const RequestOtpScreen: React.FC<{ navigation: RequestOtpScreenNavigationProp }> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('http://172.16.2.178:8080/api/auth/request-otp-email', {
        email,
        type: 'login' // thêm tham số để phân biệt giữa đăng nhập và quên mật khẩu
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP sent to your email');
        navigation.navigate('EnterOtpScreen', { email });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to send OTP');
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
      <Button title="Request OTP" onPress={handleRequestOtp} />
    </View>
  );
};

export default RequestOtpScreen;
