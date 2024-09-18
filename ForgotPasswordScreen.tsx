import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { email: string };
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPasswordScreen'
>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://172.172.6.227:8080/api/auth/forgot-password', null, {
        params: { email },
      });
      if (response.status === 200) {
        Alert.alert('Success', 'OTP sent to your email');
        navigation.navigate('ResetPasswordScreen', { email });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          Alert.alert('Error', 'Email not found');
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
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Send OTP" onPress={handleForgotPassword} />
    </View>
  );
};

export default ForgotPasswordScreen;
