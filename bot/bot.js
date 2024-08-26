const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN } = require("./config");
// const { v4: uuidv4 } = require("uuid");
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
  const chatId = msg.chat.id;

  // Check and insert UUID into the database
  insertUUID(null, chatId, (err, row) => {
    if (err) {
      bot.sendMessage(
        chatId,
        "🚨 Error: Could not retrieve or save UUID to the database."
      );
    } else {
      bot.sendMessage(
        chatId,
        `🎉 Your UUID is ready! To view it, visit:\nhttps://telegram-bot-1-9vyi.onrender.com/link/${row.UUID}`
      );
    }
  });
});

module.exports = bot;
