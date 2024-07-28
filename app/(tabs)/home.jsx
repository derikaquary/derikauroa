import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index.js";
import SearchInput from "../../components/SearchInput.jsx";
import Trending from "../../components/Trending.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getAllPost, getLatestPosts } from "../../lib/appwrite.js";
import useAppwrite from "../../lib/useAppwrite.js";
import CardVideo from "../../components/CardVideo.jsx";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPost);

  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refetch(); // re call videos -> if any new videos appeared
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <CardVideo video={item} />}
        ListHeaderComponent={() => (
          <View className="px-6 ">
            <View className="  flex-row justify-between items-center mb-8 mt-4 ">
              <View className=" items-start flex-col  ">
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back
                </Text>
                <Text className="text-xl font-psemibold text-white">Derik</Text>
              </View>
              <View className="mt-1.5 ">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10  "
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
