
import React, { useState, useEffect, useRef } from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Search, Star, Send, Phone, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Message, Profile } from "@/types/database";
import { format } from 'date-fns';

interface ConversationWithProfile extends Message {
  profiles: Profile;
  is_sender: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<ConversationWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch conversations (unique users who have exchanged messages with the current user)
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get unique profiles that the current user has exchanged messages with
        const { data: sentMessages, error: sentError } = await supabase
          .from('messages')
          .select('recipient_id')
          .eq('sender_id', user.id);
          
        const { data: receivedMessages, error: receivedError } = await supabase
          .from('messages')
          .select('sender_id')
          .eq('recipient_id', user.id);
          
        if (sentError || receivedError) {
          throw new Error('Failed to fetch conversations');
        }
        
        // Combine unique user IDs
        const uniqueUserIds = new Set([
          ...(sentMessages?.map(msg => msg.recipient_id) || []),
          ...(receivedMessages?.map(msg => msg.sender_id) || [])
        ]);
        
        // Filter out the current user's ID
        const otherUserIds = Array.from(uniqueUserIds).filter(id => id !== user.id);
        
        // Fetch profiles for these users
        if (otherUserIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', otherUserIds);
            
          if (profilesError) {
            throw profilesError;
          }
          
          setConversations(profiles || []);
          
          // If there are conversations, select the first one
          if (profiles && profiles.length > 0) {
            setSelectedProfile(profiles[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Failed to load conversations",
          description: "There was an error loading your message history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]);
  
  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedProfile) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            profiles:sender_id (*)
          `)
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedProfile.id}),and(sender_id.eq.${selectedProfile.id},recipient_id.eq.${user.id})`)
          .order('created_at');
          
        if (error) {
          throw error;
        }
        
        // Add an is_sender flag to each message
        const formattedMessages = data?.map(msg => ({
          ...msg,
          is_sender: msg.sender_id === user.id
        })) || [];
        
        setMessages(formattedMessages);
        
        // Mark received messages as read
        if (data) {
          const unreadMessageIds = data
            .filter(msg => msg.recipient_id === user.id && !msg.read)
            .map(msg => msg.id);
            
          if (unreadMessageIds.length > 0) {
            await supabase
              .from('messages')
              .update({ read: true })
              .in('id', unreadMessageIds);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, [user, selectedProfile]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (profile: Profile) => {
    setSelectedProfile(profile);
  };
  
  const handleSendMessage = async () => {
    if (!user || !selectedProfile || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedProfile.id,
          content: newMessage.trim(),
          read: false
        });
        
      if (error) {
        throw error;
      }
      
      // Add the new message to the UI optimistically
      const newMsg: ConversationWithProfile = {
        id: 'temp-' + Date.now(),
        sender_id: user.id,
        recipient_id: selectedProfile.id,
        content: newMessage.trim(),
        read: false,
        created_at: new Date().toISOString(),
        profiles: {
          id: user.id,
          first_name: user.name?.split(' ')[0] || '',
          last_name: user.name?.split(' ')[1] || '',
          phone: null,
          avatar_url: null,
          role: 'staff',
          created_at: '',
          updated_at: ''
        },
        is_sender: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedProfile.first_name} ${selectedProfile.last_name}.`
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Format time for message timestamp
  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };
  
  // Generate initials from name
  const getInitials = (profile: Profile) => {
    if (!profile) return '';
    const first = profile.first_name ? profile.first_name.charAt(0).toUpperCase() : '';
    const last = profile.last_name ? profile.last_name.charAt(0).toUpperCase() : '';
    return first + last;
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-full">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-alma-gold" />
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="space-y-2">
                    {conversations.map((profile) => (
                      <div
                        key={profile.id}
                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                          selectedProfile?.id === profile.id ? "bg-alma-gold/10" : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleSelectConversation(profile)}
                      >
                        <Avatar>
                          <AvatarImage src={profile.avatar_url || ''} />
                          <AvatarFallback className={selectedProfile?.id === profile.id ? "bg-alma-gold/20 text-alma-gold" : ""}>
                            {getInitials(profile)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">
                              {profile.first_name} {profile.last_name}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {profile.role === 'user' ? 'Customer' : profile.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40 text-center">
                    <p className="text-muted-foreground">
                      No conversations yet.<br />
                      Start a new message to connect with clients.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {selectedProfile ? (
                <>
                  <CardHeader className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedProfile.avatar_url || ''} />
                          <AvatarFallback className="bg-alma-gold/20 text-alma-gold">
                            {getInitials(selectedProfile)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-md font-medium">
                            {selectedProfile.first_name} {selectedProfile.last_name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground capitalize">
                            {selectedProfile.role === 'user' ? 'Customer' : selectedProfile.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.length > 0 ? (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.is_sender ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.is_sender
                                  ? "bg-alma-gold/10 text-alma-gold/90"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs text-right mt-1 text-muted-foreground">
                                {formatMessageTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-center items-center h-40">
                          <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                  
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="min-h-[60px]"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="bg-alma-gold hover:bg-alma-gold/90 text-white h-[60px]" 
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-2">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="text-lg font-medium">No conversation selected</p>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list or start a new one
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default Messages;
