import { useState, useEffect, useRef } from "react";
import LexChatbot from "./LexChatbot";
import {
  WHATSAPP_NUMBER, DOURADO, AREIA, SERIF,
  OptBtn, PrimaryBtn, BotBubble, UserBubble, TypingRow, ChatShell, colStack,
} from "./brand";

// ─── Taxas médias do BACEN por modalidade (% ao mês, ref. 2025–2026) ───
const TAXAS_MEDIAS = {
  pessoal:        { label: "Empréstimo pessoal",        taxa: 7.0  },
  veiculo:        { label: "Financiamento de veículo",  taxa: 1.8  },
  rotativo:       { label: "Cartão de crédito (rotativo)", taxa: 14.0 },
  cheque:         { label: "Cheque especial",           taxa: 8.0  },
  consignado:     { label: "Consignado",                taxa: 2.0  },
  imobiliario:    { label: "Financiamento imobiliário", taxa: 0.9  },
  outro:          { label: "Outro",                     taxa: 5.0  },
};

const BANCOS = [
  "Nubank", "Bradesco", "Itaú", "Santander", "Caixa",
  "Banco do Brasil", "C6 Bank", "Inter", "PicPay", "Pan",
  "BMG", "Safra", "BV Financeira", "Outro",
];

const DAMAGE_OPTIONS = [
  { key: "financial",  icon: "💸", label: "Prejuízo financeiro direto" },
  { key: "moral",      icon: "😔", label: "Dano moral / constrangimento" },
  { key: "reputation", icon: "💼", label: "Reputação profissional afetada" },
  { key: "privacy",    icon: "🔐", label: "Dados pessoais expostos" },
  { key: "credit",     icon: "📉", label: "Crédito negado / nome negativado" },
  { key: "other",      icon: "📋", label: "Outros danos" },
];


function DamageSelector({ damages, setDamages }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
      {DAMAGE_OPTIONS.map(d => (
        <OptBtn key={d.key} icon={d.icon} label={d.label}
          selected={damages.includes(d.key)}
          onClick={() => setDamages(prev =>
            prev.includes(d.key) ? prev.filter(x => x !== d.key) : [...prev, d.key]
          )}
        />
      ))}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, multiline }) {
  const shared = {
    width: "100%",
    padding: "10px 14px",
    border: "2px solid #e8e0d0",
    borderRadius: "11px",
    fontFamily: "inherit",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    background: "#fff",
    color: "#333",
  };
  if (multiline) return (
    <textarea rows={4} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={shared}
      onFocus={e => e.target.style.borderColor = DOURADO}
      onBlur={e => e.target.style.borderColor = "#e8e0d0"}
    />
  );
  return (
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={shared}
      onFocus={e => e.target.style.borderColor = DOURADO}
      onBlur={e => e.target.style.borderColor = "#e8e0d0"}
    />
  );
}

