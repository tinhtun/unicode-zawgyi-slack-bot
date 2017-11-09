"use strict";

module.exports = {isZawgyi, isUnicode, listenRtmMessage};

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var Rabbit = require('rabbit-node');
var Knayi = require('knayi-myscript');

function isZawgyi(input) {
    return Knayi.fontDetect(input) == 'zawgyi';
}

function isUnicode(input) {
    return Knayi.fontDetect(input) == 'unicode';
}

function listenRtmMessage() {
    console.log("Initializing RtmClient...")
    var rtm = new RtmClient(bot_token);
    rtm.start();
    console.log("RtmClient started.")

    rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
      var inputText = message.text || '';
      if (isZawgyi(inputText)) {
        rtm.sendMessage(Rabbit.zg2uni(inputText), message.channel);
      } else if (isUnicode(inputText)) {
        rtm.sendMessage(Rabbit.uni2zg(inputText), message.channel);
      }
    });

    console.log("RtmClient listening messages.")    
}

