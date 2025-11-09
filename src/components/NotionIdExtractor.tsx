"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Copy, AlertCircle } from "lucide-react";

export function NotionIdExtractor() {
  const [notionUrl, setNotionUrl] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [error, setError] = useState(false);

  const extractDatabaseId = (url: string) => {
    setNotionUrl(url);
    setError(false);
    
    if (!url) {
      setDatabaseId("");
      return;
    }

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Pattern 1: /workspace/title-id
      const workspaceMatch = pathname.match(/\/([^\/]+)\/[^\/]+-([a-f0-9]{32})/);
      if (workspaceMatch) {
        setDatabaseId(workspaceMatch[2]);
        return;
      }
      
      // Pattern 2: /title-id (with workspace in subdomain or without)
      const titleMatch = pathname.match(/\/[^\/]+-([a-f0-9]{32})/);
      if (titleMatch) {
        setDatabaseId(titleMatch[1]);
        return;
      }
      
      // Pattern 3: /id only
      const idOnlyMatch = pathname.match(/\/([a-f0-9]{32})/);
      if (idOnlyMatch) {
        setDatabaseId(idOnlyMatch[1]);
        return;
      }
      
      setDatabaseId("");
      setError(true);
    } catch (error) {
      setDatabaseId("");
      setError(true);
    }
  };

  const handleCopyDatabaseId = async () => {
    if (databaseId && !error) {
      await navigator.clipboard.writeText(databaseId);
      toast.success("복사되었습니다!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notion 데이터베이스 ID 추출기</CardTitle>
        <CardDescription>
          Notion 페이지 링크에서 데이터베이스 ID를 추출합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          value={notionUrl}
          onChange={(e) => extractDatabaseId(e.target.value)}
          placeholder="Notion 페이지 링크를 입력하세요"
        />
        {error && notionUrl && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              유효하지 않은 Notion URL입니다
            </AlertDescription>
          </Alert>
        )}
        {databaseId && !error && (
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2 bg-muted rounded-lg font-mono text-sm break-all">
              {databaseId}
            </div>
            <Button
              onClick={handleCopyDatabaseId}
              size="sm"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              복사
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}