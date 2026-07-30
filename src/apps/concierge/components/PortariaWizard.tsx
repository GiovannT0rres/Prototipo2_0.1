import { useState } from "react";
import { toast, Toaster } from "sonner";
import { HomeBusca } from "./HomeBusca";
import { ValidacaoNovoUser } from "./ValidacaoNovoUser";
import { PerguntaWhatsapp } from "./PerguntaWhatsapp";
import { PerguntaPlaca } from "./PerguntaPlaca";
import { ConfirmacaoSelfie } from "./ConfirmacaoSelfie";
import { PerfilPessoa } from "./PerfilPessoa";
import { NovaAutorizacao } from "./NovaAutorizacao";
import { MOCK_AUTHORIZATIONS, REGISTERED_PEOPLE } from "../mocks/mockConcierge";

type Step =
  | "home"
  | "validacao-novo"
  | "pergunta-whatsapp"
  | "pergunta-placa"
  | "nova-autorizacao"
  | "confirmacao-selfie"
  | "pergunta-placa-existente"
  | "perfil";

export function PortariaWizard() {
  const [step, setStep] = useState<Step>("home");
  const [cpfAtual, setCpfAtual] = useState("");
  const [dadosPessoa, setDadosPessoa] = useState<any>(null);

  // "Quem está no clube agora" — vive aqui (não dentro da HomeBusca) porque
  // Dar Entrada/Registrar Saída acontece na tela de Perfil, e precisa
  // continuar refletido quando o porteiro voltar pra Home.
  const [pessoasNoLocal, setPessoasNoLocal] = useState(() =>
    MOCK_AUTHORIZATIONS.filter((a) => a.status === "No local").map((p) => ({ ...p, entrada: p.entrada || "Hoje, 08:30" }))
  );

  const processarCpf = (cpf: string) => {
    setCpfAtual(cpf);
    const pessoaEncontrada = REGISTERED_PEOPLE.find(p => p.cpf === cpf);

    if (pessoaEncontrada) {
      // USUÁRIO EXISTENTE
      const autorizacoes = MOCK_AUTHORIZATIONS.filter(a => a.cpf === cpf);
      setDadosPessoa({ ...pessoaEncontrada, autorizacoes });
      setStep("confirmacao-selfie");
    } else {
      // USUÁRIO NOVO (Mock do retorno da BigDataCorp)
      setDadosPessoa({
        cpf,
        name: "Carlos Eduardo Faria", // Nome retornado da API
        birthYear: "1985" // Ano retornado da API
      });
      setStep("validacao-novo");
    }
  };

  const resetarFluxo = () => {
    setStep("home");
    setCpfAtual("");
    setDadosPessoa(null);
  };

  // Só troca o status e atualiza quem está no clube — não navega pra lugar
  // nenhum, o porteiro continua na tela de Perfil vendo o resultado.
  const handleLiberarAcesso = (auth: any) => {
    if (auth._saida) {
      toast.success(`Saída registrada: ${auth.name || dadosPessoa?.name}`);
      setPessoasNoLocal((prev) => prev.filter((p) => p.id !== auth.id));
    } else {
      toast.success(`Entrada registrada: ${auth.name || dadosPessoa?.name} → ${auth.destino}`);
      setPessoasNoLocal((prev) => (prev.some((p) => p.id === auth.id) ? prev : [...prev, auth]));
    }
  };

  const handleSaidaDaLista = (id: string, nome: string) => {
    setPessoasNoLocal((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Saída de ${nome} registrada.`);
  };

  // Pessoa já cadastrada pode acumular várias autorizações (destinos e
  // autorizadores diferentes) — a nova entra na lista e a portaria volta pro
  // Perfil pra poder escolher qual delas usar pra dar entrada. Cadastro novo
  // não tem lista pra voltar, então só reseta o fluxo mesmo.
  const handleConcluirAutorizacao = (novaAutorizacao?: any) => {
    if (novaAutorizacao && dadosPessoa?.id) {
      setDadosPessoa((prev: any) => ({
        ...prev,
        autorizacoes: [...(prev.autorizacoes || []), novaAutorizacao],
      }));
      setStep("perfil");
    } else {
      resetarFluxo();
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center items-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden min-h-[650px] flex flex-col relative border border-gray-100">

        {step === "home" && (
          <HomeBusca onBuscar={processarCpf} pessoasNoLocal={pessoasNoLocal} onSaida={handleSaidaDaLista} />
        )}

        {/* CAMINHO A: USUÁRIO NOVO — validação de segurança (BigDataCorp) */}
        {step === "validacao-novo" && (
          <ValidacaoNovoUser
            dadosBigData={dadosPessoa}
            onSucesso={() => setStep("pergunta-whatsapp")}
            onFalha={resetarFluxo}
            onVoltar={resetarFluxo}
          />
        )}

        {/* CAMINHO A: uma pergunta por tela — WhatsApp e Placa coletados aqui
            para não pedir de novo na Autorização/Empresa */}
        {step === "pergunta-whatsapp" && (
          <PerguntaWhatsapp
            onConfirmar={(phone) => {
              setDadosPessoa({ ...dadosPessoa, phone });
              setStep("pergunta-placa");
            }}
            onVoltar={resetarFluxo}
          />
        )}

        {step === "pergunta-placa" && (
          <PerguntaPlaca
            onConfirmar={(placa) => {
              setDadosPessoa({ ...dadosPessoa, placa });
              setStep("nova-autorizacao");
            }}
            onVoltar={() => setStep("pergunta-whatsapp")}
          />
        )}

        {/* CAMINHO B: USUÁRIO EXISTENTE — confirma identidade por selfie, pergunta
            a placa usada hoje (pode ter trocado de carro) e vai pro perfil */}
        {step === "confirmacao-selfie" && (
          <ConfirmacaoSelfie
            dados={dadosPessoa}
            onConfirmado={() => setStep("pergunta-placa-existente")}
            onRejeitado={resetarFluxo}
          />
        )}

        {step === "pergunta-placa-existente" && (
          <PerguntaPlaca
            onConfirmar={(placa) => {
              setDadosPessoa({ ...dadosPessoa, placa });
              setStep("perfil");
            }}
            onVoltar={resetarFluxo}
          />
        )}

        {step === "perfil" && (
          <PerfilPessoa
            dados={dadosPessoa}
            onNovaAutorizacao={() => setStep("nova-autorizacao")}
            onLiberarAcesso={handleLiberarAcesso}
            onVoltar={resetarFluxo}
          />
        )}

        {/* TELA COMPARTILHADA DE AUTORIZAÇÃO — mesma lógica pra usuário novo
            (logo após o cadastro) e usuário existente (botão "Nova
            Autorização" no Perfil): a portaria é quem gera e assume a
            responsabilidade por esse acesso. */}
        {step === "nova-autorizacao" && (
          <NovaAutorizacao
            dados={dadosPessoa}
            onConcluir={handleConcluirAutorizacao}
            onVoltar={() => dadosPessoa?.id ? setStep("perfil") : setStep("pergunta-placa")}
          />
        )}

      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}