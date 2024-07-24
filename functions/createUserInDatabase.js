const sdk = require("node-appwrite");

// Initialize the client SDK
const client = new sdk.Client();
const account = new sdk.Account(client);
const databases = new sdk.Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject("669b339d0012ff487e80") // Your project ID
  .setKey(
    "0d1486df67ff4142979b96a0aaf22b29d2baee80bcc6ee643fa75397eb42fe38a299f1ef3232b31d6a56ae08bcebcafe5500889a582bc48f633e74f76bb4bba69b9b4b00756914ac709777fbcca47e702f7ebd0dbb0e765b2f6ae978635545e516aa16b9c43c5f9fc50a37dd90f777101dc4905c4012e73fb32a6cef1a48b07d"
  ); // Your secret API key

module.exports = async (req, res) => {
  const payload = JSON.parse(req.body);

  try {
    const newUser = await databases.createDocument(
      "669b37140025259e12cf", // Your database ID
      "669b37af000865f9986b", // Your collection ID
      sdk.ID.unique(),
      {
        accountId: payload.$id, // User ID
        email: payload.email,
        username: payload.name,
        avatar: `https://www.gravatar.com/avatar/${md5(
          payload.email
        )}?d=identicon`,
      }
    );

    res.json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};
