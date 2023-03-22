const { Kafka } = require("kafkajs");
const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();

const kafkaClientId = process.env.KAFKA_CLIENT_ID;
const kafkaBrokers = process.env.KAFKA_BROKERS.split(",");
const kafkaTopic = process.env.KAFKA_TOPIC;
const kafkaConsumerGroup = process.env.KAFKA_CONSUMER_GROUP;

const telegramToken = process.env.TELEGRAM_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

const kafka = new Kafka({
    clientId: kafkaClientId,
    brokers: kafkaBrokers,
});

const telegram = new TelegramBot(telegramToken, { polling: false });

const consumer = kafka.consumer({ groupId: kafkaConsumerGroup });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
                timestamp: new Date(message.timestamp).toISOString(),
                topic,
                partition,
                offset: message.offset,
            });

            try {
                await telegram.sendMessage(telegramChatId, message.value.toString());
            } catch (error) {
                console.error("Error sending message to Telegram:", error);
            }
        },
    });
};

run().catch(console.error);
