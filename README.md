# proteinbot
Discord chatbot to keep track of exercise and allow users to compete with other users using leaderboards and points systems.
Users can add the type of exercise they completed, how many times they did the exercise or how long, and the system will give the appropriate amount of points for the exercise.
The system also has a monthly leaderboard and all time leaderboard to allow users to compete to each other.

### Dependencies:
Name | Version
--------------
Discord.js | >= 0.1.6
Enmap | >= 5.7.1
Better-sqlite3 | >= 7.1.0
_Above versions are the earliest tested; wherever possible, please install the latest versions._

### Features:
* Automatic point calculation system
* Monthly and all time leaderboard system
* Adjustable sports list
* Adjustable points ratio list
* Configurable prefix and administrator list
* Administratively add or remove points to/from users
* Banning system to ban specific users from using the bot

### Commands:
* View bot information: [prefix]info
* Add sport: [prefix]add [sport] [amount/time]
* Remove sport: [prefix]remove [sport] [amount/time]
* List all sports: [prefix]sports
* Suggest a sport: [prefix]suggest [suggestion]
* View profile: [prefix]profile <other users @ if looking for someone elses>
* View monthly leaderboard: [prefix]leaderboard
* View all-time leaderboard: [prefix]leaderboard all
* Administratively add sport: [prefix]adminadd [user @] [sport] [amount/time]
* Administratively remove sport: [prefix]adminremove [user @] [sport] [amount/time]
* Administratively ban user: [prefix]adminban [user @]
* Administratively unban user: [prefix]adminunban [user @]


### Technical information:
The program connects to Discord using their API and Discord.js, and listens for messages starting with the configured prefix once its been added to a server.
The prefix is completely modifiable within the config file, as well as the sports list, points for sports ratio, and administrator list.
All data for the system is stored in two databases, scores and bans, which can be removed and added to the installation at will.
When a user adds their exercise using the command '[prefix]add [sport] [amount/time]', the system will do '[value of sport] * [amount]', and the total will be added to the users profile, which is generated the first time they interact with the bot.
