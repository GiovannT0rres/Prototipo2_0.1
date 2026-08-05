import { useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Plus, MessageCircle } from "lucide-react";
import { indexarPessoas, quemAutorizou, quemEstaPessoaAutorizou } from "../filters";
import { PERFIL_AUTORIDADE } from "../types";
import { AuthorizationList } from "./AuthorizationList";
import { ConcederAutorizacaoModal } from "./ConcederAutorizacaoModal";
import { registrarVisita } from "./Busca";

export function Perfil() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalAberto, setModalAberto] = useState(false);
  const [, forceRefresh] = useState(0);

  const contexto: string[] = (location.state as { contexto?: string[] } | null)?.contexto ?? [];
  const pessoas = useMemo(() => indexarPessoas(), [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const pessoa = pessoas.find((p) => p.id === id);

  if (!pessoa) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Pessoa não encontrada.</p>
        <button onClick={() => navigate("/manager")} className="mt-2 text-emerald-700 font-medium hover:underline">
          Voltar à busca
        </button>
      </div>
    );
  }

  const irmaos = contexto.length ? contexto : pessoas.map((p) => p.id);
  const posicao = irmaos.indexOf(pessoa.id);
  const anteriorId = posicao > 0 ? irmaos[posicao - 1] : null;
  const proximoId = posicao > -1 && posicao < irmaos.length - 1 ? irmaos[posicao + 1] : null;

  function irPara(novoId: string | null) {
    if (!novoId) return;
    registrarVisita(novoId);
    navigate(`/manager/pessoa/${novoId}`, { state: { contexto: irmaos }, replace: true });
  }

  const autorizador = quemAutorizou(pessoas, pessoa.id);
  const autorizados = quemEstaPessoaAutorizou(pessoas, pessoa.id);
  const autoridade = pessoa.motivoAtual ? PERFIL_AUTORIDADE[pessoa.motivoAtual] : null;

  const titular = pessoa.titularId ? pessoas.find((p) => p.id === pessoa.titularId) : undefined;
  const rotuloVinculo = titular
    ? pessoa.motivoAtual === "Dependente"
      ? `Dependente de ${titular.nome}`
      : `Patrocinado(a) por ${titular.nome}`
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-emerald-700 font-medium text-[13px] hover:bg-emerald-50 rounded-lg px-2 py-1">
          <ChevronLeft size={16} /> Voltar
        </button>
        <h2 className="text-[14px] font-semibold flex-1">{pessoa.nome}</h2>
        {irmaos.length > 1 && (
          <div className="flex items-center gap-2 text-[12.5px] text-gray-500">
            <span className="tabular-nums">{posicao + 1} de {irmaos.length}</span>
            <button
              disabled={!anteriorId}
              onClick={() => irPara(anteriorId)}
              className="border border-gray-200 rounded-lg px-2 py-1 disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft size={14} /> {anteriorId ? pessoas.find((p) => p.id === anteriorId)?.nome.split(" ")[0] : "—"}
            </button>
            <button
              disabled={!proximoId}
              onClick={() => irPara(proximoId)}
              className="border border-gray-200 rounded-lg px-2 py-1 disabled:opacity-30 flex items-center gap-1"
            >
              {proximoId ? pessoas.find((p) => p.id === proximoId)?.nome.split(" ")[0] : "—"} <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-[280px_1fr] max-lg:grid-cols-1">
        <aside className="p-5 border-r border-gray-100 bg-gray-50/50 max-lg:border-r-0 max-lg:border-b">
          <img src={pessoa.avatar} alt="" className="w-20 h-20 rounded-full object-cover mb-3" />
          <h2 className="text-[19px] font-bold text-gray-900">{pessoa.nome}</h2>
          <p className="text-[12.5px] text-gray-500 tabular-nums">{pessoa.cpf}</p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setModalAberto(true)}
              className="flex-1 h-8 rounded-lg bg-emerald-600 text-white text-[12.5px] font-medium flex items-center justify-center gap-1 hover:bg-emerald-700"
            >
              <Plus size={13} /> Autorizar
            </button>
            <button className="h-8 px-3 rounded-lg border border-gray-200 text-[12.5px] font-medium flex items-center gap-1 hover:bg-gray-50">
              <MessageCircle size={13} />
            </button>
          </div>

          <dl className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            {rotuloVinculo && (
              <div>
                <dt className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide">Vínculo</dt>
                <dd className="text-[13px] mt-0.5">{rotuloVinculo}</dd>
              </div>
            )}
            {autoridade && (
              <div>
                <dt className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide">Autoridade do perfil</dt>
                <dd className="text-[13px] mt-0.5 text-gray-600">{autoridade}</dd>
              </div>
            )}
            {pessoa.placa && (
              <div>
                <dt className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide">Placa</dt>
                <dd className="text-[13px] mt-0.5">{pessoa.placa}</dd>
              </div>
            )}
          </dl>
        </aside>

        <div className="p-5 space-y-6 min-w-0">
          {pessoa.statusCadastro === "aguardando-autorizacao" && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div>
                <p className="text-[13px] font-semibold text-amber-900">Aguardando autorização</p>
                <p className="text-[12.5px] text-amber-800 mt-0.5">
                  Cadastro concluído no Bot. Falta definir perfil e período — a pendência é de{" "}
                  {pessoas.find((p) => p.id === pessoa.convidadorId)?.nome ?? "quem convidou"}, que resolve no Check-in.
                </p>
              </div>
              <button
                onClick={() => setModalAberto(true)}
                className="ml-auto flex-none h-8 px-3 rounded-lg bg-emerald-600 text-white text-[12.5px] font-medium hover:bg-emerald-700"
              >
                Definir
              </button>
            </div>
          )}

          {pessoa.autorizacoes.length > 0 && (
            <section>
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Autorizações</h3>
              <AuthorizationList
                autorizacoes={pessoa.autorizacoes}
                onAtualizado={() => forceRefresh((n) => n + 1)}
                onAbrirPerfil={(personId) => irPara(personId)}
              />
            </section>
          )}

          <section>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Quem esta pessoa autorizou</h3>
            {autorizados.length ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {autorizados.map((a) => (
                  <button key={a.id} onClick={() => irPara(a.id)} className="w-full flex items-center gap-2.5 p-2.5 hover:bg-gray-50 text-left">
                    <img src={a.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover flex-none" />
                    <span className="flex-1 text-[13px] font-medium">{a.nome}</span>
                    {a.motivoAtual && <span className="text-[11.5px] text-gray-500">{a.motivoAtual}</span>}
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-500 border border-gray-200 rounded-xl p-3">
                Ninguém — este perfil {pessoa.motivoAtual ? `(${pessoa.motivoAtual}) ` : ""}não autoriza outras pessoas.
              </p>
            )}
          </section>

          {autorizador && (
            <p className="text-[12.5px] text-gray-500">
              Autorizado por{" "}
              <button onClick={() => irPara(autorizador.id)} className="text-emerald-700 font-medium hover:underline">
                {autorizador.nome}
              </button>
            </p>
          )}
        </div>
      </div>

      {modalAberto && (
        <ConcederAutorizacaoModal
          pessoaFixa={{ id: pessoa.id, nome: pessoa.nome, cpf: pessoa.cpf, telefone: pessoa.telefone, avatar: pessoa.avatar }}
          onFechar={() => {
            setModalAberto(false);
            forceRefresh((n) => n + 1);
          }}
        />
      )}
    </div>
  );
}
