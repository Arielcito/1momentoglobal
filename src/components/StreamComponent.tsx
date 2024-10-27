"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Messages from "./Messages";
import { Button } from "@/components/ui/button";
import { Channel, Chat } from "stream-chat-react";
import { Textarea } from "@/components/ui/textarea";
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useChat } from "@/hooks/useChat";

import 'stream-chat-react/dist/css/v2/index.css';

interface StreamComponentProps {
  streamId: string;
  userName: string;
}

export default function StreamComponent({ streamId, userName }: StreamComponentProps) {
    const router = useRouter();
    const [messageText, setMessageText] = useState('');
    console.log("userName", userName);
    const {
      chatClient,
      channel,
      isLoading: isChatLoading,
      error: chatError,
      sendMessage,
    } = useChat({ userName, streamId });

    const apiKey = "aym7aqj4n4vf";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTcyOTk5NTUzNiwiZXhwIjoxNzMwMDgxOTM2LCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbV81NDdkNGIwOC0zYWZlLTQxMmMtYmU0MC0wOGFiMWI3Njc4Y2IiXX0._oQXOprKofatguMUXQwpxQABqk-2PjnuCzxRVinL14A";
    const callId = "livestream_547d4b08-3afe-412c-be40-08ab1b7678cb";

    const user: User = { id: 'userName', name: userName, type: 'guest' };
    const videoClient = new StreamVideoClient({ apiKey, user, token });

    const handleSendMessage = async () => {
      if (!messageText.trim()) return;
      
      try {
        await sendMessage.mutateAsync({ text: messageText });
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 bg-background border-b">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/home')}
                    className="flex items-center gap-2"
                    aria-label="Volver al dashboard"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al dashboard
                </Button>
            </div>
            <div className="flex flex-1">
                <div className="w-3/4 bg-black relative">
                    <StreamVideo client={videoClient}>
                        <LivestreamPlayer callType="livestream" callId={callId} />
                    </StreamVideo>
                </div>
                <div className="w-1/4 p-4 bg-white">
                    <div className="flex flex-col h-full">
                        <span className="border-b border-gray-100 font-semibold mb-4">Chat</span>
                        {isChatLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Cargando chat...</p>
                            </div>
                        ) : chatError ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-red-500">Error al cargar el chat</p>
                            </div>
                        ) : chatClient && channel ? (
                            <Chat client={chatClient}>
                                <Channel channel={channel}>
                                    <Messages />
                                </Channel>
                            </Chat>
                        ) : null}
                        <div className="mt-auto">
                            <Textarea
                                id="message_text"
                                name="message_text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="min-h-[100px] w-full mb-2"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button 
                                className="w-full"
                                onClick={handleSendMessage}
                                disabled={sendMessage.isPending}
                            >
                                {sendMessage.isPending ? 'Enviando...' : 'Enviar mensaje →'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
