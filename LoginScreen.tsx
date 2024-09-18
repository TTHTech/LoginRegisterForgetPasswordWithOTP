import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoginScreen: undefined;
  MainTabs: undefined; // Thêm MainTabs
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
        const { token, userId, email } = response.data; // Lấy email từ phản hồi
        
        // Lưu token, userId và email vào AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userEmail', email); // Lưu email

        Alert.alert('Success', 'Login successful');
        navigation.navigate('MainTabs'); // Điều hướng đến MainTabs
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
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />

      {/* Nút đăng ký */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Don't have an account? Register here</Text>
      </TouchableOpacity>

      {/* Nút quên mật khẩu */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập bằng OTP */}
      <TouchableOpacity onPress={() => navigation.navigate('RequestOtpScreen')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Login with OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
