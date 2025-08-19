export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🐛 Debug Page
        </h1>
        <p className="text-gray-600 mb-4">
          이 페이지가 정상적으로 렌더링되면 Next.js가 정상 작동하는 것입니다.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Next.js 15.2.4 정상 작동 중
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
          <p>환경: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
}

