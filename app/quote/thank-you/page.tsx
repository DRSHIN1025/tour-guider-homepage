import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">
        소중한 견적 요청 감사합니다!
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        입력해주신 정보를 바탕으로 최고의 가이드들이 맞춤 일정을 준비하여
        신속하게 연락드리겠습니다.
      </p>
      <Button asChild>
        <Link href="/">메인 페이지로 돌아가기</Link>
      </Button>
    </div>
  );
} 