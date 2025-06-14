'use client';

import Image from 'next/image';

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2 text-white">{number}</div>
      <h4 className="text-xl font-semibold mb-1">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-medium">{question}</h4>
      <p className="text-gray-400">{answer}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="font-sans text-white bg-black min-h-screen">
      
      {/* Header com logo */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Image src="/content/logo-f.svg" alt="Formerr logo" width={80} height={80} />
            <span className="text-xl font-light tracking-wide text-white">Formerr</span>
          </div>
          <div>
            <a
              href="/login"
              className="text-sm font-medium text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Entrar
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 bg-[radial-gradient(#666_1px,transparent_0)] [background-size:30px_30px]">
        <Image src="/content/logo-f.svg" alt="Formerr F" width={128} height={128} className="mb-6 opacity-90" />
        <h1 className="text-5xl font-semibold max-w-2xl mb-4">
          Crie formulários. Compartilhe com um link.
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-xl">
          Uma nova forma de construir formulários online, com foco em simplicidade, performance e experiência.
        </p>
        <div className="flex gap-4">
          <a href="/app" className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">
            Começar agora
          </a>
          <a href="/demo" className="border border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-black transition">
            Ver exemplo
          </a>
        </div>
      </section>

      {/* Destaque com F vidro e gradiente */}
      <section className="relative py-28 px-6 text-center text-black"
        style={{ background: 'linear-gradient(to bottom, #eee, #b8b8b8)' }}>
        <Image
          src="/content/logo-f-glass.png"
          alt="Logo vidro"
          width={176}
          height={176}
          className="mx-auto mb-6 opacity-80"
        />
        <h2 className="text-3xl font-light mb-4">Criado para ser limpo. Mantido para ser sólido.</h2>
        <p className="max-w-xl mx-auto text-gray-700">
          O Formerr foca na experiência do usuário com uma interface discreta, acessível e poderosa.
        </p>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-12 text-left">
          <Feature title="🔗 Links públicos" description="Cada formulário tem sua URL única com UUID, pronta para ser compartilhada." />
          <Feature title="🔒 Privacidade por padrão" description="Apenas o criador pode acessar as respostas. Visitantes só respondem." />
          <Feature title="🧱 Interface modular" description="Adicione blocos de forma simples. Sem drag-and-drop barulhento." />
          <Feature title="📊 Visualização em tempo real" description="Painel limpo para análise instantânea dos dados coletados." />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 bg-black text-center border-t border-neutral-800">
        <h2 className="text-3xl font-semibold mb-16">Como funciona</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-left">
          <Step number="1" title="Crie" description="Use blocos pré-definidos para montar seu formulário rapidamente." />
          <Step number="2" title="Compartilhe" description="Gere um link único e envie para quem quiser responder." />
          <Step number="3" title="Acompanhe" description="Visualize respostas no painel, exporte e monitore os dados." />
        </div>
      </section>

      {/* Demo Screenshots */}
      <section className="px-6 py-24 bg-neutral-950 border-t border-neutral-800 text-center">
        <h2 className="text-3xl font-semibold mb-8">Simples por fora. Poderoso por dentro.</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Uma interface pensada para ser invisível. Seu foco continua no conteúdo. Veja como é fácil criar e gerenciar seus formulários com o Formerr.
        </p>
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-neutral-900 bg-[radial-gradient(#666_1px,transparent_0)] [background-size:30px_30px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/2 rotate-[-4deg] shadow-lg">
            <Image
              src="https://images.pexels.com/photos/29506607/pexels-photo-29506607/free-photo-of-modern-abstract-blue-and-green-geometric-art.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Formulário exemplo 1"
              width={500}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-1/2 rotate-[6deg] shadow-lg">
            <Image
              src="https://images.pexels.com/photos/31559522/pexels-photo-31559522/free-photo-of-canteiro-de-flores-rosa-e-branco-vibrante-em-flor.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Formulário exemplo 2"
              width={500}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 bg-black border-t border-neutral-800 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-12 text-center">Dúvidas frequentes</h2>
        <FAQ question="Preciso de conta para criar formulários?" answer="Sim, mas visitantes não precisam se registrar para responder." />
        <FAQ question="Quantos formulários posso criar?" answer="Por enquanto, até 5 públicos e 10 privados por usuário." />
        <FAQ question="Formerr é gratuito?" answer="Sim! Estamos em fase beta com recursos gratuitos para todos os usuários." />
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-500 text-sm bg-neutral-950 border-t border-neutral-800">
        <p>© {new Date().getFullYear()} Formerr. Simples. Elegante. Aberto.</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <a href="https://github.com/formerr" className="hover:underline">GitHub</a>
          <a href="/roadmap" className="hover:underline">Roadmap</a>
          <a href="/termos" className="hover:underline">Termos</a>
        </div>
      </footer>
    </main>
  );
}