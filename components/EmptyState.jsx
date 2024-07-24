import { View, Text, Image } from "react-native";
import React from "react";
import images from "../constants/images";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4 mt-[-20px]">
      <Image
        source={images.empty}
        className="w-[230px] h-[175px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5 "
        textStyles="font-regular"
      />
    </View>
  );
};

export default EmptyState;
