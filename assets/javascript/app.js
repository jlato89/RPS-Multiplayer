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
var player;
var userSelection;
var opponentSelection;
var wins = 0;
var losses = 0;
var playerNum;

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

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

   // The number of online users is the number of children in the connections list.
   playerNum = snapshot.numChildren();
   console.log('DB Connections: ', playerNum);
 });
// --- End of Persistance code --- //

// Main Process
$(document).ready(function() {

   // Check to see how many players are ready
   database.ref("players").on("value", function(snapshot) {
      console.log("DB players: "+snapshot.val());

      player = snapshot.val();
   });

   // On start of game, assign player number then show game buttons. 
   // If players is above 2, then show alert/error.
   $("#startBtn").on("click", function() {

      if (player < 2) {
         // console.log('IF -> playerNum: ', playerNum);
         player++;
         console.log("You are player "+player);
         $("#startBtn").hide();
         $("#game-buttons").css("visibility", "visible");

         database.ref("/").update({
            players: player
          });        
      }
      // else if (playerNum === 2) {
      //    console.log('IF -> playerNum: ', playerNum);
      //    player = 2;
      //    console.log("You are player 2");
      //    $("#startBtn").hide();
      //    $("#game-buttons").css("visibility", "visible");
      // }
      else {alert("Only 2 players are allowed at a time!")}
   })

   // On game button click, send to database and then show to DOM.
   $(".game-btns").on("click", function() {
      selection = $(this).attr("alt");
      selectionImg = $(this).attr("src");
      playerName = "Player "+player;
      console.log(selection + " button clicked");

      database.ref("/selections").update({
         [playerName]: selection
       });
     
   // post selection to user-selection in DOM
      $("#user-selection").attr("src", selectionImg);
   });

});