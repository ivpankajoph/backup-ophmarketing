import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Paperclip, Send, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const chats = [
  { id: 1, name: "Alice Johnson", lastMessage: "Thanks for the update!", time: "10:30 AM", unread: 2, avatar: "AJ" },
  { id: 2, name: "Bob Smith", lastMessage: "When will the order ship?", time: "09:15 AM", unread: 0, avatar: "BS" },
  { id: 3, name: "Carol Williams", lastMessage: "Can I speak to an agent?", time: "Yesterday", unread: 1, avatar: "CW" },
  { id: 4, name: "David Brown", lastMessage: "Is this service available in...", time: "Yesterday", unread: 0, avatar: "DB" },
  { id: 5, name: "Eva Davis", lastMessage: "Refund processed.", time: "2 days ago", unread: 0, avatar: "ED" },
];

const messages = [
  { id: 1, sender: "them", text: "Hi, I have a question about my recent order.", time: "10:00 AM" },
  { id: 2, sender: "me", text: "Hello! I'd be happy to help. Can you provide your order number?", time: "10:02 AM" },
  { id: 3, sender: "them", text: "Sure, it's #12345.", time: "10:05 AM" },
  { id: 4, sender: "me", text: "Thanks, checking that for you now...", time: "10:06 AM" },
  { id: 5, sender: "me", text: "I see it has been shipped and will arrive by Friday.", time: "10:08 AM" },
  { id: 6, sender: "them", text: "Great, thanks for the update!", time: "10:30 AM" },
];

export default function Inbox() {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-in fade-in duration-500">
        {/* Chat List */}
        <div className="w-80 border-r border-border flex flex-col bg-background">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-9 bg-secondary/50" />
            </div>
            <div className="flex gap-2 mt-4">
              <Badge variant="default" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Unread</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Groups</Badge>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {chats.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`p-4 flex items-start gap-3 hover:bg-muted/50 cursor-pointer transition-colors ${chat.id === 1 ? 'bg-muted/50' : ''}`}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{chat.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat View */}
        <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-zinc-900 bg-opacity-50">
          {/* Chat Header */}
          <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">AJ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Alice Johnson</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Phone className="h-5 w-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-5 w-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
             <div className="space-y-4">
               {messages.map((msg) => (
                 <div 
                   key={msg.id} 
                   className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                 >
                   <div 
                     className={`
                       max-w-[70%] rounded-lg px-4 py-2 shadow-sm relative
                       ${msg.sender === 'me' 
                         ? 'bg-[#d9fdd3] dark:bg-primary/20 text-foreground rounded-tr-none' 
                         : 'bg-white dark:bg-card text-card-foreground rounded-tl-none'
                       }
                     `}
                   >
                     <p className="text-sm leading-relaxed">{msg.text}</p>
                     <span className="text-[10px] text-muted-foreground/80 block text-right mt-1">
                       {msg.time}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Smile className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="h-6 w-6" />
              </Button>
              <Input 
                placeholder="Type a message" 
                className="flex-1 bg-secondary/50 border-none focus-visible:ring-1" 
              />
              <Button size="icon" className="rounded-full h-10 w-10">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
