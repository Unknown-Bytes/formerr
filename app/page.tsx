'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check, 
  Link, 
  Shield, 
  Layout, 
  BarChart3,
  Zap,
  Users,
  Globe,
  Star,
  ChevronDown,
  Github,
  ExternalLink
} from 'lucide-react';

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto group-hover:scale-105 transition-transform">
        {number}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-medium text-gray-900">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-gray-100">
          <p className="text-gray-600 pt-4 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { label: "Formulários criados", value: "1.2K+" },
    { label: "Respostas coletadas", value: "5.4K+" },
    { label: "Usuários ativos", value: "200+" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="font-sans bg-white">
      
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Image src="/content/logo-f.svg" alt="Formerr logo" width={24} height={24} className="invert" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Formerr</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-gray-900 transition-colors">Recursos</a>
              <a href="#how-it-works" className="hover:text-gray-900 transition-colors">Como funciona</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            </nav>
            
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Entrar
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Começar grátis
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
              <Star className="w-4 h-4" />
              <span>Beta gratuito disponível</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Crie formulários.
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Compartilhe com um link.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Uma nova forma de construir formulários online, com foco em simplicidade, 
              performance e experiência do usuário.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/login" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
            >
              Começar agora
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#demo" 
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-4 rounded-xl text-lg font-medium transition-all hover:bg-gray-50"
            >
              Ver demonstração
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          {/* Stats carousel */}
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
              <div className="text-center transition-all duration-500">
                <div className="text-2xl font-bold text-gray-900">{stats[currentStat].value}</div>
                <div className="text-sm text-gray-600">{stats[currentStat].label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Brand Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-2xl border border-gray-200 shadow-lg flex items-center justify-center">
            <Image
              src="/content/logo-f-glass.png"
              alt="Logo vidro"
              width={80}
              height={80}
              className="opacity-90"
            />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Criado para ser limpo.
            <span className="block">Mantido para ser sólido.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            O Formerr foca na experiência do usuário com uma interface discreta, 
            acessível e poderosa que simplesmente funciona.
          </p>
        </div>
      </section>

      {/* Enhanced Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para criar formulários profissionais sem complicação
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature 
              icon={<Link className="w-6 h-6 text-blue-600" />}
              title="Links públicos" 
              description="Cada formulário tem sua URL única com UUID, pronta para ser compartilhada instantaneamente." 
            />
            <Feature 
              icon={<Shield className="w-6 h-6 text-green-600" />}
              title="Privacidade por padrão" 
              description="Apenas o criador pode acessar as respostas. Visitantes só respondem, nada mais." 
            />
            <Feature 
              icon={<Layout className="w-6 h-6 text-purple-600" />}
              title="Interface modular" 
              description="Adicione blocos de forma simples e intuitiva. Sem drag-and-drop complicado." 
            />
            <Feature 
              icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
              title="Análise em tempo real" 
              description="Painel limpo para análise instantânea e exportação dos dados coletados." 
            />
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-xl text-gray-600">Três passos simples para começar</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <Step 
              number="1" 
              title="Crie" 
              description="Use blocos pré-definidos para montar seu formulário rapidamente, sem complicação." 
            />
            <Step 
              number="2" 
              title="Compartilhe" 
              description="Gere um link único e seguro, envie para quem quiser responder ao seu formulário." 
            />
            <Step 
              number="3" 
              title="Acompanhe" 
              description="Visualize respostas no painel em tempo real, exporte dados e monitore resultados." 
            />
          </div>
        </div>
      </section>

      {/* Enhanced Demo Screenshots */}
      <section id="demo" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simples por fora. Poderoso por dentro.
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Uma interface pensada para ser invisível. Seu foco continua no conteúdo. 
            Veja como é fácil criar e gerenciar formulários com o Formerr.
          </p>
          
          <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-[55%] -translate-y-1/2 rotate-[-8deg] hover:rotate-[-4deg] transition-transform duration-300">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/29506607/pexels-photo-29506607/free-photo-of-modern-abstract-blue-and-green-geometric-art.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Formulário exemplo 1"
                  width={400}
                  height={250}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-1/2 rotate-[6deg] hover:rotate-[3deg] transition-transform duration-300">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/31559522/pexels-photo-31559522/free-photo-of-canteiro-de-flores-rosa-e-branco-vibrante-em-flor.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Formulário exemplo 2"
                  width={400}
                  height={250}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ */}
      <section id="faq" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dúvidas frequentes</h2>
            <p className="text-xl text-gray-600">Respostas para as perguntas mais comuns</p>
          </div>
          
          <div className="space-y-4">
            <FAQ 
              question="Preciso de conta para criar formulários?" 
              answer="Sim, você precisa criar uma conta gratuita para construir formulários. Porém, as pessoas que vão responder não precisam se registrar - podem responder diretamente pelo link." 
            />
            <FAQ 
              question="Quantos formulários posso criar?" 
              answer="Durante a fase beta, você pode criar até 5 formulários públicos e 10 privados por conta. Estamos trabalhando em planos mais flexíveis para o futuro." 
            />
            <FAQ 
              question="O Formerr é gratuito?" 
              answer="Sim! Estamos em fase beta com todos os recursos gratuitos para nossos usuários. Queremos garantir que a experiência seja perfeita antes de considerar opções premium." 
            />
            <FAQ 
              question="Como funciona a privacidade dos dados?" 
              answer="Levamos privacidade a sério. Apenas você tem acesso às respostas dos seus formulários. Não compartilhamos, vendemos ou usamos seus dados para outros propósitos." 
            />
            <FAQ 
              question="Posso exportar as respostas?" 
              answer="Sim! Você pode exportar todas as respostas em formato CSV ou JSON diretamente do painel de controle, facilitando análises externas." 
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de usuários que já estão criando formulários incríveis com o Formerr.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/login" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
            >
              Criar conta gratuita
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/formerr" 
              className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-medium transition-all"
            >
              <Github className="w-5 h-5" />
              Ver no GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Image src="/content/logo-f.svg" alt="Formerr logo" width={20} height={20} className="invert" />
                </div>
                <span className="text-lg font-semibold text-white">Formerr</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Formulários reimaginados para a web moderna. Simples, elegante e poderoso.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Produto</h4>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block hover:text-white transition-colors">Recursos</a>
                <a href="/demo" className="block hover:text-white transition-colors">Demonstração</a>
                <a href="/roadmap" className="block hover:text-white transition-colors">Roadmap</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Suporte</h4>
              <div className="space-y-2 text-sm">
                <a href="#faq" className="block hover:text-white transition-colors">FAQ</a>
                <a href="/docs" className="block hover:text-white transition-colors">Documentação</a>
                <a href="/contato" className="block hover:text-white transition-colors">Contato</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <a href="/termos" className="block hover:text-white transition-colors">Termos de Uso</a>
                <a href="/privacidade" className="block hover:text-white transition-colors">Privacidade</a>
                <a href="/cookies" className="block hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Formerr. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="https://github.com/formerr" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="/status" className="text-xs text-gray-400 hover:text-white transition-colors">
                Status do Sistema
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}