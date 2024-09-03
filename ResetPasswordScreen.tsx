import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ResetPasswordScreen: { email: string };
  LoginScreen: undefined;
};

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ResetPasswordScreen'
>;

type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPasswordScreen'>;

type Props = {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
};

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://192.168.2.82:8080/api/auth/verify-otp', null, {
        params: {
          email: route.params.email,
          otp,
          newPassword,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successfully');
        navigation.navigate('LoginScreen');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          Alert.alert('Error', 'Invalid OTP');
        } else {
          Alert.alert('Error', 'Something went wrong');
        }
      } else {
        Alert.alert('Error', 'Unexpected error occurred');
      }
    }
  };

  return (
    <View>
      <Text>OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Text>New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPasswordScreen;
