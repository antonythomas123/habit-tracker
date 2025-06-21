import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type ExtendedUser = Models.User<Models.Preferences> & {
  $id: string
}

type AuthContextType = {
  user: ExtendedUser | null;
  isLoadingUser: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get()
      setUser(session)
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured while signing in";
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }

      return "An error occured while signing up";
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUser,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  let context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be provided a context");
  }

  return context;
}
