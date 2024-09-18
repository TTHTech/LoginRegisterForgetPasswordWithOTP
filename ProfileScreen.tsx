import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Lấy userId, token và email từ AsyncStorage khi màn hình được load
  useEffect(() => {
    const getUserIdAndToken = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        const storedEmail = await AsyncStorage.getItem('userEmail'); // Lấy email từ AsyncStorage
        setUserId(storedUserId);
        if (storedEmail) {
          setEmail(storedEmail); // Lưu email để dùng cho OTP
        }

        // Gọi API để lấy thông tin người dùng
        if (storedUserId && token) {
          try {
            const response = await axios.get(
              `http://192.168.155.9:8080/api/auth/profile/${storedUserId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}` // Gửi token trong header
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
            console.error('API Error:', apiError); // Debug log lỗi API
            Alert.alert('Error', 'Failed to load profile data.');
          }
        } else {
          Alert.alert('Error', 'User ID or Token not found.');
        }
      } catch (error) {
        console.error('Error loading profile:', error); // Debug log lỗi
        Alert.alert('Error', 'Failed to load profile data.');
      }
    };
    getUserIdAndToken();
  }, []);

  // Gửi yêu cầu OTP
  const handleRequestOtp = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Lấy token từ AsyncStorage
      if (email && token) {
        console.log('Requesting OTP for email:', email); // Debug log
        const response = await axios.post(
          `http://192.168.155.9:8080/api/auth/request-otp-email`,
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}` // Gửi token trong header
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
      console.error('OTP request error:', error); // Debug log
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  // Hàm cập nhật thông tin người dùng sau khi nhập OTP
  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Lấy token từ AsyncStorage
      if (userId && token) {
        const response = await axios.put(`http://192.168.155.9:8080/api/auth/profile/update/${userId}`, {
          firstName,
          lastName,
          phoneNumber,
          address,
          dateOfBirth,
          otp, // Gửi OTP để xác minh
        }, {
          headers: {
            Authorization: `Bearer ${token}` // Gửi token trong header
          }
        });

        if (response.status === 200) {
          Alert.alert('Success', 'Profile updated successfully');
        }
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    } catch (error) {
      console.error('Profile update error:', error); // Debug log
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Invalid OTP or failed to update profile.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text>Phone Number</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <Text>Date of Birth</Text>
      <TextInput
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text>Enter OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Button title="Request OTP" onPress={handleRequestOtp} />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});

export default ProfileScreen;
