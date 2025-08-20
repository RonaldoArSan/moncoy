"use client";

import { useEffect, useState } from 'react';
import { redirectToStripeCheckout, STRIPE_CONFIG } from '@/lib/stripe-config';

// FAQ Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm fade-in">
      <button 
        className="w-full text-left p-6 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-900">{question}</h3>
          <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="p-6 pt-0">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Moncoy <span className="text-yellow-300">Finance</span></span>
            </div>
            <button 
              onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.PRO)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Comece com 30 dias Grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transforme Suas Finanças com
                <span className="block text-yellow-300">Inteligência Artificial</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                O primeiro app brasileiro que combina gestão financeira completa com IA nativa. 
                Organize, invista e cresça com insights inteligentes personalizados para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.PRO)}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                >
                  🚀 Comece Grátis Agora
                </button>
              </div>
            </div>
            <div className="fade-in">
              <div className="w-full h-96 bg-white bg-opacity-20 rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-white text-lg">Dashboard Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Escolha o Plano <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfeito</span> Para Você
            </h2>
            <p className="text-xl text-gray-600">Planos completos com IA financeira avançada</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 19,90</div>
                <p className="text-gray-600">por mês</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "GPT-4o-mini",
                  "5 perguntas/semana",
                  "Resumo mensal simplificado",
                  "Somente Web"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-3">✅</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.BASIC)}
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                Assinar Básico
              </button>
            </div>
            
            {/* Plano Pro */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500 relative fade-in">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Mais Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">R$ 49,90</div>
                <p className="text-gray-600">por mês</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "GPT-4o-mini + GPT-4o limitado",
                  "1 pergunta/dia",
                  "Resumo mensal detalhado em PDF",
                  "Histórico de conversas",
                  "Alertas de gastos",
                  "Web + Mobile"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-blue-500 mr-3">✅</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.PRO)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Assinar Pro
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 59,90</div>
                <p className="text-gray-600">por mês</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "GPT-4o-mini + GPT-4o completo",
                  "Uso diário sem limite rígido",
                  "Resumo mensal + análise financeira completa",
                  "Relatórios PDF avançados com gráficos",
                  "Histórico de conversas",
                  "Suporte prioritário",
                  "Web + Mobile"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-purple-500 mr-3">✅</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.PREMIUM)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                Assinar Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perguntas <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Frequentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            <FAQItem 
              question="Como funciona o período de 22 dias para liberar a IA?"
              answer="Durante os primeiros 22 dias, nossa IA aprende seus hábitos financeiros e padrões de consumo. Após esse período, ela é liberada automaticamente com insights personalizados e conselhos específicos para seu perfil."
            />
            <FAQItem 
              question="Meus dados estão seguros?"
              answer="Sim! Utilizamos criptografia de ponta a ponta e Row Level Security. Seus dados são protegidos com o mesmo nível de segurança dos principais bancos digitais do Brasil."
            />
            <FAQItem 
              question="Posso cancelar a qualquer momento?"
              answer="Claro! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Pare de Adiar Seu <span className="text-yellow-300">Sucesso Financeiro</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Milhares de brasileiros já transformaram suas vidas financeiras com o Moncoy. 
              Não fique para trás - comece sua jornada hoje mesmo!
            </p>
            <button 
              onClick={() => redirectToStripeCheckout(STRIPE_CONFIG.prices.PRO)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
            >
              🚀 Transforme Suas Finanças Hoje
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}