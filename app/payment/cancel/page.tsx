"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              결제가 취소되었습니다
            </h1>
            
            <p className="text-gray-600 mb-8">
              결제 과정이 중단되었습니다.
              <br />
              언제든지 다시 시도하실 수 있습니다.
            </p>
            
            <div className="space-y-4">
              <Link href="/payment">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  다시 결제하기
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500 mb-2">문의사항이 있으신가요?</p>
              <p className="text-sm text-gray-600">
                📧 help@tourguider.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 