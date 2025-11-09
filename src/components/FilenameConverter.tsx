"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Languages } from "lucide-react";
import { translateToEnglish } from "@/app/actions/translate";

export function FilenameConverter() {
  const [filename, setFilename] = useState("");
  const [convertedFilename, setConvertedFilename] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const convertFilename = (value: string) => {
    // 1. 영어 대문자 -> 소문자 변환
    // 2. "-_ " 모두 "_"로 변환
    return value
      .toLowerCase()
      .replace(/[-\s]+/g, "_");
  };

  const handleFilenameConvert = (value: string) => {
    setFilename(value);
    const converted = convertFilename(value);
    setConvertedFilename(converted);
  };

  const handleTranslate = async () => {
    if (!filename.trim()) {
      toast.error("파일 이름을 입력하세요");
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translateToEnglish(filename);
      const converted = convertFilename(translated);
      setConvertedFilename(converted);
      toast.success("번역 및 변환이 완료되었습니다!");
    } catch (error) {
      toast.error("번역 중 오류가 발생했습니다");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyFilename = async () => {
    if (convertedFilename) {
      await navigator.clipboard.writeText(convertedFilename);
      toast.success("복사되었습니다!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>파일명 변환기</CardTitle>
        <CardDescription>
          대문자→소문자, "-_ " → "_" 변환 | 한글→영어 번역 지원
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={filename}
            onChange={(e) => handleFilenameConvert(e.target.value)}
            placeholder="파일 이름을 입력하세요"
            className="flex-1"
          />
          <Button
            onClick={handleTranslate}
            size="sm"
            variant="secondary"
            disabled={isTranslating || !filename.trim()}
          >
            <Languages className="h-4 w-4 mr-2" />
            {isTranslating ? "번역 중..." : "번역"}
          </Button>
        </div>
        {convertedFilename && (
          <div className="flex items-start gap-2">
            <div className="flex-1 px-4 py-2 bg-muted rounded-lg font-mono text-sm break-all overflow-wrap-anywhere">
              {convertedFilename}
            </div>
            <Button
              onClick={handleCopyFilename}
              size="sm"
              variant="outline"
              className="shrink-0"
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