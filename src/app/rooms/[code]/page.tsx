
export default function Home({ params }: { params: { code: string } }) {
  const { code } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-purple-950 p-4 text-center text-white">
      <h1 className="text-4xl font-bold mb-8">Stopify</h1>

      <p>Você está na sala: {code}</p>

    </main>
  );
}
