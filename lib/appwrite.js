import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.drk.aora",
  projectId: "669b339d0012ff487e80",
  databaseId: "669b37140025259e12cf",
  userCollectionId: "669b37af000865f9986b",
  videoCollectionId: "669b381a0030cd2dd27c",
  storageId: "669b7100000c568babc9",
};

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
export async function createUser(email, password, username) {
  try {
    /* // Check if there is an active session
    const sessions = await account.listSessions();
    if (sessions.total > 0) {
      // Log out of the current session
      await account.deleteSessions();
    } */

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    /* // Check if there is an active session
    const sessions = await account.listSessions();
    if (sessions.total > 0) {
      // Log out of the current session
      await account.deleteSessions();
    } */

    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
