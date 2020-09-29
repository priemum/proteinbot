const userLookup = require("./userLookup.js");

//ADD LOGS
exports.printIndividualAddedPoints = function(client, id, number, unittype, type, totalvalue) {
    async function print() {
        let username = await userLookup(client,id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") added " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points.");
    }
    print();
}
exports.printIndividualFailedAddingPoints = function(client, id, type) {
    async function print() {
        let username = await userLookup(client,id);
        console.log("[" + (new Date()) + "] " + id+ " (" + username + ") requested an invalid sport of " + type + ".");
    }
    print();
}

//ADMIN ADD LOGS
exports.printAdminAddedPoints = function(client, giverid, recieverid, number, unittype, type, totalvalue) {
    async function print() {
        let giver = await userLookup(client, giverid);
        let reciever = await userLookup(client, recieverid);
        console.log("[" + (new Date()) + "] " + giverid + " (" + giver + ") has administratively added " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points to " + recieverid + " (" + reciever + ").");
    }
    print();
}

//ADMIN BAN LOGS
exports.printAdminBannedUser = function(client, giverid, recieverid) {
    async function print() {
        let giver = await userLookup(client, giverid);
        let reciever = await userLookup(client, recieverid);
        console.log("[" + (new Date()) + "] " + giverid + " (" + giver + ") has administratively banned " + recieverid + " (" + reciever + ").");
    }
    print();
}

//ADMIN REMOVE LOGS
exports.printAdminRemovedPoints = function(client, giverid, recieverid, number, unittype, type, totalvalue) {
    async function print() {
        let giver = await userLookup(client, giverid);
        let reciever = await userLookup(client, recieverid);
        console.log("[" + (new Date()) + "] " + giverid + " (" + giver + ") has administratively removed " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points from " + recieverid+ " (" + reciever + ").");
    }
    print();
}

//ADMIN UNBAN LOGS
exports.printAdminUnbannedUser = function(client, giverid, recieverid) {
    async function print() {
        let giver = await userLookup(client, giverid);
        let reciever = await userLookup(client, recieverid);
        console.log("[" + (new Date()) + "] " + giverid + " (" + giver + ") has administratively unbanned " + recieverid + " (" + reciever + ").");
    }
    print();
}

//COMMANDS LOGS
exports.printUserListedCommands = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") listed the commands.");
    }
    print();
}

//HELP LOGS
exports.printUserRequestedHelp = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") ran the help command.");
    }
    print();
}

//INFO LOGS
exports.printUserRequestedInfo = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") ran the info command.");
    }
    print();
}

//LEADERBOARD LOGS
exports.printUserRequestedAllTimeLeaderboard = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") requested the all time leaderboard.");
    }
    print();
}
exports.printUserRequestedMonthlyLeaderboard = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") requested the monthly leaderboard.");
    }
    print();
}

//PROFILE LOGS
exports.printUserRequestedSelfProfile = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") requested their info.");
    }
    print();
}
exports.printUserRequestedOtherProfile = function(client, requesterid, requestedid) {
    async function print() {
        let requester = await userLookup(client, requesterid);
        let requested = await userLookup(client, requestedid);
        console.log("[" + (new Date()) + "] " + requesterid + " (" + requester + ") requested the info of " + requestedid + " (" + requested + ").");
    }
    print();
}

//RELOAD LOGS
exports.printAdminRequestedReload = function(client, id, commandName) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") reloaded command \"" + commandName + "\"");
    }
    print();
}

//REMOVE LOGS
exports.printIndividualRemovedPoints = function(client, id, number, unittype, type, totalvalue) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") removed " + number + " " + unittype + " of " + type + ", totalling " + totalvalue + " points.");
    }
    print();
}
exports.printIndividualFailedRemovingPoints = function(client, id, type) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id+ " (" + username + ") requested an invalid sport of " + type + ".");
    }
    print();
}

//SPORTS LOGS
exports.printUserRequestedSports = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") ran the sports command.");
    }
    print();
}

//SUGGEST LOGS
exports.printSubmittedSuggestion = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") successfully filed a suggestion.");
    }
    print();
}

//TOTAL LOGS
exports.printUserRequestedSelfTotal = function(client, id, score) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") requested their total of " + score.points + ".");
    }
    print();
}
exports.printUserRequestedOtherTotal = function(client, requesterid, requestedid, score) {
    async function print() {
        let requester = await userLookup(client, requesterid);
        let requested = await userLookup(client, requestedid);
        console.log("[" + (new Date()) + "] " + requesterid + " (" + requester + ") requested " + requestedid + " ( " + requested + ") 's total of " + score.points + ".");
    }
    print();
}

//VERSION LOGS
exports.printUserRequestedVersion = function(client, id) {
    async function print() {
        let username = await userLookup(client, id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") ran the version command.");
    }
    print();
}

//MONTHLY RESULTS LOGS
exports.printMonthlyWinners_OneWinner = function(client, lastMonthWinners) {
    async function print() {
        let username1 = await userLookup(client,lastMonthWinners[0].id);
        console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + username1 + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: No winner.\n[Cont.] 3rd: No winner.");
    }
    print();
}
exports.printMonthlyWinners_TwoWinners = function(client, lastMonthWinners) {
    async function print() {
        let username1 = await userLookup(client,lastMonthWinners[0].id);
        let username2 = await userLookup(client,lastMonthWinners[1].id);
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + username1 + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: " + lastMonthWinners[1].id + " (" + username2 + ") with " + lastMonthWinners[1].points + " points.\n[Cont.] 3rd: No winner.");
    }
    print();
}
exports.printMonthlyWinners_ThreeWinners = function(client, lastMonthWinners) {
    async function print() {
        let username1 = await userLookup(client,lastMonthWinners[0].id);
        let username2 = await userLookup(client,lastMonthWinners[1].id);
        let username3 = await userLookup(client,lastMonthWinners[2].id);
      console.log("[" + (new Date()) + "] " + "Last months podium:\n[Cont.] 1st: " + lastMonthWinners[0].id + " (" + username1 + ") with " + lastMonthWinners[0].points + " points.\n[Cont.] 2nd: " + lastMonthWinners[1].id + " (" + username2 + ") with " + lastMonthWinners[1].points + " points.\n[Cont.] 3rd: " + lastMonthWinners[2].id + " (" + username3 + ") with " + lastMonthWinners[2].points + " points.");
    }
    print();
}

//BANNED USER LOGS
exports.printBannedUseAttempt = function (client, id) {
    async function print() {
        let username = await userLookup(client,id);
        console.log("[" + (new Date()) + "] " + id + " (" + username + ") attempted to use the bot, but is banned.");
    }
    print();
}