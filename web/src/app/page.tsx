export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="rounded-3xl bg-surface p-8 shadow-soft">
        <h1 className="text-2xl font-semibold">🎓 Teach the Fool</h1>
        <p className="mt-2 text-muted">可愛い先生と「お馬鹿さん」と一緒に、教えて覚える学習体験。</p>
        <a
          href="/topic"
          className="mt-6 inline-block rounded-full bg-brand-500 px-5 py-3 text-white"
        >
          学習を始める →
        </a>
      </div>
    </main>
  );
}
