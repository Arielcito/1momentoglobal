import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StreamChat, Channel } from 'stream-chat';

interface ChatConfig {
  userName: string;
  streamId: string;
}

interface ChatResponse {
  client: StreamChat;
  channel: Channel;
}

const initializeChat = async ({ userName, streamId }: ChatConfig): Promise<ChatResponse> => {
  const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
  
  await client.connectUser(
    {
      id: userName,
      name: userName,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
    },
    client.devToken(userName)
  );

  const channel = client.channel('livestream', streamId, {
    name: `Stream ${streamId}`,
    created_by: { id: userName },
    image: `https://ui-avatars.com/api/?name=Stream+${streamId}`,
  });

  await channel.watch();

  return { client, channel };
};

export const useChat = ({ userName, streamId }: ChatConfig) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['chat', userName, streamId],
    queryFn: () => initializeChat({ userName, streamId }),
    staleTime: Infinity,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      if (!data?.channel) throw new Error('Channel not initialized');
      return data.channel.sendMessage({ text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', streamId] });
    },
  });

  return {
    chatClient: data?.client,
    channel: data?.channel,
    isLoading,
    error,
    sendMessage,
  };
};
