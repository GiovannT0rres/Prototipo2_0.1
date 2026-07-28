import { useState } from "react";
import { toast, Toaster } from "sonner";
import { HomeBusca } from "./HomeBusca";
import { ValidacaoNovoUser } from "./ValidacaoNovoUser";
import { ConfirmacaoSelfie } from "./ConfirmacaoSelfie";
import { PerfilPessoa } from "./PerfilPessoa";
import { NovaAutorizacao } from "./NovaAutorizacao";
import { TipoCadastro } from "./TipoCadastro";
import { CadastroVisitante } from "./CadastroVisitante";
import { CadastroPrestador } from "./CadastroPrestador";
import { MOCK_AUTHORIZATIONS, REGISTERED_PEOPLE } from "../mocks/mockConcierge";

type Step =
  | "home"
  | "validacao-novo"
  | "tipo-cadastro"
  | "cadastro-visitante"
  | "cadastro-prestador"
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

  const handleLiberarAcesso = (auth: any) => {
    if (auth._saida) {
      toast.success(`Saída registrada: ${dadosPessoa?.name}`);
    } else {
      toast.success(`Entrada registrada: ${dadosPessoa?.name} → ${auth.spot}`);
    }
    resetarFluxo();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center items-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden min-h-[650px] flex flex-col relative border border-gray-100">

        {step === "home" && (
          <HomeBusca onBuscar={processarCpf} />
        )}

        {/* CAMINHO A: USUÁRIO NOVO — validação de segurança (BigDataCorp) */}
        {step === "validacao-novo" && (
          <ValidacaoNovoUser
            dadosBigData={dadosPessoa}
            onSucesso={() => setStep("tipo-cadastro")}
            onFalha={resetarFluxo}
            onVoltar={resetarFluxo}
          />
        )}

        {/* CAMINHO A: escolhe que tipo de cadastro fazer */}
        {step === "tipo-cadastro" && (
          <TipoCadastro
            onSelecionar={(tipo) =>
              setStep(tipo === "prestador" ? "cadastro-prestador" : "cadastro-visitante")
            }
            onVoltar={resetarFluxo}
          />
        )}

        {step === "cadastro-visitante" && (
          <CadastroVisitante
            cpfInicial={cpfAtual}
            nomeInicial={dadosPessoa?.name}
            onVoltar={() => setStep("tipo-cadastro")}
            onConcluir={(d) => {
              // Cadastro só registra a identidade — a autorização (espaço +
              // responsável) é decidida a seguir, na mesma tela usada por
              // quem já é cadastrado.
              setDadosPessoa({ ...d, type: "Visitante" });
              setStep("nova-autorizacao");
            }}
          />
        )}

        {step === "cadastro-prestador" && (
          <CadastroPrestador
            cpfInicial={cpfAtual}
            nomeInicial={dadosPessoa?.name}
            onVoltar={() => setStep("tipo-cadastro")}
            onConcluir={resetarFluxo}
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
            onConcluir={resetarFluxo}
            onVoltar={() => dadosPessoa?.id ? setStep("perfil") : resetarFluxo()}
          />
        )}

      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}