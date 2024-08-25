const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN } = require("./config");
const { v4: uuidv4 } = require("uuid");
const { insertUUID } = require("../DB/db");

// Initialize the bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to the UUID Generator Bot! 🤖\n\n" +
      "I can generate a unique UUID for you. To get started, just type `/create`.\n" +
      "You can also use `/help` to get more information about how to use the bot.",
    {
      reply_markup: {
        keyboard: [[{ text: "/create" }], [{ text: "/help" }]],
        one_time_keyboard: true,
      },
    }
  );
});

// Help message
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Here are the commands you can use:\n\n" +
      "/create - Generate a new UUID\n" +
      "/help - Get help about how to use this bot"
  );
});

// Create UUID and send link
bot.onText(/\/create/, (msg) => {
  const uuid = uuidv4();
  const chatId = msg.chat.id;

  // Insert UUID and chatID into the database
  insertUUID(uuid, chatId, (err) => {
    if (err) {
      bot.sendMessage(
        chatId,
        "🚨 Error: Could not save UUID to the database. or user already created the UUID"
      );
    } else {
      bot.sendMessage(
        chatId,
        `🎉 Your UUID has been generated! To view it, visit:\n` +
          `http://localhost:3000/link/${uuid}`
      );
    }
  });
});

module.exports = bot;
