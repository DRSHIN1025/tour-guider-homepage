import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, fileName, fileType } = await request.json();

    console.log('📁 API 다운로드 요청:', { fileUrl, fileName, fileType });

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: '파일 URL과 파일명이 필요합니다.' },
        { status: 400 }
      );
    }

    // Firebase Storage URL에서 파일 다운로드
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'K-BIZ-TRAVEL-ADMIN/1.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
      },
    });
    
    console.log('📡 Firebase 응답:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ Firebase 다운로드 실패:', response.status, response.statusText);
      return NextResponse.json(
        { 
          error: `파일 다운로드 실패: ${response.status} ${response.statusText}`,
          details: `Firebase Storage에서 파일을 가져올 수 없습니다.`
        },
        { status: response.status }
      );
    }

    // 파일 내용을 arraybuffer로 변환 (성능 향상)
    const arrayBuffer = await response.arrayBuffer();
    
    console.log('📦 파일 크기:', arrayBuffer.byteLength, 'bytes');
    
    // 적절한 Content-Type 설정
    const contentType = fileType || response.headers.get('content-type') || 'application/octet-stream';
    
    console.log('📄 Content-Type:', contentType);
    
    // Content-Disposition 헤더로 다운로드 강제
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    headers.set('Content-Length', arrayBuffer.byteLength.toString());
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    // CORS 헤더 설정
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    console.log('✅ 파일 다운로드 준비 완료:', fileName);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('❌ 프록시 다운로드 오류:', error);
    return NextResponse.json(
      { 
        error: '파일 다운로드 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // CORS preflight 요청 처리
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
