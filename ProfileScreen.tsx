import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import tw from 'tailwind-react-native-classnames';

const ProfileScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const getUserIdAndToken = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        setUserId(storedUserId);
        if (storedEmail) {
          setEmail(storedEmail);
        }

        if (storedUserId && token) {
          try {
            const response = await axios.get(
              `http://192.168.155.9:8080/api/auth/profile/${storedUserId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (response.status === 200) {
              const userData = response.data;
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setPhoneNumber(userData.phoneNumber);
              setAddress(userData.address);
              setDateOfBirth(userData.dateOfBirth);
            } else {
              Alert.alert('Error', 'Failed to load profile data.');
            }
          } catch (apiError) {
            console.error('API Error:', apiError);
            Alert.alert('Error', 'Failed to load profile data.');
          }
        } else {
          Alert.alert('Error', 'User ID or Token not found.');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };
    getUserIdAndToken();
  }, []);

  const handleRequestOtp = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (email && token) {
        console.log('Requesting OTP for email:', email);
        const response = await axios.post(
          `http://192.168.155.9:8080/api/auth/request-otp-email`,
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          Alert.alert('Success', 'OTP sent to your email.');
        }
      } else {
        Alert.alert('Error', 'Email not found.');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (userId && token) {
        const response = await axios.put(`http://192.168.155.9:8080/api/auth/profile/update/${userId}`, {
          firstName,
          lastName,
          phoneNumber,
          address,
          dateOfBirth,
          otp,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Profile updated successfully');
        }
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Invalid OTP or failed to update profile.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-5 bg-gray-100`}>
      <Text style={tw`text-3xl font-bold text-center mb-6 text-blue-500`}>Edit Profile</Text>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={tw`border border-gray-300 rounded p-2 bg-white`}
          placeholder="Enter your first name"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={tw`border border-gray-300 rounded p-2 bg-white`}
          placeholder="Enter your last name"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={tw`border border-gray-300 rounded p-2 bg-white`}
          placeholder="Enter your phone number"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={tw`border border-gray-300 rounded p-2 bg-white`}
          placeholder="Enter your address"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>Date of Birth</Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          style={tw`border border-gray-300 rounded p-2 bg-white`}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg mb-2`}>Enter OTP</Text>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={tw`border border-gray-300 rounded p-2 bg-white`}
          placeholder="Enter the OTP sent to your email"
        />
      </View>

      <TouchableOpacity
        style={tw`bg-blue-500 py-3 rounded-lg mb-4`}
        onPress={handleRequestOtp}
      >
        <Text style={tw`text-white text-center text-lg`}>Request OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-green-500 py-3 rounded-lg mb-4`}
        onPress={handleUpdateProfile}
      >
        <Text style={tw`text-white text-center text-lg`}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
