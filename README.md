# RPS-Multiplayer
Vanderbilt Bootcamp - Week 7 assignment

## Pseudocode

1. user clicks start game button
   1. IF active players in DB is LESS than 2, give user a playerID then show game buttons
   1. ELSE alert user that there are already 2 active players.
1. user clicks on one of three game buttons/images
   1. IF active players in DB is equal to 2, then send selection to DB as playerID.
   display user selection from the DB to the browser under playerID
   1. ELSE Alert user that player 2 isnt ready to play.
1. Display opponents selection after both players have made their selection.
   1. IF user won, show winning dialog
   1. ELSE show losing dialog.
1. after 10sec timeout, reset users selections in DB and start next round.
