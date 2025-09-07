import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Eye, 
  Clock,
  User,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { listContacts, updateContactStatus, deleteContact } from '@/lib/contacts';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read';
}

const ContactInbox = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const docs: any[] = await listContacts();
      const mapped = docs.map((d) => ({
        id: d.$id,
        fullName: d.fullName,
        email: d.email,
        subject: d.subject,
        category: d.category,
        message: d.message,
        timestamp: d.timestamp || d.$createdAt,
        status: (d.status as 'new' | 'read') || 'new',
      }));
      setMessages(mapped);
    } catch (error) {
      console.error('ContactInbox: Failed to load from Appwrite:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateContactStatus(id, 'read');
      await loadMessages();
      toast({ title: 'Message marked as read' });
    } catch (e) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteContact(id);
      await loadMessages();
      toast({ title: 'Message deleted' });
    } catch (e) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      markAsRead(message.id);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'amnewsworld': 'bg-blue-100 text-blue-700',
      'amniva': 'bg-purple-100 text-purple-700',
      'amn-news-radio': 'bg-green-100 text-green-700',
      'amnet': 'bg-orange-100 text-orange-700',
      'general': 'bg-gray-100 text-gray-700',
      'support': 'bg-red-100 text-red-700',
      'partnership': 'bg-yellow-100 text-yellow-700'
    };
    
    return (
      <Badge className={colors[category] || 'bg-gray-100 text-gray-700'}>
        {category.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'all') return true;
    return msg.status === activeTab;
  });

  const unreadCount = messages.filter(msg => msg.status === 'new').length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Contact Inbox
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white ml-2">{unreadCount}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage contact form submissions and user inquiries ({messages.length} total)
              </CardDescription>
            </div>
            <Button onClick={loadMessages} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
              <TabsTrigger value="new">
                Unread ({messages.filter(m => m.status === 'new').length})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({messages.filter(m => m.status === 'read').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">
                    {messages.length === 0 ? 'No contact messages yet' : 'No messages in this category'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Messages will appear here when users submit the contact form
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={message.status === 'new' ? 'bg-blue-50' : ''}>
                        <TableCell>
                          {message.status === 'new' ? (
                            <Mail className="text-blue-600" size={16} />
                          ) : (
                            <MailOpen className="text-gray-400" size={16} />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className={message.status === 'new' ? 'font-semibold' : ''}>{message.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{message.email}</span>
                        </TableCell>
                        <TableCell>
                          <span className={message.status === 'new' ? 'font-semibold' : ''}>{message.subject}</span>
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(message.category)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={12} />
                            {new Date(message.timestamp).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewMessage(message)}
                                >
                                  <Eye size={14} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    {message.subject}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <strong>From:</strong> {message.fullName}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {message.email}
                                    </div>
                                    <div>
                                      <strong>Category:</strong> {getCategoryBadge(message.category)}
                                    </div>
                                    <div>
                                      <strong>Date:</strong> {new Date(message.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <strong>Message:</strong>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                      {message.message}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {message.status === 'new' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(message.id)}
                              >
                                <MailOpen size={14} />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInbox;
