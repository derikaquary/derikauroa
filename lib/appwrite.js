import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.drk.aora",
  projectId: "669b339d0012ff487e80",
  databaseId: "669b37140025259e12cf",
  userCollectionId: "669b37af000865f9986b",
  videoCollectionId: "669b381a0030cd2dd27c",
  storageId: "669b7100000c568babc9",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
// Register User
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    // Creating a document in the custom user collection
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id, // Ensure this is correctly set
        email,
        username,
        avatar: avatarUrl,
      }
    );

    console.log("User document created:", newUser);

    return newUser;
  } catch (error) {
    console.log("Error in createUser:", error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    /* // Check if there is an active session
    const sessions = await account.listSessions();
    if (sessions.total > 0) {
      console.log("Active session found, clearing session...");
      await account.deleteSessions();
    } */

    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session.$id);

    // Store session token
    await AsyncStorage.setItem("session", session.$id);
    console.log("Session stored in AsyncStorage:", session.$id);

    return session;
  } catch (error) {
    console.error("Error in signIn:", error);
    throw new Error(error);
  }
}

/* export async function getCurrentUser() {
  try {
    // Mock user data
    const mockUser = {
      $id: "669f780b0013fa790a2b",
      accountId: "669f780b0013fa790a2b",
      email: "mockuser@example.com",
      username: "mockuser",
      avatar: "mockAvatarUrl",
    };

    // Log the mock user data
    console.log("Mock user data:", mockUser);

    // Return the mock user data
    return mockUser;
  } catch (error) {
    console.log("Error in getCurrentUser:", error);
    throw error;
  }
} */

export async function getCurrentUser() {
  try {
    const sessionId = await AsyncStorage.getItem("session");
    console.log("Retrieved session from AsyncStorage:", sessionId);

    if (!sessionId) {
      throw new Error("No session found");
    }

    const currentAccount = await account.get();
    console.log("Current account:", currentAccount);

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    console.log("Current user documents:", currentUser);

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("Failed to get current user");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log("Error in getCurrentUser:", error);
    throw error;
  }
}

export async function getAllPost() {
  try {
    const post = await databases.listDocuments(databaseId, videoCollectionId);

    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const post = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchPosts(query) {
  try {
    const post = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const post = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    await AsyncStorage.removeItem("session");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}
