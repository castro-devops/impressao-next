// app/api/v1/cloud/sendMessage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json(); // Certificando-se de que o JSON está sendo processado corretamente.
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await axios.post(telegramUrl, {
        chat_id: chatId,
        text: message,
      });
      return NextResponse.json({ message: 'Message sent to Telegram', data: response.data }, { status: 200 });
    } catch (error) {
      console.error('Failed to send message to Telegram:', error);
      return NextResponse.json({ error: 'Failed to send message to Telegram', details: error }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return NextResponse.json({ error: 'Failed to parse JSON', details: error }, { status: 400 });
  }
}
