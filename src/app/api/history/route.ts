import { NextRequest, NextResponse } from "next/server";
import { listUserChats, deleteUserChat } from "@/services/ai-chat.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (chatId) {
      const { getChatMessages } = await import("@/services/ai-chat.service");
      const messages = await getChatMessages(chatId);
      return NextResponse.json({ messages });
    }

    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listUserChats(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => null);
      id = body?.id;
    }

    if (!id) {
      return new NextResponse("Missing chat id", { status: 400 });
    }

    const success = await deleteUserChat(id);
    if (!success) {
      return new NextResponse("Failed to delete chat", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
