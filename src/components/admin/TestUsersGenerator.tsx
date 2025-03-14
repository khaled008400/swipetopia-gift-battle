
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createTestUsers } from '@/integrations/supabase/client';
import { Loader2, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TestUsersGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [serviceKey, setServiceKey] = useState('');
  const { toast } = useToast();

  const handleGenerateUsers = async () => {
    if (!serviceKey) {
      toast({
        title: "Service Key Required",
        description: "Please provide a Supabase service key to create test users.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResults(null);
    
    try {
      const generationResults = await createTestUsers(serviceKey);
      setResults(generationResults || []);
      
      const successCount = generationResults?.filter(r => r.success).length || 0;
      
      toast({
        title: "Test Users Creation",
        description: `Created ${successCount} out of ${generationResults?.length || 0} test users.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error generating test users:", error);
      toast({
        title: "Error",
        description: "Failed to generate test users. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Test Users Generator</h3>
        <Button 
          onClick={handleGenerateUsers} 
          disabled={isGenerating || !serviceKey}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Test Users
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="serviceKey">
          Supabase Service Key <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-2">
          <Input
            id="serviceKey"
            type="password"
            placeholder="eyJhbGci0iJIUzI1NiI..."
            value={serviceKey}
            onChange={(e) => setServiceKey(e.target.value)}
            className="font-mono"
            required
          />
          <p className="text-xs text-muted-foreground">
            <strong>Required</strong>: The Service Role Key is needed to bypass RLS policies.
            Get it from Supabase Dashboard &gt; Project Settings &gt; API &gt; Service Role Key.
          </p>
        </div>
      </div>

      {results && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">All users have password: <code className="bg-gray-100 p-1 rounded">Password123!</code></p>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {results.map((result, idx) => (
              <Alert key={idx} variant={result.success ? "default" : "destructive"}>
                <AlertTitle>{result.email}</AlertTitle>
                <AlertDescription>
                  {result.success 
                    ? "Successfully created" 
                    : `Failed: ${result.error || "Unknown error"}`}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUsersGenerator;
