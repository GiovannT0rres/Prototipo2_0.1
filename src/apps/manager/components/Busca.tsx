import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  indexarPessoas,
  tagsDisponiveis,
  executarConsulta,
  sugerir,
  pessoasRecentes,
  pendenciasAbertas,
  type PessoaIndexada,
  type Tag,
} from "../filters";
import { onStoreAtualizado } from "../mocks/mockManagerStore";
import { BarraBusca } from "./BarraBusca";
import { PainelBusca } from "./PainelBusca";
import { ResultadoLista } from "./ResultadoLista";
import { ConcederAutorizacaoModal } from "./ConcederAutorizacaoModal";
import { CriarConviteModal } from "./CriarConviteModal";

// "Visto por último" — recência de sessão (spec §6.4), não persistida.
export const RECENTES_SESSAO: string[] = [];

export function registrarVisita(id: string) {
  const i = RECENTES_SESSAO.indexOf(id);
  if (i > -1) RECENTES_SESSAO.splice(i, 1);
  RECENTES_SESSAO.unshift(id);
  RECENTES_SESSAO.length = Math.min(RECENTES_SESSAO.length, 5);
}

type Verbo = "pessoas" | "pendencias" | "notificacoes" | "nova" | "convite";

export function Busca() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [aberto, setAberto] = useState(false);
  const [assumindoPendencia, setAssumindoPendencia] = useState<PessoaIndexada | null>(null);
  const [novaAutorizacaoAberta, setNovaAutorizacaoAberta] = useState(false);
  const [criandoConvite, setCriandoConvite] = useState<"aberto" | "predefinido" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null!);
  const [, forceRefresh] = useState(0);

  useEffect(() => onStoreAtualizado(() => forceRefresh((n) => n + 1)), []);

  const texto = params.get("q") ?? "";
  const tagIds = useMemo(() => (params.get("tags") ?? "").split(",").filter(Boolean), [params]);

  const pessoas = useMemo(() => indexarPessoas(), [params]); // eslint-disable-line react-hooks/exhaustive-deps
  const tagsBase = useMemo(() => tagsDisponiveis(pessoas), [pessoas]);
  const tagsAtivasObjs = tagsBase.filter((t) => tagIds.includes(t.id));

  const consultando = texto.trim().length > 0 || tagIds.length > 0;
  const resultado = useMemo(() => executarConsulta(pessoas, texto, tagIds), [pessoas, texto, tagIds]);
  const { pessoas: sugPessoas, tags: sugTags } = useMemo(
    () => sugerir(pessoas, tagsBase.filter((t) => !tagIds.includes(t.id)), texto),
    [pessoas, tagsBase, tagIds, texto],
  );

  const tagsPorSecao = useMemo(() => {
    const grupos: Partial<Record<Tag["secao"], Tag[]>> = {};
    tagsBase
      .filter((t) => pessoas.some(t.aplica))
      .forEach((t) => {
        grupos[t.secao] = [...(grupos[t.secao] ?? []), t];
      });
    return grupos;
  }, [tagsBase, pessoas]);

  function setTexto(v: string) {
    const next = new URLSearchParams(params);
    if (v) next.set("q", v);
    else next.delete("q");
    setParams(next, { replace: true });
  }

  function toggleTag(id: string) {
    const next = new URLSearchParams(params);
    const atuais = new Set(tagIds);
    if (atuais.has(id)) atuais.delete(id);
    else atuais.add(id);
    if (atuais.size) next.set("tags", [...atuais].join(","));
    else next.delete("tags");
    next.delete("q");
    setParams(next, { replace: true });
  }

  function abrirPessoa(id: string) {
    registrarVisita(id);
    navigate(`/manager/pessoa/${id}`, { state: { contexto: resultado.map((p) => p.id) } });
  }

  function onVerbo(verbo: Verbo) {
    setAberto(false);
    if (verbo === "pessoas") {
      setParams(texto ? { q: texto } : {});
      return;
    }
    if (verbo === "pendencias") {
      toggleTag("cadastro:aguardando-autorizacao");
      return;
    }
    if (verbo === "notificacoes") {
      navigate("/manager/notificacoes");
      return;
    }
    if (verbo === "nova") {
      setNovaAutorizacaoAberta(true);
      return;
    }
    if (verbo === "convite") {
      setCriandoConvite("aberto");
      return;
    }
  }

  const recentes = pessoasRecentes(pessoas, RECENTES_SESSAO);
  const pendentes = pendenciasAbertas(pessoas);

  return (
    <div className={`flex-1 flex flex-col ${consultando ? "" : "justify-center"} px-5 pb-10 relative`}>
      {!consultando && (
        <div className="text-center mb-5">
          <h1 className="text-[25px] font-bold tracking-tight text-gray-900">Quem você procura?</h1>
          <p className="text-[14px] text-gray-500 mt-1">Busque uma pessoa, ou escolha um filtro para ver o que precisa de você.</p>
        </div>
      )}
      <div className="relative">
        <BarraBusca
          texto={texto}
          onTexto={setTexto}
          tagsAtivas={tagsAtivasObjs}
          onRemoverTag={toggleTag}
          onAbrir={() => setAberto(true)}
          hero={!consultando}
          inputRef={inputRef}
        />
        {aberto && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setAberto(false)} />
            <PainelBusca
              texto={texto}
              tagsAtivas={tagIds}
              recentes={recentes}
              pendentes={pendentes}
              sugestoesPessoas={sugPessoas}
              sugestoesTags={sugTags}
              tagsPorSecao={tagsPorSecao}
              onEscolherPessoa={(id) => {
                setAberto(false);
                abrirPessoa(id);
              }}
              onToggleTag={toggleTag}
              onVerbo={onVerbo}
            />
          </>
        )}
      </div>

      {consultando && (
        <div className="mt-4 max-w-4xl w-full mx-auto">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[12.5px] text-gray-500">{resultado.length === 1 ? "1 pessoa" : `${resultado.length} pessoas`}</p>
          </div>
          <ResultadoLista
            pessoas={resultado}
            tagsBase={tagsBase}
            onAbrirPessoa={abrirPessoa}
            onToggleTag={toggleTag}
            onAssumirPendencia={setAssumindoPendencia}
          />
        </div>
      )}

      {novaAutorizacaoAberta && <ConcederAutorizacaoModal onFechar={() => setNovaAutorizacaoAberta(false)} />}

      {assumindoPendencia && (
        <ConcederAutorizacaoModal
          pessoaFixa={{
            id: assumindoPendencia.id,
            nome: assumindoPendencia.nome,
            cpf: assumindoPendencia.cpf,
            telefone: assumindoPendencia.telefone,
            avatar: assumindoPendencia.avatar,
          }}
          onFechar={() => setAssumindoPendencia(null)}
        />
      )}

      {criandoConvite && (
        <CriarConviteModal
          predefinido={criandoConvite === "predefinido"}
          onFechar={() => setCriandoConvite(null)}
          onCriado={() => setCriandoConvite(null)}
        />
      )}
    </div>
  );
}
