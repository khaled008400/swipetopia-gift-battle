
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, FileText, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';

const AdminCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState([
    { 
      id: 1, 
      name: 'Summer Creator Challenge', 
      status: 'active', 
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-08-31'),
      participants: 532,
      budget: 15000
    },
    { 
      id: 2, 
      name: 'Holiday Special', 
      status: 'scheduled', 
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-12-31'),
      participants: 0,
      budget: 25000 
    },
    { 
      id: 3, 
      name: 'Spring Music Competition', 
      status: 'completed', 
      startDate: new Date('2023-03-15'),
      endDate: new Date('2023-04-15'),
      participants: 217,
      budget: 10000
    },
    { 
      id: 4, 
      name: 'New Year Countdown Challenge', 
      status: 'draft', 
      startDate: new Date('2023-12-25'),
      endDate: new Date('2024-01-05'),
      participants: 0,
      budget: 20000
    },
  ]);
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Status badge component with appropriate color
  const StatusBadge = ({ status }: { status: string }) => {
    let color = '';
    
    switch(status) {
      case 'active':
        color = 'bg-green-100 text-green-800';
        break;
      case 'scheduled':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'completed':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'draft':
      default:
        color = 'bg-yellow-100 text-yellow-800';
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" placeholder="Campaign name" className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" placeholder="Campaign description" className="col-span-3" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">Budget</Label>
                <Input id="budget" type="number" placeholder="Campaign budget" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(campaign => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={campaign.status} />
                  </TableCell>
                  <TableCell>
                    {format(campaign.startDate, "MMM d, yyyy")} - {format(campaign.endDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{campaign.participants}</TableCell>
                  <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampaigns;
