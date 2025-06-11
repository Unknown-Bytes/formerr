export function Feature({ title, description }: { title: string; description: string }) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    );
  }
  
export function Step({ number, title, description }: { number: string; title: string; description: string }) {
    return (
      <div>
        <div className="text-4xl font-bold mb-2 text-white">{number}</div>
        <h4 className="text-xl font-semibold mb-1">{title}</h4>
        <p className="text-gray-400">{description}</p>
      </div>
    );
  }
  
export function FAQ({ question, answer }: { question: string; answer: string }) {
    return (
      <div className="mb-8">
        <h4 className="text-lg font-medium">{question}</h4>
        <p className="text-gray-400">{answer}</p>
      </div>
    );
  }