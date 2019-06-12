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
var playerID = 0;
var playersReady;
var userSelection = 0;
var opponentSelection = 0;
var wins = 0;
var losses = 0;
var ties = 0;
var dbConnections;

// --- Persistance code --- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

   // If they are connected..
   if (snap.val()) {

      // Add user to the connections list.
      var con = connectionsRef.push(true);

      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
   }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snapshot) {

   // The number of online users is the number of children in the connections list.
   dbConnections = snapshot.numChildren();
   

   // Check whether there is only 1 connection to DB, if so reset active players to 0
   if (dbConnections <= 1) {
      database.ref("/").update({
         playersReady: 0
      });
      database.ref("/selections").remove();
      // Remove comments as well
      database.ref("/comments").remove();
   }
});
// --- End of Persistance code --- //
// FUNCTIONS
function nextRound() {
   database.ref("/selections").remove();
   userSelection = 0;
   opponentSelection = 0;
   var defaultImg = "https://via.placeholder.com/100x100?text=?"

   $("#user-selection").attr("src", defaultImg);
   $("#opponent-selection").attr("src", defaultImg);
   $("#wins").text("Wins: "+wins);
   $("#losses").text("Losses: "+losses);
}
function results() {
   var r = "https://via.placeholder.com/100x100?text=Rock";
   var p = "https://via.placeholder.com/100x100?text=Paper";
   var s = "https://via.placeholder.com/100x100?text=Scissors";

   if ((userSelection === r && opponentSelection === s) ||
      (userSelection === s && opponentSelection === p) ||
      (userSelection === p && opponentSelection === r)) {
      
      $("#win-lose").html("WIN")
      wins++;
   } else if (userSelection === opponentSelection) {
      
      $("#win-lose").html("TIE")
      ties++;
   } else {
      
      $("#win-lose").html("LOSE")
      losses++;
   }

}

// Main Process
$(document).ready(function () {

   // Check to see how many players are ready
   database.ref("playersReady").on("value", function (snapshot) {
      

      playersReady = snapshot.val(); //* checks how many players are ready.
   });

   //  !START BUTTON!  // 
   // On start of game, assign player number then show game buttons. 
   // If players is above 2, then show alert/error.
   $("#startBtn").on("click", function () {

      if (playersReady < 2) {
         // 
         playerID = playersReady + 1;
         playersReady++;
         

         $("#startBtn").hide();
         $("#game-buttons").css("visibility", "visible");

         database.ref("/").update({
            playersReady: playersReady
         });
      }
      else { alert("Only 2 players are allowed at a time!") }
   })


   //  !GAME PROCESS!  //   
   // On game button click, send to database and then show to DOM.
   $(".game-btns").on("click", function () {
      if (userSelection !== 0) {  }
      else if (playersReady === 2) {
         selectionImg = $(this).attr("src");
         playerName = "P" + playerID;

         database.ref("/selections").update({
            [playerName]: selectionImg
         }).then(function () {
            return database.ref("/selections").once("value");
         }).then(function (snapshot) {
            var data = snapshot.val();
            if (playerID === 1) {
               userSelection = data.P1;
            }
            if (playerID === 2) {
               userSelection = data.P2;
            }
            $("#user-selection").attr("src", userSelection);
         });

         // post selection to user-selection from DB to DOM
      }
      else { alert("2nd player isn't ready yet") }
   });

   database.ref("/selections").on("value", function (snapshot) {
      var selections = snapshot.numChildren();
      // Check to see when both users have a selection
      if (selections === 2) {
         

         if (playerID === 1) {
            opponentSelection = snapshot.val().P2;
            

            $("#opponent-selection").attr('src', snapshot.val().P2);
         }
         if (playerID === 2) {
            opponentSelection = snapshot.val().P1;
            

            $("#opponent-selection").attr('src', snapshot.val().P1);
         }
         // wait .5 sec and check results
         setTimeout(results, 500);
         // Wait 8 secs then start next round
         setTimeout(nextRound, 8000);
      }
   });

   //! ChatBox section
   // Submit button
   $("form").submit(function() {
      event.preventDefault();
      if (playerID === 0) { alert("Please click the start button to chat.") }
      else {
         var name = "Player"+playerID;
         var comment = $("#chat-box-text").val().trim();
         
         

         database.ref("/comments").push({
            name: name,
            comment: comment
         });
         $("#chat-box-text").val("")
      }
   });

   // Check to see if there are any new msgs
   database.ref("/comments").on("child_added", function (snapshot) {
      var database = snapshot.val();
      var displayName = database.name;
      var displayComment = database.comment;
      
      $("#chat-box-comments").append("<div><strong>"+displayName+": </strong>"+displayComment+"</div>");
   });
});