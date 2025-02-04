// lib/telegram.ts
import axios from 'axios';

export const sendMessageToTelegram = async (message: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendPhotoToTelegram = async (fileId: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  
  try {
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      photo: fileId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending photo:', error);
    throw error;
  }
};
