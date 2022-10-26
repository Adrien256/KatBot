const dotenv = require('dotenv');
const Discord = require('discord.js');
const { GatewayIntentBits, ActivityType, Partials } = require('discord.js');
const {AudioPlayer, VoiceConnectionStatus, joinVoiceChannel} = require("@discordjs/voice");
const { Player } = require("discord-player");
const functions = require('./functions');

// loading environment variables
dotenv.config();
const TOKEN = process.env.TOKEN;

// index.js variables
var timeoutID;
var myGuildID = "1024471200954581012";
var myChannelID;
var voiceConnection;
var audioPlayer = new AudioPlayer();

// init client and set intents

const KatBot = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.DirectMessageReactions, 
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

KatBot.player = new Player(KatBot, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

// code goes here

KatBot.on("ready", () => {
    // see if bot is online in console
    console.log('KatBot online');
    KatBot.user.setUsername("KatBot");
    // set bot status
    KatBot.user.setPresence({
        // activities: [{name: `Dead by Daylight`, type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=khGttDMZwDE"}],
        status: 'dnd'
    });
});


KatBot.on("messageCreate", async(message) => {
    // get sender ID
    var senderID = message.author.id;
    // if bot received !help command
    if (message.content.startsWith("!help")){
        functions.help(message);
    }
    // otherwise just play the message
    // make sure the message author is not KatBot
    else if (!message.author.bot){
    try{
        // find channel ID
        KatBot.guilds.cache.get(myGuildID).members.fetch(senderID)
            .then((memberID) =>{
                // check if user is in a voice channel
                myChannelID = memberID.voice.channelId;
                if (myChannelID == null){
                    functions.memberCheck(memberID);
                }
                // check if message is too small
                else if(message.content.length < 1){
                    memberID.send("KatBot cannot play a message that short. Try a longer message (1+ chars).");
                }
                // check if message is too long
                else if(message.content.length > 200){
                    memberID.send("KatBot cannot play a message that long. Try a smaller message (under 200 char). Your previous message had a length of " + message.content.length + " chars.");
                }
                // play tts into a channel
                else{
                    // attempts to reset disconnect timer
                    clearTimeout(timeoutID);
                    timeoutID = undefined;
                    // load the sound to be played into audioResource
                    var audioResource;
                    audioResource = functions.loadSound(message);
 
                    // join the channel
                    voiceConnection = joinVoiceChannel({
                        channelId: myChannelID,
                        guildId: myGuildID,
                        adapterCreator: (KatBot.guilds.cache.get(myGuildID)).voiceAdapterCreator,
                    });

                    // play the audioResource
                    if(voiceConnection.status === VoiceConnectionStatus.Connected){
                        voiceConnection.subscribe(audioPlayer);
                        audioPlayer.play(audioResource);
                    } 
                    // start timer to disconnect from channel (set to 3 minutes)
                    timeoutID = setTimeout(() => {
                        voiceConnection.disconnect();
                      }, 5 * 60 * 1000); 
                }
            });       
    }
    catch(error){
        console.log(error);
    }
}
});



KatBot.login(TOKEN);