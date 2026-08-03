import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { toast, Toaster } from "sonner";
import { HomeBusca } from "./HomeBusca";
import { ValidacaoNovoUser } from "./ValidacaoNovoUser";
import { PerguntaWhatsapp } from "./PerguntaWhatsapp";
import { PerguntaPlaca } from "./PerguntaPlaca";
import { ConfirmacaoSelfie } from "./ConfirmacaoSelfie";
import { PerfilPessoa } from "./PerfilPessoa";
import { PerguntaMotivo } from "./PerguntaMotivo";
import { PerguntaEmpresa } from "./PerguntaEmpresa";
import { PerguntaDestino } from "./PerguntaDestino";
import { PerguntaAutorizador } from "./PerguntaAutorizador";
import { PerguntaPeriodo } from "./PerguntaPeriodo";
import { PerguntaObservacoes } from "./PerguntaObservacoes";
import { ProgressoAtendimento } from "./ProgressoAtendimento";
import { MOCK_AUTHORIZATIONS } from "../mocks/mockConcierge";
import {
  buscarPessoaPorCpf,
  registrarPessoaNova,
  buscarAutorizacoesPorCpf,
  registrarAutorizacaoNova,
} from "../mocks/mockConciergeStore";

// Mesmas 3 etapas nos dois fluxos (cadastro novo e usuário existente) — só a
// última muda de nome porque o destino final é diferente (gerar autorização
// vs. cair no perfil, que pode ou não gerar uma nova autorização a partir daí).
const ETAPAS_NOVO = ["Pessoa", "Veículo", "Autorização"];
const ETAPAS_EXISTENTE = ["Pessoa", "Veículo", "Perfil"];

type Step =
  | "home"
  | "validacao-novo"
  | "pergunta-whatsapp"
  | "pergunta-placa"
  | "pergunta-motivo"
  | "pergunta-empresa"
  | "pergunta-destino"
  | "pergunta-autorizador"
  | "pergunta-periodo"
  | "pergunta-observacoes"
  | "confirmacao-selfie"
  | "pergunta-placa-existente"
  | "perfil";

