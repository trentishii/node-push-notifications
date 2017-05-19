
var admin = require("firebase-admin");
var serviceAccount = require("sleepapp-d9df7-firebase-adminsdk-agewb-60cbf4958c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sleepapp-d9df7.firebaseio.com"
});

// This registration token comes from the client FCM SDKs.
var registrationToken = "c8silk16Oyo:APA91bElXb9VN5Y5Betf_D7noVDqb2I_uu2kRLOhA1W1rwC3jEq--JeGqvSBraI3KT28ZP_ao5CrbusElI2alHRL_bhsYzbuOWTHMIUQ7cFBdI24ZZFnCG8_BaNRfhsuPQAaz0iT1Vp7";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
  notification: {
    title: "Hello",
    body: "Urgent action is needed to prevent your account from being disabled!"
  }
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });