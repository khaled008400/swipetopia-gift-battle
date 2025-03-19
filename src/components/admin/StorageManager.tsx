
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, FolderPlus, Files, RefreshCw, File, Folder } from 'lucide-react';
import StorageService from '@/services/storage.service';
import { useToast } from '@/components/ui/use-toast';

export default function StorageManager() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [newBucketName, setNewBucketName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isCreateBucketOpen, setIsCreateBucketOpen] = useState(false);
  const { toast } = useToast();

  // Fetch buckets
  const { data: buckets, isLoading: bucketsLoading, refetch: refetchBuckets } = useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => await StorageService.getBuckets(),
  });

  // Fetch files for selected bucket
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = useQuery({
    queryKey: ['storage-files', selectedBucket, currentPath],
    queryFn: async () => {
      if (!selectedBucket) return [];
      return await StorageService.getFiles(selectedBucket, currentPath);
    },
    enabled: !!selectedBucket,
  });

  useEffect(() => {
    if (buckets && buckets.length > 0 && !selectedBucket) {
      setSelectedBucket(buckets[0].name);
    }
  }, [buckets, selectedBucket]);

  const handleCreateBucket = async () => {
    if (!newBucketName) {
      toast({
        title: "Error",
        description: "Bucket name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await StorageService.createBucket(newBucketName, isPublic);
      setNewBucketName('');
      setIsPublic(false);
      setIsCreateBucketOpen(false);
      refetchBuckets();
      toast({
        title: "Success",
        description: `Bucket "${newBucketName}" created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create bucket",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBucket = async (bucketName: string) => {
    if (!confirm(`Are you sure you want to delete bucket "${bucketName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await StorageService.deleteBucket(bucketName);
      if (selectedBucket === bucketName) {
        setSelectedBucket(null);
      }
      refetchBuckets();
      toast({
        title: "Success",
        description: `Bucket "${bucketName}" deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bucket",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    if (!selectedBucket) return;
    if (!confirm(`Are you sure you want to delete file "${filePath}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const path = currentPath ? `${currentPath}/${filePath}` : filePath;
      await StorageService.deleteFile(selectedBucket, path);
      refetchFiles();
      toast({
        title: "Success",
        description: `File "${filePath}" deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const navigateToFolder = (folderName: string) => {
    if (folderName === '..') {
      // Go up one level
      const pathParts = currentPath.split('/');
      pathParts.pop();
      setCurrentPath(pathParts.join('/'));
    } else {
      // Go into folder
      setCurrentPath(currentPath ? `${currentPath}/${folderName}` : folderName);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Storage Manager</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetchBuckets()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
        
        <Dialog open={isCreateBucketOpen} onOpenChange={setIsCreateBucketOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="h-4 w-4 mr-2" /> Create Bucket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Storage Bucket</DialogTitle>
              <DialogDescription>
                Create a new bucket to store files. Public buckets allow unauthenticated access to files.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bucket Name</Label>
                <Input 
                  id="name" 
                  value={newBucketName} 
                  onChange={(e) => setNewBucketName(e.target.value)} 
                  placeholder="my-bucket-name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-public" 
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="is-public">Make bucket public</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateBucketOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBucket}>Create Bucket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Buckets</CardTitle>
            <CardDescription>Select a bucket to manage files</CardDescription>
          </CardHeader>
          <CardContent>
            {bucketsLoading ? (
              <div className="flex justify-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : buckets && buckets.length > 0 ? (
              <div className="space-y-2">
                {buckets.map((bucket) => (
                  <div 
                    key={bucket.name} 
                    className={`flex justify-between items-center p-2 rounded cursor-pointer ${selectedBucket === bucket.name ? 'bg-muted' : 'hover:bg-muted/50'}`}
                    onClick={() => {
                      setSelectedBucket(bucket.name);
                      setCurrentPath('');
                    }}
                  >
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{bucket.name}</span>
                      {bucket.public && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          public
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBucket(bucket.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No buckets found
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  {selectedBucket ? `Bucket: ${selectedBucket} ${currentPath ? `/ Path: ${currentPath}` : ''}` : 'Select a bucket'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchFiles()}
                disabled={!selectedBucket}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedBucket ? (
              <div className="text-center py-4 text-gray-500">
                Select a bucket to view files
              </div>
            ) : filesLoading ? (
              <div className="flex justify-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {currentPath && (
                  <div className="mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigateToFolder('..')}
                    >
                      <Folder className="h-4 w-4 mr-2" /> ..
                    </Button>
                  </div>
                )}
                
                {files && files.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => (
                        <TableRow key={file.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {file.metadata?.mimetype ? (
                                <File className="h-4 w-4 mr-2 text-blue-500" />
                              ) : (
                                <Folder className="h-4 w-4 mr-2 text-yellow-500" />
                              )}
                              {file.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {file.metadata?.mimetype || 'folder'}
                          </TableCell>
                          <TableCell>
                            {file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : '--'}
                          </TableCell>
                          <TableCell className="text-right">
                            {file.metadata?.mimetype ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteFile(file.name)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigateToFolder(file.name)}
                              >
                                Open
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No files found in this location
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
