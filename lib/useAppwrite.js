import { useEffect, useState } from "react";
import { Alert } from "react-native";

function useAppwrite(fn) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await fn();
      console.log("Fetched data:", res); // Check what you're getting
      setData(res);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function refetch() {
    fetchData();
  }

  return { data, isLoading, refetch };
}

export default useAppwrite;
