export default function Cancel() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Pagamento Cancelado</h1>
        <p className="text-gray-600">Você pode tentar novamente quando quiser.</p>
      </div>
    </div>
  );
}