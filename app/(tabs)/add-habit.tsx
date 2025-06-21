import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
    Button,
    SegmentedButtons,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

type Frequency = (typeof FREQUENCIES)[number];

function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");

  const user = useAuth();
  const router = useRouter();
  const theme = useTheme();


  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user?.user?.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      setTitle("");
      setDescription("")
      setError("")
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("There was an error while adding habit!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={"Title"}
        mode="outlined"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        label={"Description"}
        mode="outlined"
        value={description}
        onChangeText={setDescription}
      />

      <SegmentedButtons
        value={frequency}
        onValueChange={(value) => setFrequency(value as Frequency)}
        buttons={FREQUENCIES.map((freq) => ({
          value: freq,
          label: freq.charAt(0).toUpperCase() + freq.slice(1),
        }))}
        style={styles.segmentedButton}
      />

      <Button
        mode="contained"
        disabled={!title || !description}
        onPress={handleSubmit}
      >
        Add Habit
      </Button>

      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}

export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 12,
  },
  segmentedButton: {
    marginTop: 16,
    marginBottom: 16,
  },
});
