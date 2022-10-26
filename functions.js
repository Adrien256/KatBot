const { createAudioResource, StreamType } = require("@discordjs/voice");
const discordTTS = require('discord-tts');

const memberCheck = (memberID) => {
    memberID.send("KatBot needs you to be in a voice channel to play a message. Please join a voice channel and try again.");
};

const loadSound = ((message) => {
    // attach actual sound to return value
    var audioResourceReturnValue;
    if (message.content.startsWith("!meow")){
        audioResourceReturnValue = createAudioResource('./soundclips/catmeow.mp3');
    }
    else if (message.content.startsWith("!bark")){
        audioResourceReturnValue = createAudioResource('./soundclips/dogbark.mp3');
    }
    else if (message.content.startsWith("!johncena")){
        audioResourceReturnValue = createAudioResource('./soundclips/johncena.mp3');
    }
    else if (message.content.startsWith("!bombplanted")){
        audioResourceReturnValue = createAudioResource('./soundclips/bombplanted.mp3');
    }
    else if (message.content.startsWith("!bombdefused")){
        audioResourceReturnValue = createAudioResource('./soundclips/bombdefused.mp3');
    }
    else if (message.content.startsWith("!longbark")){
        audioResourceReturnValue = createAudioResource('./soundclips/dogbarklong.mp3');
    }
    else if (message.content.startsWith("!bubbachainsaw")){
        audioResourceReturnValue = createAudioResource('./soundclips/bubba.mp3');
    }
    else if (message.content.startsWith("!exposedDBD")){
        audioResourceReturnValue = createAudioResource('./soundclips/exposed.mp3');
    }
    else if (message.content.startsWith("!michaelT2")){
        audioResourceReturnValue = createAudioResource('./soundclips/evilwithin2.mp3');
    }
    else if (message.content.startsWith("!disappointing")){
        audioResourceReturnValue = createAudioResource('./soundclips/disappointing.mp3');
    }
    else if (message.content.startsWith("!illegal")){
        audioResourceReturnValue = createAudioResource('./soundclips/illegal.mp3');
    }
    else if (message.content.startsWith("!incoming")){
        audioResourceReturnValue = createAudioResource('./soundclips/incoming.mp3');
    }
    else if (message.content.startsWith("!leave")){
        audioResourceReturnValue = createAudioResource('./soundclips/leave.mp3');
    }
    else if (message.content.startsWith("!letmein")){
        audioResourceReturnValue = createAudioResource('./soundclips/letmein.mp3');
    }
    else if (message.content.startsWith("!applause")){
        audioResourceReturnValue = createAudioResource('./soundclips/applause.mp3');
    }
    else if (message.content.startsWith("!endcareer")){
        audioResourceReturnValue = createAudioResource('./soundclips/endcareer.mp3');
    }
    else if (message.content.startsWith("!join")){
        audioResourceReturnValue = createAudioResource('./soundclips/join.mp3');
    }
    else if (message.content.startsWith("!hellojohncena")){
        audioResourceReturnValue = createAudioResource('./soundclips/hello.mp3');
    }
    else if (message.content.startsWith("!")){
        message.author.send("\"!\" command not recognized! DM me \"!help\" for all valid commands.");
        audioResourceReturnValue = createAudioResource('./soundclips/nothing.mp3');
    }
    else{
        var stream = discordTTS.getVoiceStream(message.content);
        audioResourceReturnValue = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
    }
    return audioResourceReturnValue;
});

const help = ((message) => {
    message.author.send("KatBot will play your DM in anonymous text to speech in whatever voice channel you are currently in.\nIf you want to play a sound clip instead here is what is currently supported:\n\n!meow\n!bark\n!longbark\n!johncena\n!bombplanted\n!bombdefused\n!bubbachainsaw\n!exposedDBD\n!michaelT2\n!applause\n!disappointing\n!illegal\n!incoming\n!leave\n!join\n!letmein\n!endcareer\n!hellojohncena\n\nDM KatBot with one of the above commands.");
});

exports.memberCheck = memberCheck;
exports.loadSound = loadSound;
exports.help = help;
