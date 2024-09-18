import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import RequestOtpScreen from './RequestOtpScreen'; // Import màn hình yêu cầu OTP
import EnterOtpScreen from './EnterOtpScreen'; // Import màn hình nhập OTP cho việc khác
import OtpVerificationScreen from './OtpVerificationScreen'; // Import màn hình xác minh OTP

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: { email: string };
  RequestOtpScreen: undefined; // Màn hình yêu cầu OTP
  EnterOtpScreen: { email: string }; // Màn hình nhập OTP cho các mục đích khác
  OtpVerificationScreen: { email: string }; // Màn hình xác minh OTP sau khi đăng ký
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="RequestOtpScreen" component={RequestOtpScreen} />
        <Stack.Screen name="EnterOtpScreen" component={EnterOtpScreen} />
        <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