function NumberInput({ placeholder, value, onChange, prefix }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {prefix && <span style={{ fontSize: "13px", fontWeight: 600, color: "#666" }}>{prefix}</span>}
      <input type="number" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, padding: "10px 14px",
          border: "2px solid #e8e0d0", borderRadius: "11px",
          fontFamily: "inherit", fontSize: "13px",
          outline: "none", background: "#fff", color: "#333",
        }}
        onFocus={e => e.target.style.borderColor = DOURADO}
        onBlur={e => e.target.style.borderColor = "#e8e0d0"}
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function HubLex() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUI, setShowUI] = useState(null);
  const [step, setStep] = useState(0);
  const [journey, setJourney] = useState([]);
  const bottomRef = useRef(null);

  // Hub state
  const [vertical, setVertical] = useState(null); // golpe|conta|juros|outros

  // Golpe state
  const [golpeTipo, setGolpeTipo] = useState(null);
  const [golpeValor, setGolpeValor] = useState(null);
  const [golpeQuando, setGolpeQuando] = useState(null);
  const [golpeProvidencias, setGolpeProvidencias] = useState([]);
  const [golpeBancoDevolveu, setGolpeBancoDevolveu] = useState(null);
  const [golpeProvas, setGolpeProvas] = useState(null);

  // Juros state
  const [jurosTipo, setJurosTipo] = useState(null);
  const [jurosSabeTaxa, setJurosSabeTaxa] = useState(null);
  const [jurosTaxa, setJurosTaxa] = useState("");
  const [jurosParcela, setJurosParcela] = useState("");
  const [jurosRestantes, setJurosRestantes] = useState("");
  const [jurosBanco, setJurosBanco] = useState(null);
  const [jurosNegativado, setJurosNegativado] = useState(null);

  // Outros state
  const [outrosTipo, setOutrosTipo] = useState(null);
  // Negativação
  const [negReconhece, setNegReconhece] = useState(null);
  const [negTempo, setNegTempo] = useState(null);
  const [negPrejuizo, setNegPrejuizo] = useState([]);
  const [negTentou, setNegTentou] = useState(null);
  // Consignado
  const [consAposentado, setConsAposentado] = useState(null);
  const [consDesconto, setConsDesconto] = useState(null);
  const [consBanco, setConsBanco] = useState(null);
  const [consValor, setConsValor] = useState("");
  const [consReclamou, setConsReclamou] = useState(null);
  // Bloqueio bancário
  const [bloqBanco, setBloqBanco] = useState(null);
  const [bloqJustificativa, setBloqJustificativa] = useState(null);
  const [bloqSaldo, setBloqSaldo] = useState(null);
  const [bloqSalario, setBloqSalario] = useState(null);
  // LGPD
  const [lgpdDados, setLgpdDados] = useState([]);
  const [lgpdEmpresa, setLgpdEmpresa] = useState(null);
  const [lgpdPrejuizo, setLgpdPrejuizo] = useState([]);
  const [lgpdNotificou, setLgpdNotificou] = useState(null);
  // Difamação
  const [difOnde, setDifOnde] = useState(null);
  const [difConhece, setDifConhece] = useState(null);
  const [difIntimo, setDifIntimo] = useState(null);
  const [difDenunciou, setDifDenunciou] = useState(null);
  const [difProvas, setDifProvas] = useState(null);

  // Shared final
  const [nome, setNome] = useState("");
  const [relato, setRelato] = useState("");
  const [damages, setDamages] = useState([]);

  const addBot  = (text) => setMessages(p => [...p, { role: "bot",  text, id: Math.random() }]);
  const addUser = (text) => setMessages(p => [...p, { role: "user", text, id: Math.random() }]);
  const addJ    = (label, value) => setJourney(p => [...p, { label, value }]);

  const botDelay = (text, delay, after) => {
    setIsTyping(true); setShowUI(null);
    setTimeout(() => { setIsTyping(false); addBot(text); if (after) after(); }, delay);
  };

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, showUI, isTyping]);

  // ─── Init ───
  // Guarda contra dupla execução (React.StrictMode monta o efeito duas vezes em dev)
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    setTimeout(() => {
      addBot("Olá! Eu sou o **Lex**, assistente jurídico do escritório **Marques & Cunha**. 👋");
      botDelay("Estou aqui para entender sua situação e verificar se podemos te ajudar juridicamente.", 1500,
        () => botDelay("Me conta: **o que aconteceu com você?**", 1200,
          () => setShowUI("hub-start")
        )
      );
    }, 400);
  }, []);

  // ─── WhatsApp builder ───
  const buildWAMessage = () => {
    let msg = `*Novo caso — Lex Assistente Jurídico*\n━━━━━━━━━━━━━━━━━━\n`;
    msg += `\n*IDENTIFICAÇÃO*\n`;
    msg += `• Nome: ${nome}\n`;

    const verticalLabels = {
      golpe: "Golpe / Fraude",
      juros: "Juros Abusivos",
      outros: "Outro problema jurídico",
    };
    msg += `• Vertical: ${verticalLabels[vertical] || vertical}\n`;

    msg += `\n*DIAGNÓSTICO DO CASO*\n`;
    journey.forEach(j => { msg += `• ${j.label}: ${j.value}\n`; });

    if (damages.length > 0) {
      msg += `\n*DANOS SOFRIDOS*\n`;
      damages.forEach(d => {
        const opt = DAMAGE_OPTIONS.find(o => o.key === d);
        if (opt) msg += `• ${opt.label}\n`;
      });
    }

    if (relato) {
      msg += `\n*RELATO DO CASO*\n${relato}\n`;
    }

    return encodeURIComponent(msg);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWAMessage()}`, "_blank");
  };


  // ═══════════════════════════════════════
  // RENDER UI SECTIONS
  // ═══════════════════════════════════════

  const renderUI = () => {
    if (!showUI || isTyping) return null;

    // ─── HUB START ───
    if (showUI === "hub-start") return (
      <div style={colStack}>
        <OptBtn icon="🚨" label="Caí em um golpe"
          sub="PIX, falsa central, falso advogado, compra fraudulenta"
          onClick={() => {
            addUser("Caí em um golpe");
            addJ("Vertical", "Golpe / Fraude");
            setVertical("golpe");
            botDelay("Sinto muito por isso. Vou te ajudar a entender se existe um caminho jurídico para o seu caso.", 1200,
              () => botDelay("**Que tipo de golpe aconteceu?**", 1000, () => setShowUI("golpe-tipo"))
            );
          }}
        />
        <OptBtn icon="🔒" label="Perdi minha conta"
          sub="Instagram, Facebook, WhatsApp, TikTok, e-mail"
          onClick={() => { setVertical("conta"); }}
        />
        <OptBtn icon="📊" label="Estou com juros abusivos"
          sub="Empréstimo, cartão, cheque especial, financiamento"
          onClick={() => {
            addUser("Estou com juros abusivos");
            addJ("Vertical", "Juros Abusivos");
            setVertical("juros");
            botDelay("Antes de mais nada, preciso entender se sua dívida realmente está com juros acima do que o mercado pratica.", 1400,
              () => botDelay("**Qual tipo de dívida você tem?**", 1000, () => setShowUI("juros-tipo"))
            );
          }}
        />
        <OptBtn icon="⚖️" label="Outro problema"
          sub="Negativação, dados vazados, difamação, conta bancária bloqueada"
          onClick={() => {
            addUser("Outro problema");
            addJ("Vertical", "Outro problema jurídico");
            setVertical("outros");
            botDelay("Certo! Me conta qual situação se parece mais com a sua:", 1200,
              () => setShowUI("outros-tipo")
            );
          }}
        />
      </div>
    );



    // ═══════════════════════════════════════
    // GOLPE FLOW
    // ═══════════════════════════════════════

    if (showUI === "golpe-tipo") return (
      <div style={colStack}>
        {[
          { key: "pix",        icon: "💸", label: "Golpe do PIX / transferência" },
          { key: "central",    icon: "📞", label: "Falsa central telefônica / banco" },
          { key: "falso",      icon: "🎭", label: "Falso advogado / falso funcionário" },
          { key: "compra",     icon: "🛒", label: "Compra online fraudulenta" },
          { key: "cartao",     icon: "💳", label: "Clonagem de cartão" },
          { key: "emprestimo", icon: "🏦", label: "Empréstimo / consignado não autorizado" },
          { key: "outro",      icon: "❓", label: "Outro golpe" },
        ].map(o => (
          <OptBtn key={o.key} icon={o.icon} label={o.label} onClick={() => {
            setGolpeTipo(o.key);
            addUser(o.label);
            addJ("Tipo de golpe", o.label);
            botDelay("**Qual foi o valor aproximado do prejuízo?**", 1000, () => setShowUI("golpe-valor"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-valor") return (
      <div style={colStack}>
        {[
          { key: "ate1k",    label: "Até R$ 1.000" },
          { key: "1k5k",    label: "R$ 1.000 a R$ 5.000" },
          { key: "5k20k",   label: "R$ 5.000 a R$ 20.000" },
          { key: "acima20k", label: "Acima de R$ 20.000" },
          { key: "naosei",  label: "Não sei / prefiro não dizer" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setGolpeValor(o.key);
            addUser(o.label);
            addJ("Valor do prejuízo", o.label);
            botDelay("**Quando isso aconteceu?**", 1000, () => setShowUI("golpe-quando"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-quando") return (
      <div style={colStack}>
        {[
          { key: "hoje",    label: "Hoje ou ontem" },
          { key: "semana",  label: "Nesta semana" },
          { key: "mes",     label: "Neste mês" },
          { key: "mais30",  label: "Há mais de 30 dias" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setGolpeQuando(o.key);
            addUser(o.label);
            addJ("Quando aconteceu", o.label);

            // MED urgency for PIX
            if (golpeTipo === "pix" && o.key === "hoje") {
              botDelay("⚠️ **Atenção — ação urgente necessária!**", 800, () => {
                addBot("Se o golpe foi via PIX, o banco pode acionar o **MED (Mecanismo Especial de Devolução)** para tentar recuperar o valor. Mas a eficácia cai rapidamente com o tempo.");
                botDelay("**Entre em contato com seu banco AGORA** e peça expressamente o acionamento do MED. Depois, continue aqui para completarmos a análise.", 1400,
                  () => botDelay("**O que você já fez até agora?**", 1000, () => setShowUI("golpe-providencias"))
                );
              });
            } else if (golpeTipo === "pix") {
              botDelay("Se o golpe foi via PIX, existe o **MED (Mecanismo Especial de Devolução)** — um mecanismo do Banco Central para tentar recuperar valores. O prazo é de até 80 dias, mas a eficácia é maior nos primeiros dias.", 1400,
                () => botDelay("**O que você já fez até agora?**", 1000, () => setShowUI("golpe-providencias"))
              );
            } else {
              botDelay("**O que você já fez até agora?**", 1000, () => setShowUI("golpe-providencias"));
            }
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-providencias") return (
      <div style={colStack}>
        {[
          { key: "bo",         label: "Registrei B.O." },
          { key: "banco",      label: "Contatei o banco" },
          { key: "reclamacao", label: "Abri reclamação (BACEN / consumidor.gov)" },
          { key: "nada",       label: "Nada ainda" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label}
            selected={golpeProvidencias.includes(o.key)}
            onClick={() => {
              setGolpeProvidencias(prev =>
                prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
              );
            }}
          />
        ))}
        <PrimaryBtn onClick={() => {
          const labels = golpeProvidencias.length > 0
            ? golpeProvidencias.map(k => {
                const map = { bo: "B.O.", banco: "Contatou banco", reclamacao: "Reclamação formal", nada: "Nada ainda" };
                return map[k] || k;
              }).join(", ")
            : "Nada ainda";
          addUser(labels);
          addJ("Providências tomadas", labels);

          if (golpeProvidencias.includes("nada")) {
            botDelay("Recomendo que você faça o quanto antes:", 800, () => {
              addBot("**1.** Registre um **B.O. online** (delegacia eletrônica do seu estado)\n**2.** Contate seu banco e peça protocolo\n**3.** Salve todos os prints e comprovantes");
              botDelay("**O banco devolveu ou estornou algum valor?**", 1200, () => setShowUI("golpe-devolveu"));
            });
          } else {
            botDelay("**O banco devolveu ou estornou algum valor?**", 1000, () => setShowUI("golpe-devolveu"));
          }
        }} label="Confirmar →" />
      </div>
    );

    if (showUI === "golpe-devolveu") return (
      <div style={colStack}>
        {[
          { key: "sim_tudo",   label: "Sim, devolveu tudo" },
          { key: "parcial",    label: "Devolveu parcialmente" },
          { key: "nao",        label: "Não, se recusou" },
          { key: "sem_resp",   label: "Ainda não respondeu" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setGolpeBancoDevolveu(o.key);
            addUser(o.label);
            addJ("Banco devolveu", o.label);
            botDelay("**Você tem prints ou comprovantes do golpe salvos?**", 1000, () => setShowUI("golpe-provas"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-provas") return (
      <div style={colStack}>
        {[
          { key: "sim",     label: "Sim, tenho tudo salvo" },
          { key: "alguns",  label: "Tenho alguns" },
          { key: "nao",     label: "Não tenho nada" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setGolpeProvas(o.key);
            addUser(o.label);
            addJ("Provas disponíveis", o.label);

            if (o.key === "nao") {
              botDelay("⚠️ **Preservar provas é fundamental.** Antes de mais nada, salve:", 800, () => {
                addBot("• Conversas com o golpista (prints/capturas)\n• Comprovantes de transferência\n• E-mails ou SMS recebidos\n• Números de telefone e perfis usados pelo golpista");
                botDelay("Agora, para completar sua análise, preciso de algumas informações.", 1200,
                  () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
                );
              });
            } else {
              botDelay("Para completar sua análise, preciso de algumas informações.", 1000,
                () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
              );
            }
          }} />
        ))}
      </div>
    );

    // ═══════════════════════════════════════
    // JUROS FLOW
    // ═══════════════════════════════════════

    if (showUI === "juros-tipo") return (
      <div style={colStack}>
        {Object.entries(TAXAS_MEDIAS).map(([k, v]) => (
          <OptBtn key={k} label={v.label} onClick={() => {
            setJurosTipo(k);
            addUser(v.label);
            addJ("Tipo de dívida", v.label);
            botDelay("**Qual é o valor total aproximado da sua dívida?**", 1000, () => setShowUI("juros-valor-total"));
          }} />
        ))}
      </div>
    );

    if (showUI === "juros-valor-total") return (
      <div style={colStack}>
        <OptBtn label="Acima de R$ 20.000" onClick={() => {
          addUser("Acima de R$ 20.000");
          addJ("Valor total da dívida", "Acima de R$ 20.000");
          botDelay("**Você sabe qual é a taxa de juros que está pagando?**", 1000, () => setShowUI("juros-sabe-taxa"));
        }} />
        <OptBtn label="Entre R$ 5.000 e R$ 20.000" onClick={() => {
          addUser("Entre R$ 5.000 e R$ 20.000");
          addJ("Valor total da dívida", "R$ 5.000 a R$ 20.000");
          botDelay("**Você sabe qual é a taxa de juros que está pagando?**", 1000, () => setShowUI("juros-sabe-taxa"));
        }} />
        <OptBtn label="Abaixo de R$ 5.000" onClick={() => {
          addUser("Abaixo de R$ 5.000");
          addJ("Valor total da dívida", "Abaixo de R$ 5.000");
          botDelay("**Você sabe qual é a taxa de juros que está pagando?**", 1000, () => setShowUI("juros-sabe-taxa"));
        }} />
      </div>
    );

    if (showUI === "juros-sabe-taxa") return (
      <div style={colStack}>
        <OptBtn label="Sim, sei a taxa" onClick={() => {
          setJurosSabeTaxa("sim");
          addUser("Sim, sei a taxa");
          botDelay("**Qual é a taxa de juros mensal que você está pagando?** (% ao mês)", 1000, () => setShowUI("juros-taxa-input"));
        }} />
        <OptBtn label="Não sei, mas tenho o contrato" onClick={() => {
          setJurosSabeTaxa("contrato");
          addUser("Não sei, mas tenho o contrato");
          addJ("Sabe a taxa", "Não, mas tem contrato");
          botDelay("A taxa geralmente aparece no contrato como **CET (Custo Efetivo Total)** ou **taxa de juros mensal**. No app do banco, procure em \"meus contratos\" ou \"detalhes do empréstimo\".", 1400,
            () => botDelay("Vamos continuar com as outras informações. **Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"))
          );
        }} />
        <OptBtn label="Não sei e não tenho contrato" onClick={() => {
          setJurosSabeTaxa("nao");
          addUser("Não sei e não tenho contrato");
          addJ("Sabe a taxa", "Não sabe e não tem contrato");
          botDelay("Você tem o direito de solicitar uma cópia do contrato ao banco — é garantido pelo Código de Defesa do Consumidor. Recomendo que peça por escrito.", 1400,
            () => botDelay("Vamos continuar. **Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"))
          );
        }} />
      </div>
    );

    if (showUI === "juros-taxa-input") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NumberInput placeholder="Ex: 8.5" value={jurosTaxa} onChange={setJurosTaxa} prefix="% a.m." />
        <PrimaryBtn onClick={() => {
          if (!jurosTaxa) return;
          const taxa = parseFloat(jurosTaxa);
          addUser(`${taxa}% ao mês`);
          addJ("Taxa informada", `${taxa}% a.m.`);

          const ref = TAXAS_MEDIAS[jurosTipo] || TAXAS_MEDIAS.outro;
          const media = ref.taxa;
          addJ("Taxa média do mercado", `${media}% a.m. (${ref.label})`);

          const ratio = taxa / media;
          if (ratio > 1.5) {
            botDelay(`📊 **Resultado da análise:** Sua taxa de **${taxa}% a.m.** está **${Math.round((ratio - 1) * 100)}% acima** da média de mercado para ${ref.label.toLowerCase()} (**${media}% a.m.**).`, 1200, () => {
              addBot("Isso pode configurar **juros abusivos** e você pode ter direito à revisão do contrato, com possível redução do saldo devedor.");
              addJ("Análise", "Taxa significativamente acima da média — possível abusividade");
              botDelay("**Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"));
            });
          } else if (ratio > 1.0) {
            botDelay(`📊 Sua taxa de **${taxa}% a.m.** está **levemente acima** da média de mercado (**${media}% a.m.**). Pode haver margem para revisão, especialmente se o contrato tiver outras cláusulas abusivas (TAC, seguros embutidos, capitalização).`, 1400, () => {
              addJ("Análise", "Taxa levemente acima da média");
              botDelay("**Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"));
            });
          } else {
            botDelay(`📊 Sua taxa de **${taxa}% a.m.** está **dentro da média** de mercado (**${media}% a.m.**). Ainda assim, pode haver outras cláusulas abusivas no contrato (tarifas, seguros embutidos, capitalização indevida).`, 1400, () => {
              addJ("Análise", "Taxa dentro da média — verificar outras cláusulas");
              botDelay("**Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"));
            });
          }
        }} label="Analisar →" />
      </div>
    );

    if (showUI === "juros-parcela") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NumberInput placeholder="Valor da parcela" value={jurosParcela} onChange={setJurosParcela} prefix="R$" />
        <NumberInput placeholder="Parcelas restantes" value={jurosRestantes} onChange={setJurosRestantes} />
        <PrimaryBtn onClick={() => {
          if (!jurosParcela) return;
          addUser(`Parcela: R$ ${jurosParcela} | Restantes: ${jurosRestantes || "não informado"}`);
          addJ("Parcela", `R$ ${jurosParcela}`);
          if (jurosRestantes) addJ("Parcelas restantes", jurosRestantes);
          botDelay("**Qual banco ou financeira?**", 1000, () => setShowUI("juros-banco"));
        }} label="Continuar →" />
      </div>
    );

    if (showUI === "juros-banco") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {BANCOS.map(b => (
          <OptBtn key={b} label={b} onClick={() => {
            setJurosBanco(b);
            addUser(b);
            addJ("Banco / Financeira", b);
            botDelay("**Você está com o nome negativado (SPC/Serasa)?**", 1000, () => setShowUI("juros-negativado"));
          }} />
        ))}
      </div>
    );

    if (showUI === "juros-negativado") return (
      <div style={colStack}>
        <OptBtn label="Sim, estou negativado" onClick={() => {
          setJurosNegativado("sim");
          addUser("Sim, estou negativado");
          addJ("Negativado", "Sim");
          botDelay("A negativação pode abrir uma frente adicional de **dano moral** se for considerada indevida ou desproporcional. Isso fortalece o caso.", 1200,
            () => botDelay("Para completar, preciso de algumas informações.", 800,
              () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
            )
          );
        }} />
        <OptBtn label="Não" onClick={() => {
          setJurosNegativado("nao");
          addUser("Não");
          addJ("Negativado", "Não");
          botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
        }} />
        <OptBtn label="Não sei" onClick={() => {
          setJurosNegativado("naosei");
          addUser("Não sei");
          addJ("Negativado", "Não sabe");
          botDelay("Você pode consultar gratuitamente no site do **Registrato** (Banco Central) ou no **Serasa**.", 1200,
            () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
          );
        }} />
      </div>
    );

    // ═══════════════════════════════════════
    // OUTROS FLOW
    // ═══════════════════════════════════════

    if (showUI === "outros-tipo") return (
      <div style={colStack}>
        {[
          { key: "negativacao", icon: "📉", label: "Nome negativado indevidamente (SPC/Serasa)" },
          { key: "consignado",  icon: "🏦", label: "Empréstimo/consignado no meu nome sem autorização" },
          { key: "bloqueio",    icon: "🔒", label: "Conta bancária bloqueada sem explicação" },
          { key: "lgpd",        icon: "🔐", label: "Dados pessoais vazados" },
          { key: "difamacao",   icon: "🗣️", label: "Difamação / uso indevido do meu nome online" },
          { key: "generico",    icon: "📝", label: "Outro problema" },
        ].map(o => (
          <OptBtn key={o.key} icon={o.icon} label={o.label} onClick={() => {
            setOutrosTipo(o.key);
            addUser(o.label);
            addJ("Tipo de problema", o.label);

            if (o.key === "negativacao") {
              botDelay("**Você reconhece a dívida que gerou a negativação?**", 1000, () => setShowUI("neg-reconhece"));
            } else if (o.key === "consignado") {
              botDelay("**Você é aposentado, pensionista ou servidor público?**", 1000, () => setShowUI("cons-aposentado"));
            } else if (o.key === "bloqueio") {
              botDelay("**Qual banco bloqueou sua conta?**", 1000, () => setShowUI("bloq-banco"));
            } else if (o.key === "lgpd") {
              botDelay("**Quais dados foram vazados?**", 1000, () => setShowUI("lgpd-dados"));
            } else if (o.key === "difamacao") {
              botDelay("**Onde está acontecendo?**", 1000, () => setShowUI("dif-onde"));
            } else {
              botDelay("Me conta brevemente o que aconteceu. Vou encaminhar para nossa equipe analisar.", 1000, () => setShowUI("coleta-nome"));
            }
          }} />
        ))}
      </div>
    );

    // ── Negativação ──
    if (showUI === "neg-reconhece") return (
      <div style={colStack}>
        {[
          { key: "nao",   label: "Não reconheço essa dívida" },
          { key: "sim",   label: "Sim, reconheço" },
          { key: "parcial", label: "Reconheço parcialmente" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setNegReconhece(o.key);
            addUser(o.label);
            addJ("Reconhece a dívida", o.label);
            botDelay("**Há quanto tempo está negativado?**", 1000, () => setShowUI("neg-tempo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "neg-tempo") return (
      <div style={colStack}>
        {[
          { key: "30d",    label: "Menos de 30 dias" },
          { key: "1_6m",   label: "1 a 6 meses" },
          { key: "6m_5a",  label: "6 meses a 5 anos" },
          { key: "mais5a", label: "Mais de 5 anos" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setNegTempo(o.key);
            addUser(o.label);
            addJ("Tempo negativado", o.label);

            if (o.key === "mais5a") {
              botDelay("⚠️ **Informação importante:** A Súmula 323 do STJ estabelece que a negativação não pode durar mais de 5 anos. Se sua situação ultrapassa esse prazo, há forte argumento para remoção imediata + dano moral.", 1400,
                () => botDelay("**A negativação causou algum prejuízo concreto?**", 1000, () => setShowUI("neg-prejuizo"))
              );
            } else {
              botDelay("**A negativação causou algum prejuízo concreto?**", 1000, () => setShowUI("neg-prejuizo"));
            }
          }} />
        ))}
      </div>
    );

    if (showUI === "neg-prejuizo") return (
      <div style={colStack}>
        {[
          { key: "credito",         label: "Crédito negado" },
          { key: "financiamento",   label: "Financiamento negado" },
          { key: "constrangimento", label: "Constrangimento" },
          { key: "nenhum",          label: "Nenhum prejuízo concreto" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label}
            selected={negPrejuizo.includes(o.key)}
            onClick={() => setNegPrejuizo(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <PrimaryBtn onClick={() => {
          const txt = negPrejuizo.length > 0
            ? negPrejuizo.map(k => ({ credito: "Crédito negado", financiamento: "Financiamento negado", constrangimento: "Constrangimento", nenhum: "Nenhum" }[k])).join(", ")
            : "Não informado";
          addUser(txt);
          addJ("Prejuízo da negativação", txt);

          if (negReconhece === "nao") {
            botDelay("**Caso forte:** Negativação por dívida não reconhecida configura dano moral. Vamos montar seu dossiê.", 1200,
              () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
            );
          } else {
            botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
          }
        }} label="Confirmar →" />
      </div>
    );

    // ── Consignado ──
    if (showUI === "cons-aposentado") return (
      <div style={colStack}>
        {[
          { key: "sim", label: "Sim" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setConsAposentado(o.key);
            addUser(o.label);
            addJ("Aposentado/pensionista/servidor", o.label);
            botDelay("**Apareceu um desconto no seu contracheque ou benefício que você não autorizou?**", 1000, () => setShowUI("cons-desconto"));
          }} />
        ))}
      </div>
    );

    if (showUI === "cons-desconto") return (
      <div style={colStack}>
        <OptBtn label="Sim, apareceu um desconto" onClick={() => {
          setConsDesconto("sim");
          addUser("Sim, apareceu desconto não autorizado");
          addJ("Desconto não autorizado", "Sim");
          botDelay("**Qual banco fez o empréstimo?**", 1000, () => setShowUI("cons-banco"));
        }} />
        <OptBtn label="Não, mas recebi dinheiro que não pedi" onClick={() => {
          setConsDesconto("dinheiro");
          addUser("Recebi dinheiro que não pedi");
          addJ("Desconto não autorizado", "Recebeu dinheiro não solicitado");
          botDelay("**Qual banco fez o empréstimo?**", 1000, () => setShowUI("cons-banco"));
        }} />
        <OptBtn label="Não" onClick={() => {
          setConsDesconto("nao");
          addUser("Não");
          addJ("Desconto não autorizado", "Não");
          botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
        }} />
      </div>
    );

    if (showUI === "cons-banco") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {BANCOS.map(b => (
          <OptBtn key={b} label={b} onClick={() => {
            setConsBanco(b);
            addUser(b);
            addJ("Banco do consignado", b);
            botDelay("**Qual o valor do desconto mensal?**", 1000, () => setShowUI("cons-valor"));
          }} />
        ))}
      </div>
    );

    if (showUI === "cons-valor") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NumberInput placeholder="Valor do desconto mensal" value={consValor} onChange={setConsValor} prefix="R$" />
        <PrimaryBtn onClick={() => {
          if (!consValor) return;
          addUser(`R$ ${consValor}/mês`);
          addJ("Desconto mensal", `R$ ${consValor}`);
          botDelay("**Já reclamou no banco ou no INSS?**", 1000, () => setShowUI("cons-reclamou"));
        }} label="Continuar →" />
      </div>
    );

    if (showUI === "cons-reclamou") return (
      <div style={colStack}>
        {[
          { key: "sim",  label: "Sim, sem sucesso" },
          { key: "nao",  label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setConsReclamou(o.key);
            addUser(o.label);
            addJ("Já reclamou", o.label);

            if (consAposentado === "sim") {
              botDelay("**Caso com alto potencial:** Contratação não autorizada de consignado para aposentado/pensionista configura prática abusiva. Há jurisprudência consolidada para restituição + dano moral.", 1400,
                () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
              );
            } else {
              botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
            }
          }} />
        ))}
      </div>
    );

    // ── Bloqueio bancário ──
    if (showUI === "bloq-banco") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {BANCOS.map(b => (
          <OptBtn key={b} label={b} onClick={() => {
            setBloqBanco(b);
            addUser(b);
            addJ("Banco", b);
            botDelay("**Recebeu alguma justificativa para o bloqueio?**", 1000, () => setShowUI("bloq-justificativa"));
          }} />
        ))}
      </div>
    );

    if (showUI === "bloq-justificativa") return (
      <div style={colStack}>
        {[
          { key: "sim", label: "Sim, recebi justificativa" },
          { key: "nao", label: "Não, nenhuma explicação" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setBloqJustificativa(o.key);
            addUser(o.label);
            addJ("Recebeu justificativa", o.label);
            botDelay("**Tem saldo ou dinheiro retido na conta?**", 1000, () => setShowUI("bloq-saldo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "bloq-saldo") return (
      <div style={colStack}>
        <OptBtn label="Sim, tenho saldo retido" onClick={() => {
          setBloqSaldo("sim");
          addUser("Sim, tenho saldo retido");
          addJ("Saldo retido", "Sim");
          botDelay("**A conta é usada para receber salário ou benefícios?**", 1000, () => setShowUI("bloq-salario"));
        }} />
        <OptBtn label="Não" onClick={() => {
          setBloqSaldo("nao");
          addUser("Não");
          addJ("Saldo retido", "Não");
          botDelay("**A conta é usada para receber salário ou benefícios?**", 1000, () => setShowUI("bloq-salario"));
        }} />
      </div>
    );

    if (showUI === "bloq-salario") return (
      <div style={colStack}>
        {[
          { key: "sim", label: "Sim, recebo salário/benefício nessa conta" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setBloqSalario(o.key);
            addUser(o.label);
            addJ("Conta-salário", o.label);

            if (bloqSaldo === "sim" && bloqJustificativa === "nao") {
              botDelay("**Caso com urgência alta:** Saldo retido sem justificativa pode configurar falha grave do serviço bancário. Pode caber tutela de urgência para desbloqueio imediato.", 1400,
                () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
              );
            } else {
              botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
            }
          }} />
        ))}
      </div>
    );

    // ── LGPD ──
    if (showUI === "lgpd-dados") return (
      <div style={colStack}>
        {[
          { key: "cpf",      label: "CPF" },
          { key: "email",    label: "E-mail" },
          { key: "telefone", label: "Telefone" },
          { key: "bancario", label: "Dados bancários" },
          { key: "fotos",    label: "Fotos / imagens pessoais" },
          { key: "outros",   label: "Outros dados" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label}
            selected={lgpdDados.includes(o.key)}
            onClick={() => setLgpdDados(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <PrimaryBtn onClick={() => {
          const txt = lgpdDados.join(", ") || "Não informado";
          addUser(txt);
          addJ("Dados vazados", txt);
          botDelay("**Sabe qual empresa vazou seus dados?**", 1000, () => setShowUI("lgpd-empresa"));
        }} label="Confirmar →" />
      </div>
    );

    if (showUI === "lgpd-empresa") return (
      <div style={colStack}>
        <OptBtn label="Sim, sei qual empresa" onClick={() => {
          setLgpdEmpresa("sim");
          addUser("Sim, sei qual empresa");
          addJ("Empresa identificada", "Sim");
          botDelay("**Sofreu algum prejuízo após o vazamento?**", 1000, () => setShowUI("lgpd-prejuizo"));
        }} />
        <OptBtn label="Não sei" onClick={() => {
          setLgpdEmpresa("nao");
          addUser("Não sei qual empresa");
          addJ("Empresa identificada", "Não");
          botDelay("**Sofreu algum prejuízo após o vazamento?**", 1000, () => setShowUI("lgpd-prejuizo"));
        }} />
      </div>
    );

    if (showUI === "lgpd-prejuizo") return (
      <div style={colStack}>
        {[
          { key: "golpe",       label: "Fui vítima de golpe após o vazamento" },
          { key: "spam",        label: "Recebo spam / ligações indesejadas" },
          { key: "negativacao", label: "Fui negativado indevidamente" },
          { key: "exposicao",   label: "Dados/fotos foram expostos publicamente" },
          { key: "nenhum",      label: "Nenhum prejuízo concreto" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label}
            selected={lgpdPrejuizo.includes(o.key)}
            onClick={() => setLgpdPrejuizo(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <PrimaryBtn onClick={() => {
          const txt = lgpdPrejuizo.join(", ") || "Nenhum";
          addUser(txt);
          addJ("Prejuízo pós-vazamento", txt);

          if (lgpdDados.includes("bancario")) {
            botDelay("**Caso forte:** Vazamento de dados bancários com prejuízo concreto tem jurisprudência consolidada para indenização.", 1200,
              () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
            );
          } else {
            botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
          }
        }} label="Confirmar →" />
      </div>
    );

    // ── Difamação ──
    if (showUI === "dif-onde") return (
      <div style={colStack}>
        {[
          { key: "instagram",  label: "Instagram" },
          { key: "facebook",   label: "Facebook" },
          { key: "tiktok",     label: "TikTok" },
          { key: "google",     label: "Google / sites" },
          { key: "whatsapp",   label: "WhatsApp / grupos" },
          { key: "outro",      label: "Outro" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setDifOnde(o.key);
            addUser(o.label);
            addJ("Plataforma (difamação)", o.label);
            botDelay("**Você conhece quem está fazendo isso?**", 1000, () => setShowUI("dif-conhece"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-conhece") return (
      <div style={colStack}>
        {[
          { key: "sim", label: "Sim, conheço" },
          { key: "nao", label: "Não sei quem é" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setDifConhece(o.key);
            addUser(o.label);
            addJ("Conhece o autor", o.label);
            botDelay("**É conteúdo íntimo ou sexual publicado sem seu consentimento?**", 1000, () => setShowUI("dif-intimo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-intimo") return (
      <div style={colStack}>
        <OptBtn label="Sim" onClick={() => {
          setDifIntimo("sim");
          addUser("Sim, conteúdo íntimo sem consentimento");
          addJ("Conteúdo íntimo", "Sim");
          botDelay("⚠️ **Isso é crime** tipificado pela Lei 13.718/2018. Além da responsabilidade criminal, há direito a indenização por dano moral.", 1200,
            () => botDelay("**Tem prints ou provas salvas?**", 1000, () => setShowUI("dif-provas"))
          );
        }} />
        <OptBtn label="Não" onClick={() => {
          setDifIntimo("nao");
          addUser("Não");
          addJ("Conteúdo íntimo", "Não");
          botDelay("**Já tentou denunciar na plataforma?**", 1000, () => setShowUI("dif-denunciou"));
        }} />
      </div>
    );

    if (showUI === "dif-denunciou") return (
      <div style={colStack}>
        {[
          { key: "sim", label: "Sim, sem resultado" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setDifDenunciou(o.key);
            addUser(o.label);
            addJ("Denunciou na plataforma", o.label);
            botDelay("**Tem prints ou provas salvas?**", 1000, () => setShowUI("dif-provas"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-provas") return (
      <div style={colStack}>
        {[
          { key: "sim",  label: "Sim, tenho prints" },
          { key: "nao",  label: "Não tenho provas" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} onClick={() => {
            setDifProvas(o.key);
            addUser(o.label);
            addJ("Provas (difamação)", o.label);

            if (o.key === "nao") {
              botDelay("⚠️ **Urgente:** Preserve as provas AGORA. Faça prints de tudo — perfis, conversas, publicações. Se possível, registre em cartório (ata notarial).", 1200,
                () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
              );
            } else {
              botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
            }
          }} />
        ))}
      </div>
    );

    // ═══════════════════════════════════════
    // COLETA FINAL (shared)
    // ═══════════════════════════════════════

    if (showUI === "coleta-nome") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <TextInput placeholder="Seu nome completo" value={nome} onChange={setNome} />
        <PrimaryBtn onClick={() => {
          if (!nome.trim()) return;
          addUser(nome);
          addJ("Nome", nome);
          botDelay("Agora me conte, em poucas palavras, **o que aconteceu:**", 800, () => setShowUI("coleta-relato"));
        }} label="Continuar →" />
      </div>
    );

    if (showUI === "coleta-relato") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <TextInput placeholder={
          vertical === "golpe" ? "Descreva como o golpe aconteceu, valores envolvidos e o que o golpista fez..." :
          vertical === "juros" ? "Descreva sua situação com o banco, dificuldades que está enfrentando..." :
          "Descreva brevemente o que aconteceu..."
        } value={relato} onChange={setRelato} multiline />
        <PrimaryBtn onClick={() => {
          if (!relato.trim()) return;
          addUser(relato);
          botDelay("**Quais danos você sofreu?** (selecione todos que se aplicam)", 800, () => setShowUI("coleta-danos"));
        }} label="Continuar →" />
      </div>
    );

    if (showUI === "coleta-danos") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <DamageSelector damages={damages} setDamages={setDamages} />
        <PrimaryBtn onClick={() => {
          const labels = damages.map(d => DAMAGE_OPTIONS.find(o => o.key === d)?.label).filter(Boolean).join(", ") || "Não informado";
          addUser(labels);

          botDelay("Obrigado, **" + nome.split(" ")[0] + "**! Analisei todas as informações.", 1200, () => {
            addBot("Um advogado especializado vai revisar seu caso e entrar em contato com orientações específicas.");
            botDelay("Clique abaixo para enviar tudo pelo WhatsApp:", 1000, () => setShowUI("whatsapp-final"));
          });
        }} label="Finalizar análise →" />
      </div>
    );

    if (showUI === "whatsapp-final") return (
      <div style={{ marginTop: "4px", padding: "18px", background: "linear-gradient(135deg, #0f1e34, #15253f)", borderRadius: "14px", boxShadow: "0 4px 20px rgba(21,37,63,0.2)" }}>
        <div style={{ fontFamily: SERIF, fontSize: "14.5px", fontWeight: "700", color: AREIA, marginBottom: "8px" }}>Fale com um advogado especialista</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.55", marginBottom: "14px" }}>Seu caso será analisado com prioridade. Todas as informações que você compartilhou serão enviadas automaticamente para agilizar o atendimento.</div>
        <button onClick={openWhatsApp}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #20b954, #25D366)", border: "none", borderRadius: "11px", cursor: "pointer", fontSize: "14px", color: "#fff", fontFamily: "inherit", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        ><span style={{ fontSize: "17px" }}>💬</span>Falar pelo WhatsApp agora</button>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "10px" }}>Atendimento em horário comercial · Resposta em até 2h úteis</div>
      </div>
    );

    return null;
  };

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════

  // ─── Se escolheu "Perdi minha conta", renderiza o Lex inline ───
  if (vertical === "conta") return <LexChatbot />;

  return (
    <ChatShell>
      {messages.map(m => m.role === "bot"
        ? <BotBubble key={m.id} text={m.text} />
        : <UserBubble key={m.id} text={m.text} />)}

      {isTyping && <TypingRow />}

      {renderUI()}

      <div ref={bottomRef} />
    </ChatShell>
  );
}
