import { View, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState.jsx";
import { getUserPosts, signOut } from "../../lib/appwrite.js";
import useAppwrite from "../../lib/useAppwrite.js";
import CardVideo from "../../components/CardVideo.jsx";
import { useGlobalContext } from "../../context/GlobalProvider.js";
import icons from "../../constants/icons.js";
import InfoBox from "../../components/InfoBox.jsx";
import { useRouter } from "expo-router";

function Profile() {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const router = useRouter();

  async function logout() {
    try {
      console.log("Logging out...");
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      console.log("Redirecting to sign-in...");
      router.push("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardVideo video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center mb-7">
            <TouchableOpacity
              className=" w-full mb-10 items-end px-3"
              onPress={logout}>
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center mx-auto ">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-3"
              titleStyles="text-lg"
            />

            <View className="mt-1 flex-row justify-center">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
}

export default Profile;