export function PortariaWizard() {
  const [step, setStep] = useState<Step>("home");
  const [cpfAtual, setCpfAtual] = useState("");
  const [dadosPessoa, setDadosPessoa] = useState<any>(null);

  // Avisa o ConciergeLayout se estamos na Home (idle) ou em atendimento —
  // controla a exibição do header de marca (DESIGN.md §14.10). O contexto é
  // opcional (undefined fora do router de verdade), então isso nunca quebra
  // a árvore de estados do wizard nem os callbacks existentes.
  const outletCtx = useOutletContext<{ setIsHome: (v: boolean) => void } | null>();
  useEffect(() => {
    outletCtx?.setIsHome(step === "home");
  }, [step, outletCtx]);

  // Só existe pra fazer o botão "voltar" do WhatsApp cair na etapa 2 (Ano) da
  // validação, e não reiniciar do zero na etapa 1 (Nome) — "voltar" tem que
  // voltar pra pergunta anterior de verdade.
  const [voltandoDoWhatsapp, setVoltandoDoWhatsapp] = useState(false);

  // "Quem está no clube agora" — vive aqui (não dentro da HomeBusca) porque
  // Dar Entrada/Registrar Saída acontece na tela de Perfil, e precisa
  // continuar refletido quando o porteiro voltar pra Home.
  const [pessoasNoLocal, setPessoasNoLocal] = useState(() =>
    MOCK_AUTHORIZATIONS.filter((a) => a.status === "No local").map((p) => ({ ...p, entrada: p.entrada || "Hoje, 08:30" }))
  );

  const processarCpf = (cpf: string) => {
    setCpfAtual(cpf);
    const pessoaEncontrada = buscarPessoaPorCpf(cpf);

    if (pessoaEncontrada) {
      // USUÁRIO EXISTENTE (inclui quem foi cadastrado numa sessão anterior)
      const autorizacoes = buscarAutorizacoesPorCpf(cpf);
      setDadosPessoa({ ...pessoaEncontrada, autorizacoes });
      setStep("confirmacao-selfie");
    } else {
      // USUÁRIO NOVO (Mock do retorno da BigDataCorp)
      setDadosPessoa({
        cpf,
        name: "Carlos Eduardo Faria", // Nome retornado da API
        birthYear: "1985" // Ano retornado da API
      });
      setVoltandoDoWhatsapp(false);
      setStep("validacao-novo");
    }
  };

  const resetarFluxo = () => {
    setStep("home");
    setCpfAtual("");
    setDadosPessoa(null);
    setVoltandoDoWhatsapp(false);
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
  // vira pessoa registrada de verdade (persistida), pra na próxima busca do
  // mesmo CPF ela já aparecer como usuário existente, com essa autorização —
  // em vez de reiniciar o fluxo de "usuário novo" e perder tudo.
  const handleConcluirAutorizacao = (novaAutorizacao?: any) => {
    if (!novaAutorizacao) {
      resetarFluxo();
      return;
    }

    if (dadosPessoa?.id) {
      setDadosPessoa((prev: any) => ({
        ...prev,
        autorizacoes: [...(prev.autorizacoes || []), novaAutorizacao],
      }));
      registrarAutorizacaoNova(novaAutorizacao);
      setStep("perfil");
    } else {
      const avatar = `https://i.pravatar.cc/150?u=${dadosPessoa?.cpf}`;
      registrarPessoaNova({
        id: `p-${Date.now()}`,
        name: dadosPessoa?.name,
        cpf: dadosPessoa?.cpf,
        type: dadosPessoa?.type,
        phone: dadosPessoa?.phone,
        placa: dadosPessoa?.placa || null,
        avatar,
      });
      registrarAutorizacaoNova({ ...novaAutorizacao, avatar });
      resetarFluxo();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--es-bg)] flex justify-center items-center p-4">
      <div className="w-full max-w-[520px] bg-[var(--es-surface)] rounded-3xl shadow-xl overflow-hidden min-h-[650px] max-h-[900px] flex flex-col relative border border-[var(--es-border)]">

        {step === "home" && (
          <HomeBusca onBuscar={processarCpf} pessoasNoLocal={pessoasNoLocal} onSaida={handleSaidaDaLista} />
        )}

        {/* CAMINHO A: USUÁRIO NOVO — validação de segurança (BigDataCorp) */}
        {step === "validacao-novo" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={1} />
            <ValidacaoNovoUser
              dadosBigData={dadosPessoa}
              etapaInicial={voltandoDoWhatsapp ? 2 : 1}
              onSucesso={() => setStep("pergunta-whatsapp")}
              onFalha={resetarFluxo}
              onVoltar={resetarFluxo}
            />
          </>
        )}

        {/* CAMINHO A: uma pergunta por tela — WhatsApp e Placa coletados aqui
            para não pedir de novo na Autorização/Empresa */}
        {step === "pergunta-whatsapp" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={1} />
            <PerguntaWhatsapp
              onConfirmar={(phone) => {
                setDadosPessoa({ ...dadosPessoa, phone });
                setStep("pergunta-placa");
              }}
              onVoltar={() => {
                setVoltandoDoWhatsapp(true);
                setStep("validacao-novo");
              }}
            />
          </>
        )}

        {step === "pergunta-placa" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={2} />
            <PerguntaPlaca
              onConfirmar={(placa) => {
                setDadosPessoa({ ...dadosPessoa, placa });
                setStep("pergunta-motivo");
              }}
              onVoltar={() => setStep("pergunta-whatsapp")}
            />
          </>
        )}

        {/* CAMINHO B: USUÁRIO EXISTENTE — confirma identidade por selfie, pergunta
            a placa usada hoje (pode ter trocado de carro) e vai pro perfil */}
        {step === "confirmacao-selfie" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_EXISTENTE} atual={1} />
            <ConfirmacaoSelfie
              dados={dadosPessoa}
              onConfirmado={() => setStep("pergunta-placa-existente")}
              onRejeitado={resetarFluxo}
            />
          </>
        )}

        {step === "pergunta-placa-existente" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_EXISTENTE} atual={2} />
            <PerguntaPlaca
              onConfirmar={(placa) => {
                setDadosPessoa({ ...dadosPessoa, placa });
                setStep("perfil");
              }}
              onVoltar={() => setStep("confirmacao-selfie")}
            />
          </>
        )}

        {step === "perfil" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_EXISTENTE} atual={3} />
            <PerfilPessoa
              dados={dadosPessoa}
              onNovaAutorizacao={() => setStep("pergunta-destino")}
              onLiberarAcesso={handleLiberarAcesso}
              onVoltar={resetarFluxo}
            />
          </>
        )}

        {/* SEQUÊNCIA DE AUTORIZAÇÃO — uma pergunta por tela, igual às perguntas
            secretas e a placa. Motivo só aparece pra cadastro novo (pessoa já
            cadastrada já tem perfil definido); as outras 3 telas são
            compartilhadas pelos dois fluxos. Só mostra o progresso quando faz
            parte do atendimento inicial — pedido extra a partir do Perfil de
            alguém já atendido não é mais "um fluxo". */}
        {step === "pergunta-motivo" && (
          <>
            <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />
            <PerguntaMotivo
              onConfirmar={(motivo) => {
                setDadosPessoa({ ...dadosPessoa, type: motivo });
                setStep(motivo === "Prestador de Serviço" ? "pergunta-empresa" : "pergunta-destino");
              }}
              onVoltar={() => setStep("pergunta-placa")}
            />
          </>
        )}

        {/* Só existe pra Prestador de Serviço — Visitante pula direto pro Destino */}
        {step === "pergunta-empresa" && (
          <>
            {!dadosPessoa?.id && <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />}
            <PerguntaEmpresa
              onConfirmar={(empresa) => {
                setDadosPessoa({ ...dadosPessoa, empresa });
                setStep("pergunta-destino");
              }}
              onVoltar={() => setStep("pergunta-motivo")}
            />
          </>
        )}

        {step === "pergunta-destino" && (
          <>
            {!dadosPessoa?.id && <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />}
            <PerguntaDestino
              motivo={dadosPessoa?.type}
              onConfirmar={(destino) => {
                setDadosPessoa({ ...dadosPessoa, destino });
                setStep("pergunta-autorizador");
              }}
              onVoltar={() => {
                if (dadosPessoa?.id) setStep("perfil");
                else if (dadosPessoa?.type === "Prestador de Serviço") setStep("pergunta-empresa");
                else setStep("pergunta-motivo");
              }}
            />
          </>
        )}

        {step === "pergunta-autorizador" && (
          <>
            {!dadosPessoa?.id && <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />}
            <PerguntaAutorizador
              onConfirmar={(autorizador) => {
                setDadosPessoa({ ...dadosPessoa, autorizador });
                setStep("pergunta-periodo");
              }}
              onVoltar={() => setStep("pergunta-destino")}
            />
          </>
        )}

        {step === "pergunta-periodo" && (
          <>
            {!dadosPessoa?.id && <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />}
            <PerguntaPeriodo
              onConfirmar={(periodo) => {
                setDadosPessoa({ ...dadosPessoa, periodo });
                setStep("pergunta-observacoes");
              }}
              onVoltar={() => setStep("pergunta-autorizador")}
            />
          </>
        )}

        {step === "pergunta-observacoes" && (
          <>
            {!dadosPessoa?.id && <ProgressoAtendimento etapas={ETAPAS_NOVO} atual={3} />}
            <PerguntaObservacoes
              dados={dadosPessoa}
              onConcluir={handleConcluirAutorizacao}
              onVoltar={() => setStep("pergunta-periodo")}
            />
          </>
        )}

      </div>
      <Toaster
        position="top-center"
        richColors
        duration={3000}
        toastOptions={{
          classNames: {
            toast: "!min-h-[72px] !rounded-[14px] !items-center",
            title: "!text-[19px] !font-semibold !leading-snug",
          },
        }}
      />
    </div>
  );
}