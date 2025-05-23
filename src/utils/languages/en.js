const { wait } = require("./es");

module.exports = {
  no_reason: "Break the rules",
  no_user: "**:grey_exclamation:** | Mention someone",
  wait: "**:grey_exclamation: |** You have to wait **{duration}** to be able to use this command again",
  only_developers: "**:grey_exclamation: |** Only developers can use this :(",
  missingPerms: "{missingPerms0} and {missingPerms1}",
  userPerms: "You must have the following permissions: {function}",
  clientPerms: "I am missing the following permissions: {function}",
  dbError: "I have an error while trying to access the database, please try again later.",
  commands: {
    eightBall: {
      ball: [
        "Yes",
        "No",
        "Maybe",
        "I don't know",
        "Clear!",
        "Of course",
        "Of course not",
        "Of course not",
        "Definitely",
        "what do you think?",
        "Hmm",
        "Ask your mom",
      ],
      title: "🎱Question 8ball",
      field1: "Question",
      field2: "Reply",
      no_args: "**:grey_exclamation: |** You must write a question.",
    },
    angry: {
      no_user: "{user.username} Is angry 😡",
      user: "{author.username} Is angry with {user.username} 😡",
    },
    avatar: {
      no_user: "Your Avatar, {user.username}",
      user: "Avatar of {user.username}",
    },
    balance: {
      no_user: ":moneybag: You have **{money}**",
      user: ":moneybag: {user.username} Have: **{money}**",
    },
    ban: {
      no_args: "**:grey_exclamation: |** Provide a person to ban.",
      no_user:
        "**:grey_exclamation: |** Could not find that member, try again.",
      yourself: "**:grey_exclamation: |** You can't ban yourself ..",
      bannable: "**:grey_exclamation: |** I can't ban the mentioned user.",
      sucess: "{user.tag} it was banned from the server, reason: {reason}.",
    },
    clear: {
      no_args:
        "**❕ |** Enter the number of messages to delete",
      invalid_number: "**❌ |** The number must be between 1 and 100.",
      no_messages: "**❌ |** Messages could not be deleted. Make sure they are not too old.",
      cleared: "**✅ |** {number} messages were deleted.",
      usage: "Deletes messages from the current channel, with filters.\n\n**Usage:**\n`{prefix}clear <amount> [filters]`\n\n**Filters:**\n`bot` - Deletes only messages from bots.\n`attachment` - Deletes only messages with attachments.\n`embed` - Deletes only messages with embeds.\n`with <text>` - Deletes only messages that contain the specified text.",
    },
    cry: {
      no_user: "{user.username} is sad 😢",
      user: "{author.username} Is sad with {user.username} 😢",
    },
    daily: {
      sucess: "Daily Reward Claimed **{total}**",
      wait: "**🎁 |** You already claimed your daily reward, you have to wait **{duration}**",
    },
    divorce: {
      nothing: "**:grey_exclamation: |** You are not married to anyone :(",
      sucess: "Has divorced you from {esposa.tag}",
    },
    dm: {
      description:
        "**Description**: Command: write a private message to a user\n[] Required",
      field: {
        title: "**Use**",
        description: "dm [@user] [text]",
      },
      field2: {
        title: "**Example**",
        description: "dm <@614957978675838976> Hello:grinning:",
      },
      field3: {
        title: "Content",
        footer: "Sent Form: {guild.name}",
      },
      sucess: "**MD sent successfully**",
    },
    gamble: {
      no_quantity:
        "Please specify a number greater than or equal to the credits you have or `all` to bet all your credits.",
      insufficient_money: "You do not have enough money, you occupy: $**50**",
      success: "Congratulations, you kept your credits and you won: {all}!",
      unsuccess: "You lost {all} credits :(",
      no_number: "You must enter a number",
      minimum: "The minimum to bet is $**50**",
      bit: "You cannot bet so little, you occupy: $**50**",
    },
    hug: {
      himself: "{user.username} He hugged himself",
      another_person: "{author.username} Hug to {user.username}",
    },
    inventory: {
      oro: "You don't have any items in your inventory, go mining or exploring.",
      inv: "Inventory form {user.username}",
    },
    kick: {
      no_args: "**:grey_exclamation: |** Provide a person to eject.",
      no_user:
        "**:grey_exclamation: |** Could not find that member, try again.",
      yourself: "**:grey_exclamation: |** You can't kick yourself out ...",
      kickable: "**:grey_exclamation: |** I cannot kick the mentioned user.",
      sucess: "{user.tag} He was kicked off the server, reason: {reason}.",
    },
    kill: {
      himself: "{user.username} He killed himself",
      another_person: "{author.username} Killed to {user.username}",
    },
    kiss: {
      yourself: "**:grey_exclamation:** | You can't kiss, it's impossible ..",
      sucess: "**{author.username}** He kiss {user.username}",
    },
    love: {
      bot: "A bot has no feelings.",
      relations: "RELATIONS",
    },
    marry: {
      already_married: "You are already married to {esposaTag}",
      bot: "You can't marry a bot ..",
      yourself: "You can't marry yourself ..",
      another_married: "That user is already married.",
      request:
        ":mega:**{user.username}** write **yes** or **no** to respond to the marriage proposal of **{author.username}**\n:stopwatch: This expires in 2 minutes.",
      success: "💍 Congratulations! ${author.username} and ${user.username} are now officially married! 🎉",
      unsucess: "Uhh, {user.username} I cruelly reject you {author.username}",
      expired: "**{user.username}** did not answer, the wait is over",
      errorSaving: "❌ Oops! Something went wrong while saving the marriage. Try again later.",
    },
    mute: {
      no_user: `You need to mention the user you want to mute, you also need to set the time:
\`\`\`prolog
S => For milliseconds.
s => For seconds.
m => For minutes.
H or h => For hours.
D or d => For days.
W or w => For weeks.
M => For months.
\`\`\``,
      no_time: `You need to set the time:
\`\`\`prolog
S => For milliseconds.
s => For seconds.
m => For minutes.
H or h => For hours.
D or d => For days.
W or w => For weeks.
M => For months.
\`\`\``,
      invalid_format: "Invalid format, be sure to put the correct time.",
      already_muted: "This user is currently already muted.",
      highest:
        "This role is higher (as far as a hierarchy is concerned) so I can't add it to this user",
      sucess: "{user.tag} Has been silenced by: {by} reason: {reason}",
      himself: "You can't silence yourself/You can't silence me.",
      muteembed: {
        description: "Mute executed by",
        user: "Silenced User",
        in: "Muted in",
        date: "Date",
        by: "By",
        reason: "Reason",
      },
    },
    move: {
      disconnected: "**:grey_exclamation: |** I'm not inside a voice channel",
      already_connected:
        "**:grey_exclamation: |** I'm already connected to this voice channel",
      sucess: "**:grey_exclamation: |** I have moved to",
    },
    pause: {
      alreadyPaused: "The music is already paused",
      sucess: "Current song paused.",
    },
    play: {
      no_args: "🚫 You must enter something to search",
      embed: {
        title:
          "Selection of songs. Write the number that precedes the song number",
        footer: "\nThis operation expires in 60 seconds. By: {author.username}",
        nowPlaying: "Playing now",
        time: "Duration",
        channel: "Channel",
      },
      couldNotGetVideo: "Could not get the video.",
      expired: "The wait is over, canceling selection.",
      invalidArgs: "No song with the name {searchString} was found.",
      addQueue: "Added to queue",
      error: "An error has occurred please contact an developer, {url}",
      playlistAdded: "Playlist: **{title}** has been added to the queue!",
    },
    punch: {
      no_user: "**{user.username}** he was hit himself ...",
      user: "**{author.username}** hit {user.username}",
    },
    queue: {
      embed: {
        title: "Playlist of {guild.name}",
        description: "{i}.[{title}]({url})\n👤 By: **{author.username}**",
      },
      max: "Page {seleccion} does not exist",
      page: "Page {seleccion} of {page}",
    },
    stats: {
      statistics: "Statistics",
      owner: "Owner",
      guilds: "Guilds",
      users: "Users",
      channels: "Channels",
      commands: "Commands",
      events: "Events",
      uptime: "Uptime",
      connections: "voice Connections",
      version: "Version",
      usage: "Memory Usage",
    },
  },
  events: {
    message: {
      isMentioned: {
        field1: "> To get the list of commands.",
        field2: "Support",
        footer: "Created By Theangel256 Studios V",
        invite: "Invite",
      },
      ant: {
        warn: "invite posted",
        author: "User",
        reason: "**Reason:**",
        warns: "Number of Warnings",
        moderator: "Responsible moderator",
        warned: "{author.tag} Has been warned",
      },
    },
  },
  language: {
    sucess: "**:grey_exclamation: |** Language set to English",
    enterokay:
      "**:grey_exclamation: |** You must enter a language, `es`: Spanish or `en`: English.",
    has: "**:grey_exclamation: |** It must be `es` or `en`.",
  },
  permissions: {
    member: {
      BAN_MEMBERS:
        "**:grey_exclamation: |** You don't have permissions. `Ban Members`",
      MANAGE_MESSAGES:
        "**:grey_exclamation: |** You don't have permissions. `Manage Messages`",
      KICK_MEMBERS:
        "**:grey_exclamation: |** You don't have permissions. `Kick Members`",
    },
    me: {
      BAN_MEMBERS:
        "**:grey_exclamation: |** Sorry, but I don't have permissions. `Ban Members`",
      MANAGE_MESSAGES:
        "**:grey_exclamation: |** Sorry, but I don't have permissions. `Manage Messages`",
      KICK_MEMBERS:
        "**:grey_exclamation: |** Sorry, but I don't have permissions. `Kick Members`",
    },
  },
  music: {
    noQueue: "There is no song! The queue is empty.",
    needJoin: "You must join a voice channel.",
    alreadyPlaying: "The music is already playing in {channel}.",
  },
};
