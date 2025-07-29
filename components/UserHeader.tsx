"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { User, LogOut, Settings } from "lucide-react"
import { AuthModal } from "./AuthModal"
import { toast } from "sonner"

export function UserHeader() {
  const { user, loading, logout } = useAuth()

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        toast.success('로그아웃되었습니다.')
      } else {
        toast.error('로그아웃 중 오류가 발생했습니다.')
      }
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {user.displayName || user.email?.split('@')[0] || '사용자'}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => window.location.href = '/dashboard'}
          >
            <Settings className="w-4 h-4 mr-1" />
            마이페이지
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-1" />
            로그아웃
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <AuthModal mode="login">
        <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
          로그인
        </Button>
      </AuthModal>
      
      <AuthModal mode="signup">
        <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
          회원가입
        </Button>
      </AuthModal>
    </div>
  )
} 