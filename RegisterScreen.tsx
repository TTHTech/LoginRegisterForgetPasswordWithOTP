import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import tw from 'tailwind-react-native-classnames';

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  OtpVerificationScreen: { email: string }; // Chuyển hướng đến màn hình nhập OTP với email
};

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Gửi yêu cầu đăng ký và gửi OTP
      const response = await axios.post('http://192.168.155.9:8080/api/auth/register', {
        username: username,
        email: email,
        password: password,
      });
      
      if (response.status === 200) {
        Alert.alert('Success', 'Registration successful. Please verify the OTP sent to your email.');
        // Chuyển hướng đến màn hình OtpVerificationScreen và truyền email
        navigation.navigate('OtpVerificationScreen', { email: email });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          Alert.alert('Error', 'Username or Email already exists');
        } else {
          Alert.alert('Error', 'Something went wrong');
        }
      } else {
        Alert.alert('Error', 'Unexpected error occurred');
      }
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-6 bg-gray-100`}>
      <Text style={tw`text-3xl font-bold text-center mb-6`}>Register</Text>
      
      <Text style={tw`text-lg mb-2`}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        style={tw`border border-gray-300 p-3 rounded mb-4 bg-white`}
      />

      <Text style={tw`text-lg mb-2`}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={tw`border border-gray-300 p-3 rounded mb-4 bg-white`}
      />

      <Text style={tw`text-lg mb-2`}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`border border-gray-300 p-3 rounded mb-4 bg-white`}
      />

      <Text style={tw`text-lg mb-2`}>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={tw`border border-gray-300 p-3 rounded mb-4 bg-white`}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={tw`bg-blue-500 p-3 rounded mb-4`}
      >
        <Text style={tw`text-white text-center font-bold`}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={tw`text-blue-500 text-center`}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
