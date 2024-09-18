export type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    HomeScreen: undefined;
    ForgotPasswordScreen: undefined;
    ResetPasswordScreen: { email: string };
    RequestOtpScreen: undefined;
    EnterOtpScreen: { email: string };
    OtpVerificationScreen: { email?: string }; // Email không bắt buộc nữa
    MainTabs: undefined;
  };
  