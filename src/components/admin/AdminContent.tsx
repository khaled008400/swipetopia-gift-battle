
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash, Plus, Search, Filter, AlertTriangle } from 'lucide-react';

const AdminContent: React.FC = () => {
  const [videoContent, setVideoContent] = useState([
    { id: 1, title: 'Summer Dance Tutorial', creator: 'dancer_jane', duration: '3:45', category: 'Tutorial', views: 12500, status: 'published', date: '2023-06-12' },
    { id: 2, title: 'Rock Guitar Solo', creator: 'guitarist_mike', duration: '2:30', category: 'Performance', views: 8900, status: 'published', date: '2023-06-10' },
    { id: 3, title: 'Cooking with Chef Mario', creator: 'chef_mario', duration: '15:20', category: 'Food', views: 5600, status: 'published', date: '2023-06-09' },
    { id: 4, title: 'Fashion Week Highlights', creator: 'fashion_sara', duration: '8:15', category: 'Fashion', views: 7200, status: 'flagged', date: '2023-06-08' },
    { id: 5, title: 'Extreme Sports Compilation', creator: 'extreme_joe', duration: '4:50', category: 'Sports', views: 9800, status: 'review', date: '2023-06-07' },
  ]);
  
  const [textContent, setTextContent] = useState([
    { id: 1, title: 'Community Guidelines', author: 'admin', type: 'Policy', status: 'published', lastUpdated: '2023-05-15' },
    { id: 2, title: 'Terms of Service', author: 'legal_team', type: 'Legal', status: 'published', lastUpdated: '2023-04-20' },
    { id: 3, title: 'Creator Monetization Guide', author: 'creator_support', type: 'Guide', status: 'published', lastUpdated: '2023-06-01' },
    { id: 4, title: 'Platform Update Announcement', author: 'product_team', type: 'Announcement', status: 'draft', lastUpdated: '2023-06-10' },
  ]);
  
  // Status badge component with appropriate color
  const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    
    switch(status) {
      case 'published':
        color = 'bg-green-100 text-green-800';
        break;
      case 'draft':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'review':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'flagged':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-blue-100 text-blue-800';
        break;
    }
    
    return (
      <Badge className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="videos">
            <TabsList className="mb-4">
              <TabsTrigger value="videos">Video Content</TabsTrigger>
              <TabsTrigger value="textual">Textual Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search videos..." className="pl-8 w-[300px]" />
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </div>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Video
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videoContent.map(video => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.creator}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>{video.category}</TableCell>
                        <TableCell>{video.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={video.status} />
                        </TableCell>
                        <TableCell>{video.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {video.status === 'flagged' && (
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-amber-600 border-amber-600 hover:bg-amber-50">
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="textual">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search content..." className="w-[300px]" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" /> New Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Content</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" placeholder="Content title" className="col-span-3" />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Content Type</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="policy">Policy</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="guide">Guide</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Create Content</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {textContent.map(content => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>{content.author}</TableCell>
                      <TableCell>{content.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={content.status} />
                      </TableCell>
                      <TableCell>{content.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-50">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContent;
