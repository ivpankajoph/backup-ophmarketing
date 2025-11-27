import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User, Bot, RefreshCw, Phone } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  type: string;
  direction: 'inbound' | 'outbound';
  timestamp: string;
  agentId?: string;
}

interface Conversation {
  senderId: string;
  senderName: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
}

export default function WhatsAppInbox() {
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { data: conversations = [], isLoading, refetch } = useQuery<Conversation[]>({
    queryKey: ['whatsapp-conversations'],
    queryFn: api.whatsapp.getConversations,
    refetchInterval: 10000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ to, message }: { to: string; message: string }) =>
      api.whatsapp.sendMessage(to, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-conversations'] });
      toast.success('Message sent');
      setNewMessage('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const selectedChat = conversations.find((c) => c.senderId === selectedConversation);

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    sendMessageMutation.mutate({ to: selectedConversation, message: newMessage });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Inbox</h1>
          <p className="text-muted-foreground">View and respond to WhatsApp messages</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-80px)]">
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Conversations ({conversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Messages will appear here when received via WhatsApp webhook
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.senderId}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                        selectedConversation === conv.senderId ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv.senderId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.senderName}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-3 border-b">
            {selectedChat ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedChat.senderName}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {selectedChat.senderId}
                  </div>
                </div>
              </div>
            ) : (
              <CardTitle className="text-lg text-muted-foreground">
                Select a conversation
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            {selectedChat ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedChat.messages.map((msg, index) => {
                      const showDate =
                        index === 0 ||
                        formatDate(selectedChat.messages[index - 1].timestamp) !==
                          formatDate(msg.timestamp);
                      return (
                        <div key={msg.id || index}>
                          {showDate && (
                            <div className="text-center my-4">
                              <Badge variant="secondary" className="text-xs">
                                {formatDate(msg.timestamp)}
                              </Badge>
                            </div>
                          )}
                          <div
                            className={`flex ${
                              msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.direction === 'outbound'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {msg.direction === 'outbound' && msg.agentId && (
                                <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                                  <Bot className="h-3 w-3" />
                                  AI Response
                                </div>
                              )}
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.direction === 'outbound'
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
