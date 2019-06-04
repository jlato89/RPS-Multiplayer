// Firebase Config
var firebase = {
apiKey: "AIzaSyDh1fH6RCqWjbKXD0zAXADvVUfAWRKLVV8",
authDomain: "rps-multiplayer-6980e.firebaseapp.com",
databaseURL: "https://rps-multiplayer-6980e.firebaseio.com",
projectId: "rps-multiplayer-6980e",
storageBucket: "rps-multiplayer-6980e.appspot.com",
messagingSenderId: "498198746253",
appId: "1:498198746253:web:969e96613aaf7c45"
};
// Initialize Firebase
// firebase.initializeApp(firebase);

// var database = firebase.database();

// Global Variables
var p1 = false;
var p2 = false;
var p1Selection;
var p2Selection;
var wins = 0;
var losses = 0;

$(".game-btns").on("click", function() {
   selection = $(this).attr("alt");
   selectionImg = $(this).attr("src");
   console.log(selection + " button clicked");

// Check to see if p1 or p2 clicked button
   if (p1) {
      database.ref().set({
         p1Selection: selection,
      });   
   }
   if (p2) {
      database.ref().set({
         p2Selection: selection,
      });   
   }
// post selection to p1-selection in DOM
   $("#p1-selection").attr("src", selectionImg);
});