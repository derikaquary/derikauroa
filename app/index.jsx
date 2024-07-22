import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter, Redirect, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CustomButton from "../components/CustomButton";
import "react-native-url-polyfill/auto";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const router = useRouter();
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className=" bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] items-center px-4">
          <Image
            source={images.logo}
            className="h-[84px] w-[130px] "
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px] "
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover endless posibiliies{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity meets innovation: embark of a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title="Continue with email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7"
          />
          <Link href="/sign-in">To sign in </Link>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
