import { useNavigate } from "react-router";
import { ShieldCheck } from "lucide-react";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-sm">
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold mb-8 tracking-tight text-gray-900">
          Clube Access
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <input
              type="text"
              placeholder="E-mail ou Matrícula"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold text-[17px] py-3.5 rounded-xl mt-4 active:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>

        <button className="mt-6 text-blue-600 text-[15px] font-medium active:opacity-70 transition-opacity">
          Esqueci minha senha
        </button>
      </div>
    </div>
  );
}
