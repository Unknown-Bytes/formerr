import { Feature } from "@/components/v1/components";
import { Step } from "@/components/v1/components";
import { FAQ } from "@/components/v1/components";

export default function Home() {
  return (
    <main className="bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl font-bold mb-6 max-w-3xl">
          Crie formulários. Compartilhe com um link.
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-8">
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
        <div className="bg-gray-800 rounded-lg w-full h-[400px] flex items-center justify-center text-gray-400">
          {/* Substitua por um componente de carrossel ou imagem estática */}
          Screenshot do formulário aqui
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
        <p>© {new Date().getFullYear()} Formerr. Construído com simplicidade em mente.</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <a href="https://github.com/formerr" className="hover:underline">GitHub</a>
          <a href="/roadmap" className="hover:underline">Roadmap</a>
          <a href="/termos" className="hover:underline">Termos</a>
        </div>
      </footer>
    </main>
  );
}


