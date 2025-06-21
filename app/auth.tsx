import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("All fields must be filled");
      return;
    }

    if (password.length <= 6) {
      setError("Password must be greater than 6 charachters");
      return;
    }

    if (isSignUp) {
      const error = await signUp(email, password);

      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);

      if (error) {
        setError(error);
        return;
      }
    }

    router.replace("/");

    setError(null);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" onPress={() => handleAuth()}>
          {isSignUp ? "Sign Up" : "Sign in"}
        </Button>

        <Button mode="text" onPress={() => setIsSignUp((prev) => !prev)}>
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign in"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
