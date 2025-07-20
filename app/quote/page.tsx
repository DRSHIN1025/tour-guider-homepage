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
          <form className="space-y-8">
            <div className="text-center">
              <p className="text-gray-600">
                아래 정보를 입력해주시면, 전문 가이드가 확인 후 맞춤 일정을
                제안해드립니다.
              </p>
            </div>
            
            {/* 여행 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">여행 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">여행지</Label>
                  <Input id="destination" placeholder="예: 베트남 다낭" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airline">항공사</Label>
                  <Input id="airline" placeholder="예: 대한항공, 저비용항공, 직접 구매 등" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">여행 시작일</Label>
                  {/* TODO: Calendar component will be here */}
                  <Input id="start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">여행 종료일</Label>
                  {/* TODO: Calendar component will be here */}
                  <Input id="end-date" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>인원</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input type="number" placeholder="성인" />
                  <Input type="number" placeholder="아동" />
                  <Input type="number" placeholder="유아" />
                </div>
              </div>
            </div>

            {/* 세부 요청 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">세부 요청</h3>
              <div className="space-y-2">
                <Label>선호하는 여행 스타일 (중복 선택 가능)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["휴양", "관광", "골프", "액티비티", "쇼핑", "맛집탐방", "문화/역사", "자유여행"].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <input type="checkbox" id={style} value={style} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor={style} className="text-sm text-gray-700">{style}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>예상 경비 (1인 기준)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {["100만원 이하", "100~150만원", "150~200만원", "200만원 이상"].map((budget) => (
                    <div key={budget} className="flex items-center space-x-2">
                      <input type="radio" id={budget} name="budget" value={budget} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                      <label htmlFor={budget} className="text-sm text-gray-700">{budget}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 요청자 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">요청자 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">요청자 성함</Label>
                  <Input id="name" placeholder="홍길동" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" placeholder="010-1234-5678" required />
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소 (선택)</Label>
                  <Input id="email" type="email" placeholder="hello@example.com" />
                </div>
            </div>

            {/* 기타 요청사항 및 파일 첨부 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">기타 요청 및 참고자료</h3>
              <div className="space-y-2">
                <Label htmlFor="requests">기타 요청사항</Label>
                <Textarea id="requests" placeholder="특별히 원하시는 활동이나 숙소, 식당 등이 있다면 자유롭게 작성해주세요." rows={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">참고 자료 첨부</Label>
                <Input id="attachments" type="file" multiple />
                <p className="text-xs text-gray-500">
                  이미지나 PDF 파일을 첨부할 수 있습니다. (최대 3개, 각 10MB 이하)
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              견적 요청 제출하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 