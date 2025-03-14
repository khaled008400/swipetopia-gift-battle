
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createTestUsers } from '@/integrations/supabase/client';
import { Loader2, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const TestUsersGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleGenerateUsers = async () => {
    setIsGenerating(true);
    setResults(null);
    
    try {
      const generationResults = await createTestUsers();
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
          disabled={isGenerating}
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
