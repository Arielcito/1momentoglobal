"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Messages from "./Messages";
import { Button } from "@/components/ui/button";
import { Channel, Chat } from "stream-chat-react";
import { Textarea } from "@/components/ui/textarea";
import { StreamChat } from 'stream-chat';
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";

interface StreamComponentProps {
  streamId: string;
  userName: string;
}

export default function StreamComponent({ streamId, userName }: StreamComponentProps) {
    const router = useRouter();
    const [channel, setChannel] = useState<any>(null);
    const [chatClient, setChatClient] = useState<any>(null);

    useEffect(() => {
        const initChat = async () => {
            const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
            await client.connectUser(
                {
                    id: userName,
                    name: userName,
                },
                client.devToken(userName)
            );

            const channel = client.channel('livestream', streamId, {
                name: `Stream ${streamId}`,
                created_by: { id: userName },
            });

            await channel.watch();

            setChatClient(client);
            setChannel(channel);
        };

        initChat();

        return () => {
            if (chatClient) chatClient.disconnectUser();
        };
    }, [streamId, userName]);

    const apiKey = "aym7aqj4n4vf";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTcyOTk5NTUzNiwiZXhwIjoxNzMwMDgxOTM2LCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbV81NDdkNGIwOC0zYWZlLTQxMmMtYmU0MC0wOGFiMWI3Njc4Y2IiXX0._oQXOprKofatguMUXQwpxQABqk-2PjnuCzxRVinL14A";
    const callId = "livestream_547d4b08-3afe-412c-be40-08ab1b7678cb";

    const user: User = { id: 'guest', name: 'Guest', type: 'guest' };
    const videoClient = new StreamVideoClient({ apiKey, user, token });

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
                        {channel && (
                            <Chat client={chatClient}>
                                <Channel channel={channel}>
                                    <Messages />
                                </Channel>
                            </Chat>
                        )}
                        <div className="mt-auto">
                            <Textarea
                                id="message_text"
                                name="message_text"
                                placeholder="Message..."
                                className="min-h-[100px] w-full mb-2"
                            />
                            <Button className="w-full">
                                Send Message →
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
