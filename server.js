var admin = require("firebase-admin");
var serviceAccount = require("sleepapp-d9df7-firebase-adminsdk-agewb-60cbf4958c.json");

var firebase = require("firebase");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sleepapp-d9df7.firebaseio.com"
});

// This registration token comes from the client FCM SDKs.
var registrationToken = "c8silk16Oyo:APA91bElXb9VN5Y5Betf_D7noVDqb2I_uu2kRLOhA1W1rwC3jEq--JeGqvSBraI3KT28ZP_ao5CrbusElI2alHRL_bhsYzbuOWTHMIUQ7cFBdI24ZZFnCG8_BaNRfhsuPQAaz0iT1Vp7";

// Access firebase database, authentication and storage
var config = {
  apiKey: "AIzaSyCnIzwlFU8cFvr6MSwq1iHWrFltGG5ChnY",
  authDomain: "sleepapp-d9df7.firebaseapp.com",
  databaseURL: "https://sleepapp-d9df7.firebaseio.com",
  storageBucket: "sleepapp-d9df7.appspot.com"
};

var app = firebase.initializeApp(config);

var db = admin.database();
var users = ['trentishii1993'];
var i;

for (i in users) {
	var ref = db.ref('/Setttings/' + users[i]);

	var schedule = require('node-schedule');
	var notification1 = null;
	var notification2 = null;
	var notification3 = null;
	var notification4 = null;
	var notification5 = null;

	ref.on("value", function(snap) {
		if (notification1 != null && notification2 != null && notification3 != null && notification4 != null && notification5 != null) {
			notification1.cancel();
			notification2.cancel();
			notification3.cancel();
			notification4.cancel();
			notification5.cancel();
			console.log("JOBS CANCELLED");
		} 
		var val = snap.val();
		var wakeMin = val.wakeMin;
		var wakeHour = val.wakeHour;
		var sleepMin = val.sleepMin;
		var sleepHour = val.sleepHour;

		var wake = new Date(2017, 0, 1, wakeHour, wakeMin);
		var sleep = new Date(2017, 0, 1, sleepHour, sleepMin);
		if (sleep < wake) {
			sleep.setDate(sleep.getDate() + 1);
		}
		var msec = sleep - wake;
		var thirdmsecs = Math.floor(msec / 3);

		var wholeDay = msecConversion(msec);
		var thirdDay = msecConversion(thirdmsecs);
		console.log("One-Third of Awake Time is " + thirdDay[0] + " hours " + thirdDay[1] + " minutes");
		

		notification1 = sendNotification("TAKE TESTS", "Click to take LEEDS test", wakeHour, wakeMin, "OPEN_LEEDS");
		notification2 = sendNotification("TAKE TESTS AND COMPLETE BEDTIME DIARY", "Click to complete tests and diary", sleepHour, sleepMin, "OPEN_PANAS");
		var firstThird = addTime(wakeHour, thirdDay[0], wakeMin, thirdDay[1]);
		var secondThird = addTime(firstThird[0], thirdDay[0], firstThird[1], thirdDay[1]);
		notification3 = sendNotification("TAKE FIRST TESTS", "Click to take PAM and PVT", firstThird[0], firstThird[1], "OPEN_PAM");
		notification4 = sendNotification("TAKE SECOND TESTS", "Click to take PAM and PVT", secondThird[0], secondThird[1], "OPEN_PAM");
		notification5 = sendNotification("TAKE LAST TESTS", "Click to take PAM and PVT", sleepHour, sleepMin, "OPEN_PAM");
		console.log("User Wakeup Time: " + wakeHour + ":" + wakeMin);
		console.log("User First Tests of the Day: " + firstThird[0] + ":" + firstThird[1]);
		console.log("User Second Tests of the Day: " + secondThird[0] + ":" + secondThird[1]);
		console.log("User Sleep Time: " + sleepHour + ":" + sleepMin);
	});
}


function addTime(hour1, hour2, min1, min2) {
	var newMin = min1 + min2;
	var carryHour = 0;
	if (newMin > 59) {
		carryHour = 1
		newMin = newMin - 60;
	}
	var newHour = hour1 + hour2 + carryHour;
	if (newHour > 23) {
		newHour = newHour - 24;
	}
	return [newHour, newMin];
}

function msecConversion(msec) {
	var hour = Math.floor(msec / 1000 / 60 / 60);
	msec -= hour * 1000 * 60 * 60;
	var min = Math.floor(msec / 1000 / 60);
	msec -= min * 1000 * 60;
	var sec = Math.floor(msec / 1000);
	msec -= sec * 1000;
	return [hour, min, sec];
}


// This function sends a notification at a given time with a title, body and click action
function sendNotification(title, body, hour, min, click) {
	var payload = {
		notification: {
    		title: title,
    		body: body,
    		click_action: click
  		}
	};
	//console.log(payload);
	//console.log(min + ' ' + hour + ' * * *');
	var j = schedule.scheduleJob(min + ' ' + hour + ' * * *', function(){
		admin.messaging().sendToDevice(registrationToken, payload)
	  		.then(function(response) {
	    	// See the MessagingDevicesResponse reference documentation for
	    	// the contents of response.
	    	console.log("Successfully sent message:", response);
	  	})
	  	.catch(function(error) {
	    		console.log("Error sending message:", error);
	  	});
	});
	return j;
}
