import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  OtpVerificationScreen: { email?: string; }; // Email không bắt buộc nữa
  LoginScreen: undefined;
};

type OtpVerificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OtpVerificationScreen'
>;

type OtpVerificationRouteProp = RouteProp<RootStackParamList, 'OtpVerificationScreen'>;

type Props = {
  navigation: OtpVerificationNavigationProp;
  route: OtpVerificationRouteProp;
};

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialEmail = route.params?.email || ''; // Lấy email từ route params hoặc mặc định là rỗng
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [otpValid, setOtpValid] = useState(false);

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://192.168.155.9:8080/api/auth/verify-otp-register', {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP is valid');
        setOtpValid(true); // Đánh dấu OTP hợp lệ
        navigation.navigate('LoginScreen'); // Chuyển đến màn hình đăng nhập sau khi xác minh OTP
      }
    } catch (error: unknown) {
      setOtpValid(false); // Đánh dấu OTP không hợp lệ
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', 'Invalid OTP or email');
      } else {
        Alert.alert('Error', 'Unexpected error occurred');
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Verify OTP</Text>

      <Text>Enter Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Text>Enter OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

export default OtpVerificationScreen;
