# Tower Scum 2.0 READ ME
Now in both single and multiplayer format.

In single-player mode, drag and drop the attacking viruses to protect your computer.

In multiplayer mode, you are pitted against one another to out type your opponent. Complete lines of text to send attacking viruses toward your oppenent and to turn away those they have sent to you! Be the last computer standing to win.

##Slack Integration
Tower Scum has slack integration to callout your friends directly! By entering '/callout' followed by @user (change user to their username), you can challenge your friends to a round of Tower Scum. A link will be generated that will direct each user to their own battleground.

##Overview of the files
There are two folders that contain a game mode. 'client' contains the new two-player logic and 'original-version' contains the single-player logic.

For both versions folders are split up by states, sprites, and assets. The main game logic titled "towerscum.js" has the main game logic.

| States | Sprites | Assets |
| :----- | :------ | :----- |
| preloads assets | contains virus/sprite animation logic | has the image files | 


The 'server' file contains the neccesary framework to support multiplayer gameplay. This includes the logic to update both player views for a consistent experience. Otherwise, the front-end logic and files are not too dissimiliar between the single-player and multi-player modes.

In the multiplayer setup, there are several global variables used. 'roomID', 'player', and 'name' are defined in client/test.js file.

##States 
The states folder consists of boot, preload, menu, and game over. There shouldn't be a need to add or delete any files here. 

Boot.js -> Preload.js -> Menu.js -> Towerscum.js [if player loses] -> Gameover.js -> Towerscum.js [if player chooses to play again]
  * Boot.js just starts up preload and sets up some of the debugging tools. One such tool used in the code is the fps counter to see if there's any noticeable framerate issues.
  * Add any assets that need to be loaded into preload.js. The entire assets folder is already added in there along with several classes (viruses, computer, etc). Once preloading is finished it fires up the menu.
  * Menu.js currently only has a play button, but other buttons can be added here preferably some sort of configurable user settings. Menu.js starts the game 'towerscum.js' when the user presses play.
  * Although, not in the states folder towerscum.js should be considered one. It contains most of the game logic (score, health, rounds, virus attacking, collisions, and more). However, it does work symbiotically with the sprites folder particular with the score function and various animations that are invoked by certain events.
  * Lastly, gameover.js has the 'game over' logic. In this case once the player's health reaches 0, game over is reached and the player can choose to play again (restarting the entire game).

A good article about states is [here.](http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/)

##Sprites
The sprites folder contains the computer files, virus files, and the stage file. To create new enemies, a new js file needs to be created here. The sprites folder accesses the asset folder in order to create the animations.
Each enemy is represented by one js file.

As of now the virus files contains functions that can
  * create a certain animation (walking animation, attacking animation, death animation)
  * how fast the animation is played (can speed up or slow down the animations by x amount of frames)
  * change how many drops it takes to kill the virus
  * how high you have to drop the virus to kill it
  * change how much points gained from killing a virus
  * specify the coordinates where the virus spawns

The computer files is represented by two files (one for the computer itself, the other for its collision)
  * change hitboxes for invoking the viruses' attack animation
  * contains the computer animation composed of its multiple images
  * weapons to attack the virus (not fully implemented as of yet)

The createStage.js is used for 
  * defining the boundaries of the game
  * enabling the physics
  * creating the ground

##Assets

All images pertaining to viruses and computers are in this folder. There are subfolders for certain classifications. Quickest way to create new viruses is to create a new virus folder within assets/viruses.

For example to create a "swordy" virus, create a "swordy" folder and whatever animations titled within the swordy folder. In the actual code, walking, attacking, and death are used. Each folder has a set of images that can be looped into a sprite and invoked later in towerscum.js and swordy.js file located in sprites folder.

Delete the virus image file in the directory of the virus folder. Use [texturepacker](https://www.codeandweb.com/texturepacker) to generate a new phaser JSON file and a new sprite sheet. Then create a new virus file in the sprites folder and reference the newly created asset within preload.js of the states folder.

##towerscum.js

All client-side game logic is here. Technically it should be a part of the states folder but this javascript file in particular contains all of the game logic and necessary variables.

The towerscum.js file 
  * contains the health/score/round functions 
  * can change how much damage a virus does
  * has the corresponding object variable for viruses
  * keeps track of how many viruses are present within the game
  * can edit the levels here (how many of which virus spawning)
  * attacking is set here
  * tracks the computer health bar
  * game over is invoked here

There are many other functions that is probably missing in this list but this is to give a general understanding of what the towerscum.js file is used for.


##Other references

[Phaser Docs](http://phaser.io/docs)
[Socket.io Docs](http://socket.io/docs)
