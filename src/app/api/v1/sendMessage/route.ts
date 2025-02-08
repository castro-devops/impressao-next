import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const KEY_API = process.env.TELEGRAM_BOT_TOKEN;
  const telegramUrl = `https://api.telegram.com/bot${KEY_API}/sendMessage`;

  const message = 'Olá mundo reverso';

  const response = await axios.post(telegramUrl, {
    chat_id: CHAT_ID,
    text: message
  });

  
}