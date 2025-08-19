import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header id="sw-header" data-sw="sw-header" className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">K-BIZ TRAVEL</h1>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="sw-hero" data-sw="sw-hero" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              현지 전문가와 함께하는 맞춤 여행
            </h2>
            <p className="mt-4 text-slate-600">
              원하는 일정과 예산에 맞춰 설계합니다. 상담부터 예약까지 한 번에.
            </p>
          </div>
        </section>

        {/* DESTINATIONS */}
        <section id="sw-destinations" data-sw="sw-destinations" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-semibold">인기 여행지</h3>
          </div>
        </section>

        {/* BENEFITS */}
        <section id="sw-benefits" data-sw="sw-benefits" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-semibold">왜 K-BIZ TRAVEL인가?</h3>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="sw-testimonials" data-sw="sw-testimonials" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-semibold">후기</h3>
          </div>
        </section>

        {/* CTA */}
        <section id="sw-cta" data-sw="sw-cta" className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <a href="/quote" className="inline-flex items-center rounded-lg border px-4 py-2">
              맞춤 상담 시작
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="sw-footer" data-sw="sw-footer" className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500">
          © 2025 K-BIZ TRAVEL
        </div>
      </footer>
    </div>
  );
}