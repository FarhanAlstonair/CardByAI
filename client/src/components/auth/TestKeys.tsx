import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function TestKeys() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testKeys = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/test-keys');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test API Keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testKeys} disabled={testing} className="w-full">
          {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Test All Keys
        </Button>
        
        {results && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Google OAuth</span>
              {results.google ? 
                <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge> : 
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>
              }
            </div>
            <div className="flex items-center justify-between">
              <span>Supabase</span>
              {results.supabase ? 
                <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge> : 
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>
              }
            </div>
            <div className="flex items-center justify-between">
              <span>Cloudinary</span>
              {results.cloudinary ? 
                <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge> : 
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>
              }
            </div>
            <div className="flex items-center justify-between">
              <span>Cerebras AI</span>
              {results.cerebrasPing ? 
                <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Working</Badge> : 
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
              }
            </div>
            <div className="flex items-center justify-between">
              <span>HuggingFace</span>
              {results.huggingface ? 
                <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge> : 
                <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}