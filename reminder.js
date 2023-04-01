//Discord JS Package
const Discord = require('discord.js');
//Moment Package
const moment = require('moment');
//Moment TimeZone Package
const momentTimeZone = require("moment-timezone");

//Creates Client named bot
const bot = new Discord.Client({
  intents: [
    'Guilds',
    'GuildMessages',
    'MessageContent',
    'GuildMembers'
  ],
  //Deleted Messages
  partials: ['MESSAGE']
})

//Bot token
const botToken = process.env;
//Creates Map
let reminderMap = new Map();

//Stores the Channel Id the Reminder was to.
let reminderChannelId;
let channel;

//setTimeout Function.
let myTimeout;

//Stores User's reminders
let displayReminders = ' ';
let rtReminders;

//Clears setTimeout Function.
function myStopFunction() {
  clearTimeout(myTimeout);
}

//Checks to see if a Users Specific Date and Time Reminder needs to be sent out.
const checkReminder = () => {

  //Months of the Year long form in order.
  let allMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  //Days of the Week long form in order.
  let dayOfWeekLong = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  //Days of the Week short form in order.
  let dayOfWeekShort = ['mon', 'tues', 'wed', 'thu', 'fri', 'sat', 'sun'];

  //Current Hour of Day (East Coast Time)
  let currentTimeHours = parseInt(moment().tz("America/New_York").format("h"));

  //Current Minute of Day (East Coast Time)
  let currentTimeMinutes = parseInt(moment().tz("America/New_York").format("mm"));

  //Current Time of day (East Coast Time)
  let currentTimeAmPm = moment().tz("America/New_York").format("a");

  //Current Month/Day/Year (East Coast) Format --> Example:3/23/2023
  let currentDateAndTime0 = moment().tz("America/New_York").format("l");

  //Current Day of the Week (East Coast) Format(Long Form) --> Example:thursday
  let currentDateAndTime1 = moment().tz("America/New_York").format("dddd").toLowerCase();

  //Used to create currentDateAndTime3 Format.
  let currentDateAndTime2 = moment().tz("America/New_York").format("MMMM Do YYYY").toLowerCase();

  //Current Month Day Year (East Coast) Format(Long Form) --> Example:march 23 2023
  let currentDateAndTime3;
  //Removes st from Current Date day.
  if (currentDateAndTime2.includes('st')) {
    currentDateAndTime3 = currentDateAndTime2.replace('st', '');
  }
  //Removes nd from Current Date day.
  if (currentDateAndTime2.includes('nd')) {
    currentDateAndTime3 = currentDateAndTime2.replace('nd', '');
  }
  //Removes th from Current Date day.
  if (currentDateAndTime2.includes('th')) {
    currentDateAndTime3 = currentDateAndTime2.replace('th', '');
  }
  //Removes rd from Current Date day.
  if (currentDateAndTime2.includes('rd')) {
    currentDateAndTime3 = currentDateAndTime2.replace('rd', '');
  }

  //Current Day (East Coast) Format --> Example:today
  let currentDateAndTime4 = moment().tz("America/New_York").calendar(null, {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastWeek: '[last] dddd',
    nextWeek: 'dddd',
    sameElse: 'L'
  }).toLowerCase();

  //Current Day of th Week (East Coast) Format(Short Form) --> Example:thu
  let currentDateAndTime5 = moment().tz("America/New_York").format("ddd").toLowerCase();

  // Loop through all the people
  // person = the name of the person
  // reminders = the list of remidners for the person
  reminderMap.forEach((reminders, person) => {

    // loop through each person's reminders
    for (r of reminders) {
      // Remove the reminder and time from the list of reminders if the reminder or time has been deleted or left undefined.
      if (r.time == undefined || r.reminder == undefined) {
        let index = reminders.indexOf(r);
        reminders.splice(index, 1);
        continue;
      }

      if (0 <= r.time) {
        let personsName = person;
        let reminder = r.reminder;
        rtReminders = r.reminder;
        displayReminders = r.reminder + ', ' + displayReminders;
        let time = r.time;

        //Sends Reminder to the Chat the Reminder was set at.
        myTimeout = setTimeout(() => {
          channel.send(personsName + " " + "REMINDER: " + reminder);
        }, time);
        //Removes the Reminder and Time from the Map once it has been sent to the channel the reminder was set at.
        let index = reminders.indexOf(r);
        reminders.splice(index, 1);
      }

      let userTimeToString = r.time.toString();
      //Separates Date and Time the user has set.
      let userInputReminderDateAndTimeList;
      //Date User has set.
      let userInputReminderDate;
      //Separates Hour and Minute the user has set.     
      let userInputTimeList;
      //Hour User has set.
      let userInputTimeListHour;
      //Minutes User has set.
      let userInputTimeListMinuets;
      //Time of day User has set.
      let userInputTimeAmPm;

      //Used to separate Date and Time from the !rdt: Command the user has used.
      if (userTimeToString.includes(',,')) {
        //Separates Date and Time the user has set.
        userInputReminderDateAndTimeList = r.time.split(",,");

        userInputReminderDate = userInputReminderDateAndTimeList[0].toLowerCase();
        userInputTimeList = userInputReminderDateAndTimeList[1].split(":");

        userInputTimeListHour = parseInt(userInputTimeList[0]);
        userInputTimeListMinuets = parseInt(userInputTimeList[1]);
        userInputTimeAmPm = userInputTimeList[1].charAt(2).toLowerCase() + userInputTimeList[1].charAt(3).toLowerCase();
      }
      //If the Time Format is not in !rdt: format go onto the next Time for the next reminder.
      else {
        continue;
      }

      //If the Current Date and Time = The Users set Date and Time for the Reminder send out Reminder.
      if (userInputReminderDate == currentDateAndTime0 || userInputReminderDate == currentDateAndTime1 || userInputReminderDate == currentDateAndTime3 || r.time == currentDateAndTime4 || userInputReminderDate == currentDateAndTime5) {
        if (userInputTimeListHour == currentTimeHours && userInputTimeListMinuets == currentTimeMinutes && userInputTimeAmPm == currentTimeAmPm) {
          // use the function to send reminder here
          channel.send(person + " " + "REMINDER: " + r.reminder);

          // remove the reminder from the list of reminders
          let index = reminders.indexOf(r);
          reminders.splice(index, 1);
        }
      }

      //If the User sends a reminder using the currentDateAndTime0 format.
      if (userInputReminderDate.includes('/')) {
        // Separates Month/Day/Year the user has set.
        userInputReminderDateList = userInputReminderDate.split('/');

        //Converts Month the user has set to a integer.
        let userInputReminderDateMonth = parseInt(userInputReminderDateList[0]);
        //Converts Day the user has set to a integer.
        let userInputReminderDateDay = parseInt(userInputReminderDateList[1]);
        //Converts Year the user has set to a integer.
        let userInputReminderDateYear = parseInt(userInputReminderDateList[2]);

        // Separates Month/Day/Year from currentDateAndTime0.
        currentDateAndTime0List = currentDateAndTime0.split('/');

        //Converts Month the currentDateAndTime0 has set to a integer.
        let currentDateAndTime0Month = parseInt(currentDateAndTime0List[0]);
        //Converts Day the currentDateAndTime0 has set to a integer.
        let currentDateAndTime0Day = parseInt(currentDateAndTime0List[1]);
        //Converts Year the currentDateAndTime0 has set to a integer.
        let currentDateAndTime0Year = parseInt(currentDateAndTime0List[1]);

        //If the Reminder was set for a Date or Time in the past send out the Reminder.
        if (userInputReminderDateMonth < currentDateAndTime0Month || userInputReminderDateDay < currentDateAndTime0Day || userInputReminderDateYear < currentDateAndTime0Year || userInputTimeListHour < currentTimeHours || userInputTimeListMinuets < currentTimeMinutes || userInputTimeAmPm != currentTimeAmPm) {
          channel.send(person + " " + "REMINDER: " + r.reminder);
          let index = reminders.indexOf(r);
          reminders.splice(index, 1);
        }
      }

      //If the User sends a reminder using the currentDateAndTime3 Format.
      if (userInputReminderDate.includes(' ')) {
        // Separates Month Day Year the user has set.
        userInputReminderDateList = userInputReminderDate.split(' ');

        //Month the user has set.
        let userInputReminderDateMonth = userInputReminderDateList[0].toLowerCase();
        //Converts Day the user has set to a integer.
        let userInputReminderDateDay = parseInt(userInputReminderDateList[1]);
        //Converts Year the user has set to a integer.
        let userInputReminderDateYear = parseInt(userInputReminderDateList[2]);

        // Separates Month Day Year from currentDateAndTime3.
        currentDateAndTime3List = currentDateAndTime3.split(' ');

        //Month the currentDateAndTime3 has set.
        let currentDateAndTime3Month = currentDateAndTime3List[0].toLowerCase();

        let currentDateAndTime3Day = parseInt(currentDateAndTime3List[1]);
        let currentDateAndTime3Year = parseInt(currentDateAndTime3List[1]);

        //The number of the Month the user has set.
        let userNumberMonthOfYear;
        //The number of the current Month set.
        let currentNumberMonthOfYear;

        for (let i = 0; i <= 11; i++) {
          //Sets the Number of the Month the user has set.
          if (userInputReminderDateMonth == allMonths[i]) {
            userNumberMonthOfYear = i;
          }
          //Sets the Number of the current Month set.
          if (currentDateAndTime3Month == allMonths[i]) {
            currentNumberMonthOfYear = i;
          }
        }
        if (userNumberMonthOfYear < currentNumberMonthOfYear || userInputReminderDateDay < currentDateAndTime3Day || userInputReminderDateYear < currentDateAndTime3Year || userInputTimeListHour < currentTimeHours || userInputTimeListMinuets < currentTimeMinutes || userInputTimeAmPm != currentTimeAmPm) {
          channel.send(person + " " + "REMINDER: " + r.reminder);
          let index = reminders.indexOf(r);
          reminders.splice(index, 1);
        }
      }

      //If the User sends a reminder using the currentDateAndTime1 or currentDateAndTime5 format.
      //The number of the Day the user has set.
      let userNumberDayOfWeek;
      //The number of the Day current Day set.
      let currentNumberDayOfWeek;

      //Sets the Number of the Day the user has set.
      for (let i = 0; i < 7; i++) {
        if (userInputReminderDate == dayOfWeekLong[i] || userInputReminderDate == dayOfWeekShort[i]) {
          userNumberDayOfWeek = i;
        }
        //Sets the Number of the current Day set.
        if (currentDateAndTime1 == dayOfWeekLong[i] || currentDateAndTime5 == dayOfWeekShort[i]) {
          currentNumberDayOfWeek = i;
        }
      }

      if (userNumberDayOfWeek <= currentNumberDayOfWeek) {
        if (userInputTimeListHour < currentTimeHours || userInputTimeListMinuets < currentTimeMinutes || userInputTimeAmPm != currentTimeAmPm) {
          channel.send(person + " " + "REMINDER: " + r.reminder);
          let index = reminders.indexOf(r);
          reminders.splice(index, 1);
        }
      }

      //If the User sends a reminder using the currentDateAndTime4 format.
      if (userInputReminderDate == currentDateAndTime4) {
        if (userInputTimeListHour < currentTimeHours || userInputTimeListMinuets < currentTimeMinutes || userInputTimeAmPm != currentTimeAmPm) {
          channel.send(person + " " + "REMINDER: " + r.reminder);
          let index = reminders.indexOf(r);
          reminders.splice(index, 1);
        }
      }
    }
  });
};

