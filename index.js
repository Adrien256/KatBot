const dotenv = require('dotenv');
const Discord = require('discord.js');
const discordTTS = require('discord-tts');
const { GatewayIntentBits, ActivityType, Partials } = require('discord.js');
const {AudioPlayer, createAudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require("@discordjs/voice");
const { Player } = require("discord-player");

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
    // attempts to reset disconnect timer
    clearTimeout(timeoutID);
    timeoutID = undefined;
    // make sure the message author is not KatBot
    if (!message.author.bot){
    try{
        // get and save message sender ID
        var senderID = message.author.id;
        
        // find channel ID
        KatBot.guilds.cache.get(myGuildID).members.fetch(senderID)
            .then((memberID) =>{
                timeoutID = undefined;
                // check if user is in a voice channel
                myChannelID = memberID.voice.channelId;
                if (myChannelID == null){
                    memberID.send("KatBot needs you to be in a voice channel to play a message. Please join a voice channel and try again.");
                }
                // check if message is too small
                else if(message.content.length < 1){
                    memberID.send("KatBot cannot play a message that short. Try a longer message (1+ letters).");
                }
                // play tts into a channel
                else{
                    // joins a channel and plays the message
                    const stream = discordTTS.getVoiceStream(message.content);
                    const audioResource=createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});

                    // join the channel
                    voiceConnection = joinVoiceChannel({
                        channelId: myChannelID,
                        guildId: myGuildID,
                        adapterCreator: (KatBot.guilds.cache.get(myGuildID)).voiceAdapterCreator,
                    });

                    // play the tts
                    if(voiceConnection.status===VoiceConnectionStatus.Connected){
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