import { useState } from "react";
import { HomeBusca } from "./HomeBusca";
import { ValidacaoNovoUser } from "./ValidacaoNovoUser";
import { ConfirmacaoSelfie } from "./ConfirmacaoSelfie";
import { PerfilPessoa } from "./PerfilPessoa";
import { NovaAutorizacao } from "./NovaAutorizacao";
import { MOCK_AUTHORIZATIONS, REGISTERED_PEOPLE } from "../mocks/mockConcierge";

type Step = 
  | "home" 
  | "validacao-novo" 
  | "nova-autorizacao" 
  | "confirmacao-selfie" 
  | "perfil";

export function PortariaWizard() {
  const [step, setStep] = useState<Step>("home");
  const [cpfAtual, setCpfAtual] = useState("");
  const [dadosPessoa, setDadosPessoa] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center items-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden min-h-[650px] flex flex-col relative border border-gray-100">
        
        {step === "home" && (
          <HomeBusca onBuscar={processarCpf} />
        )}

        {/* CAMINHO A: USUÁRIO NOVO */}
        {step === "validacao-novo" && (
          <ValidacaoNovoUser 
            dadosBigData={dadosPessoa} 
            onSucesso={() => setStep("nova-autorizacao")} 
            onFalha={resetarFluxo} 
            onVoltar={resetarFluxo} 
          />
        )}

        {/* CAMINHO B: USUÁRIO EXISTENTE */}
        {step === "confirmacao-selfie" && (
          <ConfirmacaoSelfie 
            dados={dadosPessoa} 
            onConfirmado={() => setStep("perfil")} 
            onRejeitado={resetarFluxo} 
          />
        )}

        {step === "perfil" && (
          <PerfilPessoa 
            dados={dadosPessoa} 
            onNovaAutorizacao={() => setStep("nova-autorizacao")}
            onVoltar={resetarFluxo} 
          />
        )}

        {/* TELA COMPARTILHADA DE AUTORIZAÇÃO */}
        {step === "nova-autorizacao" && (
          <NovaAutorizacao 
            dados={dadosPessoa}
            onConcluir={resetarFluxo} 
            onVoltar={() => dadosPessoa?.id ? setStep("perfil") : resetarFluxo()} 
          />
        )}

      </div>
    </div>
  );
}