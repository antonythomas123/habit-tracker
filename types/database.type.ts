import { Models } from "react-native-appwrite";

export interface Habit extends Models.Document {
    user_id: string,
    title: string,
    description: string,
    frequency: string,
    streak_count: number,
    last_completed: string,
    created_At: string
}

export interface HabitCompletion extends Models.Document {
    habit_id: string; 
    user_id: string;
    completed_at: string;
}