// app/quote/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function QuoteFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            맞춤 여행 견적 요청
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                아래 정보를 입력해주시면, 전문 가이드가 확인 후 맞춤 일정을
                제안해드립니다.
              </p>
            </div>
            {/* 여기에 폼 필드들이 추가될 예정입니다. */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 