import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';

type RootStackParamList = {
  LoginScreen: undefined;
  MainTabs: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  RequestOtpScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'LoginScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.155.9:8080/api/auth/login', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { token, userId, email } = response.data;

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userEmail', email);

        Alert.alert('Success', 'Login successful');
        navigation.navigate('MainTabs');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          Alert.alert('Error', 'Invalid username or password');
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
      <Text style={tw`text-3xl font-bold text-center mb-6`}>Login</Text>
      <Text style={tw`text-lg mb-2`}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
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
      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-blue-500 p-3 rounded mb-4`}
      >
        <Text style={tw`text-white text-center font-bold`}>Login</Text>
      </TouchableOpacity>

      {/* Nút đăng ký */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={tw`text-blue-500 text-center mb-4`}>Don't have an account? Register here</Text>
      </TouchableOpacity>

      {/* Nút quên mật khẩu */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={tw`text-blue-500 text-center mb-4`}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập bằng OTP */}
      <TouchableOpacity onPress={() => navigation.navigate('RequestOtpScreen')}>
        <Text style={tw`text-blue-500 text-center`}>Login with OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
