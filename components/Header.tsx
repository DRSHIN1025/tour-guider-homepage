'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import BrandLogo from "@/components/branding/BrandLogo";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      id="sw-header" 
      data-sw="sw-header"
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center font-bold text-xl text-gray-900">
            K-BIZ TRAVEL
          </Link>
          
          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="주요 메뉴" className="hidden lg:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              회사소개
            </Link>
            <Link href="/quote" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              견적 요청
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              서비스·결제
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              리뷰
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              관리자
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-green-600 transition-colors font-medium focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded px-2 py-1">
              찾기
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/quote">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2">
                무료 맞춤 견적
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2">
                고객 로그인
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 focus-visible:outline-2 focus-visible:outline-green-600 focus-visible:outline-offset-2 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                회사소개
              </Link>
              <Link href="/quote" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                견적 요청
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                서비스·결제
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                리뷰
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                관리자
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded">
                찾기
              </Link>
            </nav>
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/quote">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                  무료 맞춤 견적
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 px-4 py-2">
                  고객 로그인
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}