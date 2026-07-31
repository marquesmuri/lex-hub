import { useState, useRef, useEffect } from "react";
import {
  WHATSAPP_NUMBER, AZUL, AZUL_CLARO, DOURADO, AREIA,
  OptBtn, PrimaryBtn, GhostBtn, BotBubble, UserBubble, TypingRow, ChatShell, colStack,
} from "./brand";

/**
 * LEX-ECA — Triagem de alvará judicial para conteúdo com crianças e adolescentes.
 * ECA Digital (Lei 15.211/2025) · Decreto 12.880/2026 · Resolução CNJ 687/2026.
 *
 * Montado pelo HubLex quando vertical === "eca". Recebe onGoToRecovery para a
 * ponte com o fluxo de recuperação de conta ("Perdi minha conta").
 *
 * Padrões herdados do LexChatbot:
 *  - respostas em useRef (answers) => leitura estável dentro de closures de botDelay
 *    (mesmo motivo do useRef em name/emailChanged no LexChatbot)
 *  - enquadramento travado (análogo a forcedProb): vedação => C; notificação com
 *    prazo => urgência "alta" — nenhum passo posterior rebaixa
 *  - mensagem de WhatsApp montada por omissão de campos vazios (JOURNEY_SKIP)
 */
export default function LexEca({ onGoToRecovery }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUI, setShowUI] = useState(null);
  const [inputVal, setInputVal] = useState("");

  const answers = useRef({}); // fonte única das respostas (logic)
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showUI]);

  // Intro ao montar
  useEffect(() => {
    botDelay("Olá! Eu sou o **Lex**, assistente do Marques & Cunha Advogados.", 700, () =>
      botDelay(
        "Desde junho de 2026, as redes sociais passaram a exigir **alvará judicial** para conteúdo com crianças e adolescentes em algumas situações — e nem sempre é óbvio se o seu caso se encaixa.",
        1600, () =>
        botDelay("Vou te fazer algumas perguntas rápidas para indicar o caminho certo. Leva uns **2 minutos**.", 1400, () =>
          botDelay("Para começar: **uma criança ou adolescente aparece no conteúdo que você produz?**", 1200, () =>
            setShowUI("q_aparece")
          )
        )
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── helpers ───
  const addBot = (text) => setMessages((m) => [...m, { from: "bot", text }]);
  const addUser = (text) => setMessages((m) => [...m, { from: "user", text }]);

  const botDelay = (text, ms = 1000, cb) => {
    setIsTyping(true);
    setShowUI(null);
    setTimeout(() => {
      setIsTyping(false);
      addBot(text);
      if (cb) cb();
    }, ms);
  };

  const pick = (userLabel, next) => {
    addUser(userLabel);
    next();
  };

  // ─── classificação ───
  const calcUrgencia = () => {
    const a = answers.current;
    if (a.notificacao === "sim_prazo") return "alta"; // travado no topo
    if (a.seguidores === "acima30k" || a.seguidores === "de10a30k" || a.notificacao === "receio")
      return "media";
    return "baixa";
  };
  const precisaRevisaoHumana = () => {
    const a = answers.current;
    return a.monetiza === "naosei" || a.vedacao === "naosei" || a.habitualidade === "ocasional";
  };

  // ─── WhatsApp (omite campos vazios — JOURNEY_SKIP) ───
  const FAIXA = { primeira_infancia: "0 a 6 anos", infancia: "7 a 11 anos", adol_inicial: "12 a 15 anos", adol: "16 ou 17 anos" };
  const QTD = { um: "1", doisMais: "2 ou mais" };
  const NOTIF = { sim_prazo: "Sim, com prazo", nao: "Não recebeu", receio: "Ainda não, mas com receio" };
  const SEG = { ate10k: "até 10 mil", de10a30k: "10 mil a 30 mil", acima30k: "acima de 30 mil" };

  const resumoLinhas = () => {
    const a = answers.current;
    const l = [];
    if (a.faixaEtaria) l.push(`• Idade da criança: ${FAIXA[a.faixaEtaria]}`);
    if (a.qtdMenores) l.push(`• Nº de crianças: ${QTD[a.qtdMenores]}`);
    if (a.notificacao) l.push(`• Notificação de plataforma: ${NOTIF[a.notificacao]}`);
    if (a.seguidores) l.push(`• Tamanho da conta: ${SEG[a.seguidores]}`);
    if (a.perfil) l.push(`• Perfil: ${a.perfil}`);
    if (a.nomeResponsavel) l.push(`• Nome: ${a.nomeResponsavel}`);
    return l;
  };

  const buildWA = (ramo) => {
    const a = answers.current;
    let corpo;
    if (ramo === "B" || ramo === "LIMITROFE") {
      const cab = ramo === "B"
        ? "Olá! Vim pelo Lex e minha triagem indicou que preciso de ALVARÁ para conteúdo com criança/adolescente."
        : "Olá! Vim pelo Lex. Minha triagem ficou numa zona limítrofe (exposição pontual) e quero uma análise sobre a necessidade (ou não) de alvará.";
      const r = resumoLinhas();
      if (ramo === "B") r.unshift("• Enquadramento: precisa de alvará (monetizado/impulsionado + habitual)");
      if (calcUrgencia() === "alta") r.push("• ATENÇÃO — notificação com prazo em curso (urgente)");
      if (precisaRevisaoHumana()) r.push("• (alguns pontos a confirmar na conversa)");
      corpo = `${cab}\n\nResumo:\n${r.join("\n")}`;
    } else if (ramo === "A") {
      const r = [];
      if (a.perfil) r.push(`• Perfil: ${a.perfil}`);
      if (a.nomeResponsavel) r.push(`• Nome: ${a.nomeResponsavel}`);
      corpo = "Olá! Vim pelo Lex. Minha triagem indicou que meu caso provavelmente NÃO exige alvará, mas quero orientação de privacidade/proteção de dados para conteúdo com meus filhos."
        + (r.length ? `\n${r.join("\n")}` : "");
    } else if (ramo === "C") {
      corpo = "Olá! Vim pelo Lex e preciso conversar com um advogado sobre uma situação envolvendo conteúdo com criança. Prefiro tratar diretamente com a equipe.";
    } else {
      corpo = "Olá! Vim pelo Lex e gostaria de falar com o Marques & Cunha Advogados.";
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(corpo)}`;
  };
  const openWA = (ramo) => window.open(buildWA(ramo), "_blank");

  const reiniciar = () => {
    answers.current = {};
    setMessages([]);
    setIsTyping(false);
    setInputVal("");
    setShowUI(null);
    botDelay("Vamos recomeçar. **Uma criança ou adolescente aparece no conteúdo que você produz?**", 600, () =>
      setShowUI("q_aparece")
    );
  };

  // ─── transições ───
  const goFaixa = (v) => {
    answers.current.faixaEtaria = v;
    if (v === "primeira_infancia") {
      botDelay("Importante: casos de **primeira infância** recebem **atenção redobrada da Justiça** — o pedido precisa ser **bem delimitado**. É exatamente o tipo de caso em que faz diferença ter apoio jurídico especializado.", 1500, () =>
        botDelay("**Aparece mais de uma criança ou adolescente no conteúdo?**", 1100, () => setShowUI("q_quantos"))
      );
    } else {
      botDelay("**Aparece mais de uma criança ou adolescente no conteúdo?**", 1100, () => setShowUI("q_quantos"));
    }
  };

  const goQuantos = (v) => {
    answers.current.qtdMenores = v;
    const proximo = () => botDelay("**Você já recebeu alguma notificação** da Meta (Instagram/Facebook) ou de outra plataforma pedindo o alvará, **com prazo para responder?**", 1300, () => setShowUI("q_notificacao"));
    if (v === "doisMais") {
      botDelay("Nesse caso, **cada criança precisa do seu próprio alvará** — a gente cuida de todos no mesmo atendimento.", 1300, proximo);
    } else {
      proximo();
    }
  };

  const entrarColeta = (ramo) => {
    answers.current.ramoColeta = ramo;
    const intro = ramo === "A"
      ? "Entendi seu caso. Ele **provavelmente não exige alvará**, mas há cuidados importantes de **privacidade e proteção de dados**. Vou te conectar com nossa equipe. Só preciso de **dois dados**:"
      : "Pronto — já tenho o que preciso para te orientar. Vou te passar para um **especialista** dar sequência. Só preciso de **dois dados**:";
    botDelay(intro, 1300, () => botDelay("**Qual é o seu nome?**", 900, () => setShowUI("coleta_nome")));
  };

  const submitNome = () => {
    const v = inputVal.trim();
    if (!v) return;
    answers.current.nomeResponsavel = v;
    addUser(v);
    setInputVal("");
    botDelay("E qual o **@ ou o link do perfil?** (se preferir, toque em pular)", 900, () => setShowUI("coleta_perfil"));
  };

  const submitPerfil = (pular) => {
    const v = inputVal.trim();
    if (!pular && v) answers.current.perfil = v;
    addUser(pular || !v ? "(prefiro não informar agora)" : v);
    setInputVal("");
    // classificação final do ramo que passou pela coleta
    if (answers.current.ramoColeta === "A") {
      botDelay("Perfeito. Um **resumo** já vai com você para o nosso time.", 1100, () => setShowUI("cta_A"));
    } else if (answers.current.habitualidade === "pontual") {
      botDelay("Seu caso está numa **zona limítrofe**: a exposição parece **pontual**, e nem toda participação eventual exige alvará.", 1400, () =>
        botDelay("Vale uma conversa com nossa equipe para avaliar com precisão e evitar tanto o **risco de bloqueio** quanto um **pedido desnecessário**.", 1400, () => setShowUI("cta_limitrofe"))
      );
    } else {
      const u = calcUrgencia();
      const fechar = () => botDelay("Um **especialista** do Marques & Cunha vai te explicar os documentos e conduzir o pedido. Bora resolver?", 1300, () => setShowUI("cta_B"));
      botDelay("Pelo que você me contou, seu caso **se enquadra na exigência de alvará judicial** — conteúdo **monetizado ou impulsionado** com participação **habitual** de criança/adolescente.", 1500, () => {
        if (u === "alta") {
          botDelay("E como você já recebeu notificação com prazo, isso é **urgente**: sem regularização, **a conta pode ser bloqueada**. Dá para protocolar com **pedido de urgência** e usar o comprovante para segurar a plataforma. Vamos agir rápido.", 1600, fechar);
        } else if (u === "media") {
          botDelay("Pelo tamanho da sua conta, há **risco real de notificação** a qualquer momento — melhor **se antecipar** do que correr atrás depois de um bloqueio.", 1500, fechar);
        } else {
          fechar();
        }
      });
    }
  };

  // ═══════════════════════ RENDER UI ═══════════════════════
  const renderUI = () => {
    if (!showUI || isTyping) return null;

    switch (showUI) {
      case "q_aparece":
        return (
          <div style={colStack}>
            <OptBtn icon="👶" label="Sim, aparece" onClick={() => pick("Sim, aparece", () => {
              answers.current.apareceMenor = "sim";
              botDelay("Antes de qualquer coisa, preciso confirmar um **ponto de proteção**. **O conteúdo com a criança envolve algum destes elementos?**", 1300, () =>
                botDelay("• **cenas sensuais ou erotizadas**, ou com roupas/poses de adulto\n• **situações vexatórias ou degradantes**, que exponham a criança ao ridículo\n• **apostas, jogos de azar, álcool, cigarro** ou produtos proibidos para menores\n• **desafios perigosos**, **discurso de ódio** ou discriminação", 1400, () => setShowUI("q_vedacao"))
              );
            })} />
            <OptBtn icon="🚫" label="Não" onClick={() => pick("Não", () => {
              answers.current.apareceMenor = "nao";
              botDelay("Pelo que você me contou, seu caso **não envolve exposição de criança ou adolescente** — então a **exigência de alvará não se aplica**.", 1300, () => setShowUI("cta_fora"));
            })} />
          </div>
        );

      case "q_vedacao":
        return (
          <div style={colStack}>
            <OptBtn icon="✅" label="Não, nada disso" onClick={() => pick("Não, nada disso", () => {
              answers.current.vedacao = "nao";
              botDelay("**Esse conteúdo gera algum retorno financeiro para você?** Conta qualquer uma destas formas:", 1200, () =>
                botDelay("• **anúncios ou programa de monetização** (YouTube, bônus de Reels etc.)\n• **fundo de criador, assinaturas, gorjetas** ou \u201Cgifts\u201D\n• **publicidade, patrocínio**, recebimento de produtos ou **permuta**", 1300, () => setShowUI("q_monetiza"))
              );
            })} />
            <OptBtn icon="⚠️" label="Sim, algum deles" onClick={() => pick("Sim, algum deles", () => {
              answers.current.vedacao = "sim"; // trava C
              botDelay("Obrigado pela sinceridade. Esse tipo de conteúdo tem uma **proteção especial na lei**, e **não é algo que um alvará possa autorizar**.", 1400, () =>
                botDelay("O mais importante agora é a **segurança da criança**. O melhor caminho é **conversar diretamente com um advogado**, que vai te orientar com cuidado sobre a situação.", 1500, () => setShowUI("cta_C"))
              );
            })} />
            <OptBtn icon="🤔" label="Não tenho certeza" onClick={() => pick("Não tenho certeza", () => {
              answers.current.vedacao = "naosei";
              botDelay("Sem problema — a equipe confirma isso com você depois. **Esse conteúdo gera algum retorno financeiro?**", 1300, () =>
                botDelay("• **anúncios/monetização** • **fundo de criador, assinaturas, gifts** • **publicidade**, produtos ou **permuta**", 1200, () => setShowUI("q_monetiza"))
              );
            })} />
          </div>
        );

      case "q_monetiza":
        return (
          <div style={colStack}>
            <OptBtn icon="💰" label="Sim, alguma delas" onClick={() => pick("Sim, alguma delas", () => {
              answers.current.monetiza = "sim";
              botDelay("**Com que frequência a criança aparece nesse conteúdo?**", 1100, () => setShowUI("q_habitual"));
            })} />
            <OptBtn icon="🚫" label="Não, nenhuma" onClick={() => pick("Não, nenhuma", () => {
              answers.current.monetiza = "nao";
              botDelay("E você já **pagou para impulsionar ou promover** algum post em que essa criança aparece?", 1200, () => setShowUI("q_impulsiona"));
            })} />
            <OptBtn icon="🤔" label="Não tenho certeza" onClick={() => pick("Não tenho certeza", () => {
              answers.current.monetiza = "naosei";
              botDelay("**Com que frequência a criança aparece nesse conteúdo?**", 1100, () => setShowUI("q_habitual"));
            })} />
          </div>
        );

      case "q_impulsiona":
        return (
          <div style={colStack}>
            <OptBtn icon="📈" label="Sim, já impulsionei" onClick={() => pick("Sim, já impulsionei", () => {
              answers.current.impulsiona = "sim";
              botDelay("**Com que frequência a criança aparece nesse conteúdo?**", 1100, () => setShowUI("q_habitual"));
            })} />
            <OptBtn icon="🚫" label="Não, nunca" onClick={() => pick("Não, nunca", () => {
              answers.current.impulsiona = "nao";
              entrarColeta("A");
            })} />
          </div>
        );

      case "q_habitual":
        return (
          <div style={colStack}>
            <OptBtn icon="🔁" label="Toda semana / é rotina" onClick={() => pick("Toda semana / é rotina", () => {
              answers.current.habitualidade = "rotina";
              botDelay("**Qual a idade da criança ou adolescente?** (Se for mais de uma, considere a mais nova.)", 1100, () => setShowUI("q_faixa"));
            })} />
            <OptBtn icon="📅" label="Algumas vezes por mês" onClick={() => pick("Algumas vezes por mês", () => {
              answers.current.habitualidade = "ocasional";
              botDelay("**Qual a idade da criança ou adolescente?** (Se for mais de uma, considere a mais nova.)", 1100, () => setShowUI("q_faixa"));
            })} />
            <OptBtn icon="1️⃣" label="Foi pontual / poucas vezes" onClick={() => pick("Foi pontual / poucas vezes", () => {
              answers.current.habitualidade = "pontual";
              botDelay("**Qual a idade da criança ou adolescente?** (Se for mais de uma, considere a mais nova.)", 1100, () => setShowUI("q_faixa"));
            })} />
          </div>
        );

      case "q_faixa":
        return (
          <div style={colStack}>
            {[["0 a 6 anos", "primeira_infancia"], ["7 a 11 anos", "infancia"], ["12 a 15 anos", "adol_inicial"], ["16 ou 17 anos", "adol"]].map(([lbl, val]) => (
              <OptBtn key={val} icon="🎂" label={lbl} onClick={() => pick(lbl, () => goFaixa(val))} />
            ))}
          </div>
        );

      case "q_quantos":
        return (
          <div style={colStack}>
            <OptBtn icon="🧒" label="Só uma" onClick={() => pick("Só uma", () => goQuantos("um"))} />
            <OptBtn icon="👨‍👩‍👧‍👦" label="Duas ou mais" onClick={() => pick("Duas ou mais", () => goQuantos("doisMais"))} />
          </div>
        );

      case "q_notificacao":
        return (
          <div style={colStack}>
            <OptBtn icon="⏰" label="Sim, recebi com prazo" onClick={() => pick("Sim, recebi com prazo", () => {
              answers.current.notificacao = "sim_prazo";
              botDelay("Por último: **qual o tamanho aproximado da conta** onde o conteúdo é publicado?", 1100, () => setShowUI("q_seguidores"));
            })} />
            <OptBtn icon="📭" label="Não recebi" onClick={() => pick("Não recebi", () => {
              answers.current.notificacao = "nao";
              botDelay("Por último: **qual o tamanho aproximado da conta** onde o conteúdo é publicado?", 1100, () => setShowUI("q_seguidores"));
            })} />
            <OptBtn icon="😟" label="Ainda não, mas tenho receio" onClick={() => pick("Ainda não, mas tenho receio", () => {
              answers.current.notificacao = "receio";
              botDelay("Por último: **qual o tamanho aproximado da conta** onde o conteúdo é publicado?", 1100, () => setShowUI("q_seguidores"));
            })} />
          </div>
        );

      case "q_seguidores":
        return (
          <div style={colStack}>
            <OptBtn icon="👤" label="Até 10 mil seguidores" onClick={() => pick("Até 10 mil seguidores", () => { answers.current.seguidores = "ate10k"; entrarColeta("B"); })} />
            <OptBtn icon="👥" label="Entre 10 mil e 30 mil" onClick={() => pick("Entre 10 mil e 30 mil", () => { answers.current.seguidores = "de10a30k"; entrarColeta("B"); })} />
            <OptBtn icon="📣" label="Acima de 30 mil" onClick={() => pick("Acima de 30 mil", () => { answers.current.seguidores = "acima30k"; entrarColeta("B"); })} />
          </div>
        );

      case "coleta_nome":
        return (
          <div style={colStack}>
            <input value={inputVal} autoFocus placeholder="Digite seu nome"
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNome()}
              style={inputStyle} />
            <PrimaryBtn label="Enviar" onClick={submitNome} />
          </div>
        );

      case "coleta_perfil":
        return (
          <div style={colStack}>
            <input value={inputVal} autoFocus placeholder="@perfil ou link"
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitPerfil(false)}
              style={inputStyle} />
            <PrimaryBtn label="Enviar" onClick={() => submitPerfil(false)} />
            <GhostBtn label="Pular" onClick={() => submitPerfil(true)} />
          </div>
        );

      // ─── CTAs finais ───
      case "cta_B":
        return (
          <div style={colStack}>
            <PrimaryBtn label="Falar com o especialista" onClick={() => openWA("B")} />
            <GhostBtn label="Recomeçar" onClick={reiniciar} />
          </div>
        );

      case "cta_A":
        return (
          <div style={colStack}>
            <PrimaryBtn label="Quero orientação de privacidade" onClick={() => openWA("A")} />
            <GhostBtn label="Recomeçar" onClick={reiniciar} />
          </div>
        );

      case "cta_limitrofe":
        return (
          <div style={colStack}>
            <PrimaryBtn label="Quero essa análise" onClick={() => openWA("LIMITROFE")} />
            <GhostBtn label="Recomeçar" onClick={reiniciar} />
          </div>
        );

      case "cta_C":
        return (
          <div style={colStack}>
            <PrimaryBtn label="Falar com um advogado agora" onClick={() => openWA("C")} />
          </div>
        );

      case "cta_fora":
        return (
          <div style={colStack}>
            <OptBtn icon="🔓" label="Foi bloqueio ou invasão da minha conta"
              sub="Ir para a recuperação de conta"
              onClick={() => onGoToRecovery && onGoToRecovery()} />
            <PrimaryBtn label="Falar com o escritório" onClick={() => openWA("FORA")} />
            <GhostBtn label="Recomeçar" onClick={reiniciar} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ChatShell>
      {messages.map((m, i) =>
        m.from === "bot" ? <BotBubble key={i} text={m.text} /> : <UserBubble key={i} text={m.text} />
      )}
      {isTyping && <TypingRow />}
      {renderUI()}
      <div ref={endRef} />
    </ChatShell>
  );
}

const inputStyle = {
  padding: "12px 14px",
  border: `2px solid #e8e0d0`,
  borderRadius: "11px",
  fontSize: "14px",
  fontFamily: "inherit",
  color: AZUL,
  outline: "none",
  width: "100%",
};
