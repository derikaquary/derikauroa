import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, signOut } from "../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

function GlobalProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionId = await AsyncStorage.getItem("session");
        console.log("Retrieved session from AsyncStorage:", sessionId);

        if (!sessionId) {
          console.log("No session found in AsyncStorage");
          setIsLoggedIn(false);
          setUser(null);
        } else {
          const user = await getCurrentUser();
          if (user) {
            console.log("User found:", user);
            setIsLoggedIn(true);
            setUser(user);
          } else {
            console.log("No user found");
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
