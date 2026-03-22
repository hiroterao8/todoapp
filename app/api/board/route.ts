import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const BOARD_KEY = "suswork-board-v1";

const INITIAL_STATE = {
  lists: [
    { id: "list-1", name: "KEY MTG：全社" },
    { id: "list-2", name: "KEY MTG：田岡" },
    { id: "list-3", name: "KEY MTG：舘川" },
  ],
  cards: [],
};

export async function GET() {
  const data = await redis.get(BOARD_KEY);
  return NextResponse.json(data ?? INITIAL_STATE);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await redis.set(BOARD_KEY, body);
  return NextResponse.json({ ok: true });
}
