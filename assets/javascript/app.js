// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyDh1fH6RCqWjbKXD0zAXADvVUfAWRKLVV8",
authDomain: "rps-multiplayer-6980e.firebaseapp.com",
databaseURL: "https://rps-multiplayer-6980e.firebaseio.com",
projectId: "rps-multiplayer-6980e",
storageBucket: "rps-multiplayer-6980e.appspot.com",
messagingSenderId: "498198746253",
appId: "1:498198746253:web:969e96613aaf7c45"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Global Variables
var userSelection;
var opponentSelection;
var wins = 0;
var losses = 0;

// --- Persistance code --- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});
// --- End of Persistance code --- //


$(".game-btns").on("click", function() {
   selection = $(this).attr("alt");
   selectionImg = $(this).attr("src");
   console.log(selection + " button clicked");

// post selection to p1-selection in DOM
   $("#user-selection").attr("src", selectionImg);
});