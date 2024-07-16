import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const App = () => {
  return (
    <View className="flex-1 bg-red-400 items-center justify-center">
      <Text className="text-4xl text-red bg-green-400 text-center font-pextrabold">
        Aora!
      </Text>
      <Text className=" bg-yellow-400 h-[100px]">bla bla bla</Text>
      <StatusBar style="auto" />
      <Link href="/home">Go to Home</Link>
    </View>
  );
};

export default App;
