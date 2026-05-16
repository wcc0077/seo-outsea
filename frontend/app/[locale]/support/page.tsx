import Link from 'next/link';
import { getFAQArticles, getPageBySlug, FAQArticleData } from '@/lib/strapi';
import GenericPage from '@/components/sections/GenericPage';

const CATEGORY_LABELS: Record<string, string> = {
  faq: 'FAQ',
  technical: '技术原理',
  application: '行业应用',
  guide: '选购指南',
};

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const page = await getPageBySlug('support', locale).catch(() => null);
  if (page) {
    return <GenericPage params={Promise.resolve({ locale })} slug="support" />;
  }

  const faqArticles = await getFAQArticles(locale).catch(() => []);
  const faqPreview = faqArticles.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-primary-500/10" />
            <div className="absolute inset-12 rounded-full border border-primary-500/8" />
            <div className="absolute inset-24 rounded-full border border-primary-500/5" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-5">技术支持</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
            获取产品技术文档、常见问题解答以及专业支持服务。
          </p>
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mt-8" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* 4-Section Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SupportCard
              icon="product"
              title="产品支持"
              description="获取产品技术文档、使用手册和驱动下载。"
              href={`/${locale}/products`}
            />
            <SupportCard
              icon="service"
              title="服务支持"
              description="联系我们的技术支持团队，获取专业帮助。"
              href={`/${locale}/contact`}
            />
            <SupportCard
              icon="faq"
              title="常见问题"
              description="浏览常见问题解答，快速找到您需要的答案。"
              href={`/${locale}/sharing`}
            />
            <SupportCard
              icon="knowledge"
              title="知识分享"
              description="深入了解RFID技术原理、行业应用和选型指南。"
              href={`/${locale}/sharing`}
            />
          </div>
        </div>
      </section>

      {/* Service Support Contact */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">服务支持</h2>
            <div className="w-12 h-0.5 bg-primary-500 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">电话联系</h3>
                <p className="text-neutral-600">
                  <a href="tel:18964703986" className="text-primary-600 hover:text-primary-700">189-6470-3986</a>
                </p>
                <p className="text-sm text-neutral-500 mt-1">工作日 9:00 - 18:00</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">邮件联系</h3>
                <p className="text-neutral-600">
                  <a href="mailto:support01@fn-tech.com" className="text-primary-600 hover:text-primary-700">support01@fn-tech.com</a>
                </p>
                <p className="text-sm text-neutral-500 mt-1">24小时内回复</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      {faqPreview.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">常见问题</h2>
              <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
              <p className="text-neutral-600">以下是用户最常咨询的技术问题。</p>
            </div>
            <div className="space-y-4">
              {faqPreview.map((article) => (
                <FAQItem key={article.slug} article={article} locale={locale} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/sharing`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                查看全部文章
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function SupportCard({ icon, title, description, href }: { icon: string; title: string; description: string; href: string }) {
  const iconPaths: Record<string, React.ReactNode> = {
    product: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    service: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    faq: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    knowledge: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  return (
    <Link href={href} className="group block rounded-2xl p-6 bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
      <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
        {iconPaths[icon]}
      </div>
      <h3 className="font-semibold text-lg text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
    </Link>
  );
}

function FAQItem({ article, locale }: { article: FAQArticleData; locale: string }) {
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <Link
      href={`/${locale}/sharing/${article.slug}`}
      className="block rounded-xl p-5 bg-neutral-50 border border-neutral-200 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-medium bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">{categoryLabel}</span>
          </div>
          <h3 className="font-medium text-neutral-900 group-hover:text-primary-700">{article.title}</h3>
        </div>
        <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