//Starts bot
bot.on("ready", () => {
  //Checks to see if any Reminder needs to be sent out
  setInterval(checkReminder, 1000);
  //Tells you the bot has log onto Discord
  console.log(`Logged in as ${bot.user.tag}!`);
});

//Starting time for when set Reminder will be sent out.
let timeDelay = 0;

//If a Message is sent while the bot is on.
bot.on('messageCreate', reminder => {
  //1 Second = 1000 Milliseconds
  let seconds = 1000;
  //1 Minute = 60000 Milliseconds
  let minutes = 60000;
  //1 Hour = 3600000 Milliseconds
  let hours = 3600000;

  //UserName of person who sent the reminder.
  let userName = reminder.author.toString();

  //Gets the Channel Id Reminder was sent.
  reminderChannelId = reminder.channelId;
  channel = bot.channels.cache.get(reminderChannelId);

  //Set Reminder with a Specific Time Limit.
  //If the Message starts with !rt: the Command is activated
  if (reminder.content.startsWith('!rt:')) {
    let reminderSet = reminder.content;

    //If the User forgot to use Proper Command Format.
    if (!reminderSet.includes(",,")) {
      return channel.send("Invalid Format: Forgot to add Commas (,,) --> !rt:REMINDER,,TIME");
    }
    //Separates Reminder from Time.
    let userInput = reminderSet;
    userInputList = userInput.split(",,");
    let userReminder = userInputList[0];
    let userInputTime = userInputList[1];
    //Removes Command from reminder
    let removeReminderCommand = userReminder.replace('!rt:', '');

    //If the User forgot to set a time.
    if (userInputTime == undefined) {
      return channel.send("Try Again: Forgot to set Time");
    }
    //If the User forgot to use Proper Time Format.
    if (!userInputTime.includes(":")) {
      return channel.send("Try Again: Invalid Format Forgot to add Colon(:) -> 0:0:0 (HOURS:MINUTES:SECONDS)");
    }
    //Separates Hours:Minutes:Seconds from the String to a list.
    userInputTimeList = userInputTime.split(":");

    //Turns Hours:Minutes:Seconds to Integer from string and converts Number of to milliseconds.
    parseInt(userInputTimeList[0]);
    timeDelay = timeDelay + (userInputTimeList[0] * hours);
    parseInt(userInputTimeList[1]);
    timeDelay = timeDelay + (userInputTimeList[1] * minutes);
    parseInt(userInputTimeList[2]);
    timeDelay = timeDelay + (userInputTimeList[2] * seconds);

    //Tells the User that thier reminder has been set.
    channel.send(removeReminderCommand + ' will be sent in ' + userInputTimeList[0] + ' Hours: ' + userInputTimeList[1] + ' Minutes: ' + userInputTimeList[2] + ' Seconds');

    //Stores the User Reminder and set Time.
    let userReminderandTime = { reminder: removeReminderCommand, time: timeDelay };
    //If the Person already exist in the Map.
    if (reminderMap.has(userName)) {
      //Stores Reminder and Time in the User who already exist.
      reminderMap.get(userName).push(userReminderandTime);
      //Resets time.
      timeDelay = 0;
    }
    //If the User is New in the Map.
    else {
      //Creates the new User in the Map.
      reminderMap.set(userName, []);
      //Stores Reminder and Time for new User.
      reminderMap.get(userName).push(userReminderandTime);
      timeDelay = 0;
    }
  }

  //Set Reminder with a specific Date and Time.
  //If the Message starts with !rdt: the Command is activated
  if (reminder.content.startsWith('!rdt:')) {
    let reminderSet = reminder.content;

    //If the User forgot to use Proper Command Format.
    if (!reminderSet.includes(",,")) {
      return channel.send("Try Again: Invalid Format Forgot to add Commas(,,) --> !rdt:REMINDER,,DATE,,TIME");
    }

    //Separates Reminder,,Date,,Time.
    let userInput = reminderSet
    userInputList = userInput.split(",,");
    let userReminder = userInputList[0];
    //Removes Command from Reminder.
    let removeReminderCommand = userReminder.replace('!rdt:', '');

    //If User Forgot to set Date
    if (userInputList[1] == undefined) {
      return channel.send("Try Again: Forgot to set Date.");
    }
    //If the User forgot to set a Time.
    if (userInputList[2] == undefined) {
      return channel.send("Try Again: Forgot to set Time.");
    }
    //If the User forgot to use Proper Time Format.
    if (!userInputList[2].includes(":")) {
      return channel.send("Try Again: Invalid Format Forgot to add Colon(:) -> 00:00am/pm");
    }

    //User set Time of day A or P.
    let userTimeOfDayAP = userInputList[2].length - 2;
    //User set Time of day M.
    let userTimeOfDayM = userInputList[2].length - 1;
    //User set Time of day Am or Pm.
    let userTimeOfDayAmPm = userInputList[2].charAt(userTimeOfDayAP) + userInputList[2].charAt(userTimeOfDayM);

    // If the User Forgot to set AM/PM.
    if (!userTimeOfDayAmPm == 'am' || !userTimeOfDayAmPm == 'pm' || !userTimeOfDayAmPm == 'AM' || !userTimeOfDayAmPm == 'PM') {
      return channel.send("Try again: Forgot to set AM or PM --> 00:00am/pm (No Spaces)");
    }

    //Combines back Date and Time the User set.
    let userDateAndTime = userInputList[1] + ',,' + userInputList[2];

    //Tells User that their Reminder has been set.
    channel.send(removeReminderCommand + ' will be sent at ' + userDateAndTime);

    let userReminderandTime = { reminder: removeReminderCommand, time: userDateAndTime };
    if (reminderMap.has(userName)) {
      reminderMap.get(userName).push(userReminderandTime);
    }
    else {
      reminderMap.set(userName, []);
      reminderMap.get(userName).push(userReminderandTime);
    }
  }

  //Lets the User Delete a reminder from their list.
  //If the Message starts with !d: the Command is activated.
  if (reminder.content.startsWith('!d:')) {
    let reminderDeleted = reminder.content;
    //Removes !d: Command from the Reminder the User want Deleted.
    let removeReminderDeleted = reminderDeleted.replace('!d:', '');
    channel.send(removeReminderDeleted + ' has been removed from your reminders.');

    if (!reminderMap.has(userName)) {
      return;
    }

    //Used if the user want to Delete a Reminder using the !rt: Command.
    if (rtReminders == removeReminderDeleted) {
      clearTimeout(myTimeout);
      rtReminders = undefined;
    }
    if (displayReminders.includes(removeReminderDeleted)) {
      displayReminders = displayReminders.replace(removeReminderDeleted + ', ', '');
    }

    for (userReminderandTime of reminderMap.get(userName)) {
      if (userReminderandTime.reminder == undefined) {
        continue;
      }
      //Used if the user want to Delete a Reminder using the !rdt: Command.
      if (userReminderandTime.reminder == removeReminderDeleted) {
        delete userReminderandTime.reminder;
        delete userReminderandTime.time;
      }
    }
    //Resets the reminder the User wants to be deleted.
    removeReminderDeleted = undefined;
  }

  //Shows User their Reminders 
  //If the Message starts with !rmd the Command is activated.
  if (reminder.content.startsWith('!rmd')) {

    //If the User has no Reminders stores/shows a Blank.
    if (reminderMap.get(userName) == undefined) {
      displayReminders = displayReminders + ' ';
    }
    //Loops through all the User's Reminders and store/show Reminders.
    else {
      for (userReminderandTime of reminderMap.get(userName)) {
        if (userReminderandTime.reminder == undefined) {
          continue;
        }
        displayReminders = userReminderandTime.reminder + ', ' + displayReminders;
      }
    }

    //Displays Menu of User's Reminders.
    //Sends Menu to Channel Command was called.
    if (channel) {
      //Creates Menu
      let embed = new Discord.EmbedBuilder()
        //Menu Title
        .setTitle('Reminders')
        //Displays which User's Name.
        .setAuthor({
          name: reminder.author.username, person:
            reminder.author
        })
        //User's Reminders
        .addFields(
          { name: displayReminders, value: ' ' })
      //Sends Menu
      channel.send({ embeds: [embed] });
    }
  }

  //Displays Menu of Different Commands.
  //If the Message starts with !rhelp the Command is activated
  if (reminder.content.startsWith('!rhelp')) {
    if (channel) {
      let embed = new Discord.EmbedBuilder()
        .setTitle('Commands')
        .addFields(
          //Shows User how to use !rt: Command.
          { name: "Set Reminder for certain amount of time", value: '!rt:Reminder,,Hours:Minutes:Seconds (Example -> !rt:Get Food,,1:2:3)' },
          //Shows User how to use !rdt: Command.
          { name: "Set Reminder for specific Date and Time", value: '!rdt:Reminder,,Month/Date/FullYear,,Time (Example: !rdt:Eat Food,,5/13/2015,,1:00am)' },
          { name: ' ', value: '!rdt:Reminder,,Day of the Week,,Time (Example: !rdt:Eat Food,,Saturday(Long Form) or Sat(Short Form),,1:00pm)' },
          { name: ' ', value: '!rdt:Reminder,,For Today,,Time (Example: !rdt:Eat Food,,Today,,12:00PM)' },
          { name: ' ', value: '!rdt:Reminder,,Month Day FullYear,,Time (Example: !rdt:Eat Food,,March 25 2021,,12:00AM)' },
          //Shows User how to use !d: Command.
          { name: 'How to Delete Reminders', value: '!d:Reminder you want deleted (Example: !d:Eat Food)' },
          //Shows User how to use !rmd Command.
          { name: 'To see Reminders set', value: '!rmd' },)

      channel.send({ embeds: [embed] });
    }
  }
})

//Bots Token
//leave at last line
bot.login(botToken.token);