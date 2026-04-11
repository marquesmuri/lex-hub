import { useState, useEffect, useRef } from "react";

// =============================================
// ⚠️  CONFIGURAÇÃO — ALTERE ANTES DE PUBLICAR
// =============================================
const WHATSAPP_NUMBER = "5513997717255";
// =============================================

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

const fmt = (t) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

// ─── Componentes reutilizáveis ───────────────────────────────────

function OptBtn({ onClick, icon, label, sub, selected, small }) {
  const [hov, setHov] = useState(false);
  const active = selected || hov;
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: small ? "8px 12px" : "11px 14px",
        border: `2px solid ${active ? "#b79f6f" : "#e8e0d0"}`,
        borderRadius: "11px",
        background: active
          ? "linear-gradient(135deg, rgba(183,159,111,0.10), rgba(183,159,111,0.05))"
          : "#fff",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        fontFamily: "'Montserrat', sans-serif",
        transition: "all 0.15s ease",
        display: "flex", alignItems: "center", gap: "10px",
      }}
    >
      {icon && <span style={{ fontSize: small ? "16px" : "18px", flexShrink: 0 }}>{icon}</span>}
      <span>
        <span style={{
          fontSize: small ? "12px" : "13px", fontWeight: 600,
          color: active ? "#15253f" : "#333",
          display: "block",
        }}>{label}</span>
        {sub && <span style={{
          fontSize: "11px", color: "#888",
          display: "block", marginTop: "2px",
        }}>{sub}</span>}
      </span>
    </button>
  );
}

function DamageSelector({ damages, setDamages }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
      {DAMAGE_OPTIONS.map(d => (
        <OptBtn key={d.key} icon={d.icon} label={d.label} small
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
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
    background: "#fff",
    color: "#333",
  };
  if (multiline) return (
    <textarea rows={4} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={shared}
      onFocus={e => e.target.style.borderColor = "#b79f6f"}
      onBlur={e => e.target.style.borderColor = "#e8e0d0"}
    />
  );
  return (
    <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={shared}
      onFocus={e => e.target.style.borderColor = "#b79f6f"}
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
          fontFamily: "'Montserrat', sans-serif", fontSize: "13px",
          outline: "none", background: "#fff", color: "#333",
        }}
        onFocus={e => e.target.style.borderColor = "#b79f6f"}
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
  useEffect(() => {
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

  // ─── Render helpers ───
  const renderMessages = () => messages.map(m => (
    <div key={m.id} style={{
      display: "flex",
      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
      marginBottom: "8px",
    }}>
      {m.role === "bot" && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #15253f, #1e3a5f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", marginRight: "8px", flexShrink: 0, marginTop: "2px",
          color: "#f3e0a8", fontWeight: 700,
        }}>L</div>
      )}
      <div style={{
        maxWidth: "82%",
        padding: "10px 14px",
        borderRadius: m.role === "user"
          ? "14px 14px 4px 14px"
          : "14px 14px 14px 4px",
        background: m.role === "user"
          ? "linear-gradient(135deg, #15253f, #1e3a5f)"
          : "#f5f0e6",
        color: m.role === "user" ? "#f3e0a8" : "#333",
        fontSize: "13px",
        lineHeight: "1.5",
        fontFamily: "'Montserrat', sans-serif",
      }}>
        <span dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
      </div>
    </div>
  ));

  const renderGuide = (title, items) => (
    <div style={{
      background: "#f9f6ef", border: "1px solid #e8e0d0",
      borderRadius: "14px", padding: "14px 16px", margin: "8px 0",
    }}>
      <div style={{ fontWeight: 700, fontSize: "13px", color: "#15253f", marginBottom: "10px" }}>
        {title}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: "8px", marginBottom: "8px",
          fontSize: "12px", color: "#555", lineHeight: "1.5",
        }}>
          <span style={{
            background: "#15253f", color: "#f3e0a8",
            width: 20, height: 20, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "10px", fontWeight: 700, flexShrink: 0, marginTop: "1px",
          }}>{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: fmt(item) }} />
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════
  // RENDER UI SECTIONS
  // ═══════════════════════════════════════

  const renderUI = () => {
    if (!showUI || isTyping) return null;

    // ─── HUB START ───
    if (showUI === "hub-start") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
          onClick={() => {
            addUser("Perdi minha conta");
            setVertical("conta");
            botDelay("Para recuperação de contas, vou te redirecionar para nosso assistente especializado.", 1200, () => {
              setShowUI("redirect-lex");
            });
          }}
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

    // ─── REDIRECT LEX ───
    if (showUI === "redirect-lex") return (
      <div style={{
        background: "linear-gradient(135deg, #15253f, #1e3a5f)",
        borderRadius: "14px", padding: "18px", textAlign: "center",
      }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#f3e0a8", marginBottom: "8px" }}>
          Assistente de Recuperação de Contas
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "14px" }}>
          Nosso chatbot especializado vai diagnosticar seu caso e orientar os próximos passos.
        </div>
        <button onClick={() => window.open("https://falecomlex.vercel.app/", "_blank")}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #b79f6f, #d4b978)",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, color: "#15253f",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >Abrir assistente de contas →</button>
      </div>
    );

    // ═══════════════════════════════════════
    // GOLPE FLOW
    // ═══════════════════════════════════════

    if (showUI === "golpe-tipo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "pix",        icon: "💸", label: "Golpe do PIX / transferência" },
          { key: "central",    icon: "📞", label: "Falsa central telefônica / banco" },
          { key: "falso",      icon: "🎭", label: "Falso advogado / falso funcionário" },
          { key: "compra",     icon: "🛒", label: "Compra online fraudulenta" },
          { key: "cartao",     icon: "💳", label: "Clonagem de cartão" },
          { key: "emprestimo", icon: "🏦", label: "Empréstimo / consignado não autorizado" },
          { key: "outro",      icon: "❓", label: "Outro golpe" },
        ].map(o => (
          <OptBtn key={o.key} icon={o.icon} label={o.label} small onClick={() => {
            setGolpeTipo(o.key);
            addUser(o.label);
            addJ("Tipo de golpe", o.label);
            botDelay("**Qual foi o valor aproximado do prejuízo?**", 1000, () => setShowUI("golpe-valor"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-valor") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "ate1k",    label: "Até R$ 1.000" },
          { key: "1k5k",    label: "R$ 1.000 a R$ 5.000" },
          { key: "5k20k",   label: "R$ 5.000 a R$ 20.000" },
          { key: "acima20k", label: "Acima de R$ 20.000" },
          { key: "naosei",  label: "Não sei / prefiro não dizer" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setGolpeValor(o.key);
            addUser(o.label);
            addJ("Valor do prejuízo", o.label);
            botDelay("**Quando isso aconteceu?**", 1000, () => setShowUI("golpe-quando"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-quando") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "hoje",    label: "Hoje ou ontem" },
          { key: "semana",  label: "Nesta semana" },
          { key: "mes",     label: "Neste mês" },
          { key: "mais30",  label: "Há mais de 30 dias" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "bo",         label: "Registrei B.O." },
          { key: "banco",      label: "Contatei o banco" },
          { key: "reclamacao", label: "Abri reclamação (BACEN / consumidor.gov)" },
          { key: "nada",       label: "Nada ainda" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small
            selected={golpeProvidencias.includes(o.key)}
            onClick={() => {
              setGolpeProvidencias(prev =>
                prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
              );
            }}
          />
        ))}
        <button onClick={() => {
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
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
            marginTop: "4px",
          }}
        >Confirmar →</button>
      </div>
    );

    if (showUI === "golpe-devolveu") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim_tudo",   label: "Sim, devolveu tudo" },
          { key: "parcial",    label: "Devolveu parcialmente" },
          { key: "nao",        label: "Não, se recusou" },
          { key: "sem_resp",   label: "Ainda não respondeu" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setGolpeBancoDevolveu(o.key);
            addUser(o.label);
            addJ("Banco devolveu", o.label);
            botDelay("**Você tem prints ou comprovantes do golpe salvos?**", 1000, () => setShowUI("golpe-provas"));
          }} />
        ))}
      </div>
    );

    if (showUI === "golpe-provas") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim",     label: "Sim, tenho tudo salvo" },
          { key: "alguns",  label: "Tenho alguns" },
          { key: "nao",     label: "Não tenho nada" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(TAXAS_MEDIAS).map(([k, v]) => (
          <OptBtn key={k} label={v.label} small onClick={() => {
            setJurosTipo(k);
            addUser(v.label);
            addJ("Tipo de dívida", v.label);
            botDelay("**Você sabe qual é a taxa de juros que está pagando?**", 1000, () => setShowUI("juros-sabe-taxa"));
          }} />
        ))}
      </div>
    );

    if (showUI === "juros-sabe-taxa") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim, sei a taxa" small onClick={() => {
          setJurosSabeTaxa("sim");
          addUser("Sim, sei a taxa");
          botDelay("**Qual é a taxa de juros mensal que você está pagando?** (% ao mês)", 1000, () => setShowUI("juros-taxa-input"));
        }} />
        <OptBtn label="Não sei, mas tenho o contrato" small onClick={() => {
          setJurosSabeTaxa("contrato");
          addUser("Não sei, mas tenho o contrato");
          addJ("Sabe a taxa", "Não, mas tem contrato");
          botDelay("A taxa geralmente aparece no contrato como **CET (Custo Efetivo Total)** ou **taxa de juros mensal**. No app do banco, procure em \"meus contratos\" ou \"detalhes do empréstimo\".", 1400,
            () => botDelay("Vamos continuar com as outras informações. **Qual o valor da parcela?**", 1000, () => setShowUI("juros-parcela"))
          );
        }} />
        <OptBtn label="Não sei e não tenho contrato" small onClick={() => {
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
        <button onClick={() => {
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
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Analisar →</button>
      </div>
    );

    if (showUI === "juros-parcela") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <NumberInput placeholder="Valor da parcela" value={jurosParcela} onChange={setJurosParcela} prefix="R$" />
        <NumberInput placeholder="Parcelas restantes" value={jurosRestantes} onChange={setJurosRestantes} />
        <button onClick={() => {
          if (!jurosParcela) return;
          addUser(`Parcela: R$ ${jurosParcela} | Restantes: ${jurosRestantes || "não informado"}`);
          addJ("Parcela", `R$ ${jurosParcela}`);
          if (jurosRestantes) addJ("Parcelas restantes", jurosRestantes);
          botDelay("**Qual banco ou financeira?**", 1000, () => setShowUI("juros-banco"));
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Continuar →</button>
      </div>
    );

    if (showUI === "juros-banco") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {BANCOS.map(b => (
          <OptBtn key={b} label={b} small onClick={() => {
            setJurosBanco(b);
            addUser(b);
            addJ("Banco / Financeira", b);
            botDelay("**Você está com o nome negativado (SPC/Serasa)?**", 1000, () => setShowUI("juros-negativado"));
          }} />
        ))}
      </div>
    );

    if (showUI === "juros-negativado") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim, estou negativado" small onClick={() => {
          setJurosNegativado("sim");
          addUser("Sim, estou negativado");
          addJ("Negativado", "Sim");
          botDelay("A negativação pode abrir uma frente adicional de **dano moral** se for considerada indevida ou desproporcional. Isso fortalece o caso.", 1200,
            () => botDelay("Para completar, preciso de algumas informações.", 800,
              () => botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"))
            )
          );
        }} />
        <OptBtn label="Não" small onClick={() => {
          setJurosNegativado("nao");
          addUser("Não");
          addJ("Negativado", "Não");
          botDelay("**Qual é o seu nome?**", 800, () => setShowUI("coleta-nome"));
        }} />
        <OptBtn label="Não sei" small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "negativacao", icon: "📉", label: "Nome negativado indevidamente (SPC/Serasa)" },
          { key: "consignado",  icon: "🏦", label: "Empréstimo/consignado no meu nome sem autorização" },
          { key: "bloqueio",    icon: "🔒", label: "Conta bancária bloqueada sem explicação" },
          { key: "lgpd",        icon: "🔐", label: "Dados pessoais vazados" },
          { key: "difamacao",   icon: "🗣️", label: "Difamação / uso indevido do meu nome online" },
          { key: "generico",    icon: "📝", label: "Outro problema" },
        ].map(o => (
          <OptBtn key={o.key} icon={o.icon} label={o.label} small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "nao",   label: "Não reconheço essa dívida" },
          { key: "sim",   label: "Sim, reconheço" },
          { key: "parcial", label: "Reconheço parcialmente" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setNegReconhece(o.key);
            addUser(o.label);
            addJ("Reconhece a dívida", o.label);
            botDelay("**Há quanto tempo está negativado?**", 1000, () => setShowUI("neg-tempo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "neg-tempo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "30d",    label: "Menos de 30 dias" },
          { key: "1_6m",   label: "1 a 6 meses" },
          { key: "6m_5a",  label: "6 meses a 5 anos" },
          { key: "mais5a", label: "Mais de 5 anos" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "credito",         label: "Crédito negado" },
          { key: "financiamento",   label: "Financiamento negado" },
          { key: "constrangimento", label: "Constrangimento" },
          { key: "nenhum",          label: "Nenhum prejuízo concreto" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small
            selected={negPrejuizo.includes(o.key)}
            onClick={() => setNegPrejuizo(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <button onClick={() => {
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
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Confirmar →</button>
      </div>
    );

    // ── Consignado ──
    if (showUI === "cons-aposentado") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim", label: "Sim" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setConsAposentado(o.key);
            addUser(o.label);
            addJ("Aposentado/pensionista/servidor", o.label);
            botDelay("**Apareceu um desconto no seu contracheque ou benefício que você não autorizou?**", 1000, () => setShowUI("cons-desconto"));
          }} />
        ))}
      </div>
    );

    if (showUI === "cons-desconto") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim, apareceu um desconto" small onClick={() => {
          setConsDesconto("sim");
          addUser("Sim, apareceu desconto não autorizado");
          addJ("Desconto não autorizado", "Sim");
          botDelay("**Qual banco fez o empréstimo?**", 1000, () => setShowUI("cons-banco"));
        }} />
        <OptBtn label="Não, mas recebi dinheiro que não pedi" small onClick={() => {
          setConsDesconto("dinheiro");
          addUser("Recebi dinheiro que não pedi");
          addJ("Desconto não autorizado", "Recebeu dinheiro não solicitado");
          botDelay("**Qual banco fez o empréstimo?**", 1000, () => setShowUI("cons-banco"));
        }} />
        <OptBtn label="Não" small onClick={() => {
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
          <OptBtn key={b} label={b} small onClick={() => {
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
        <button onClick={() => {
          if (!consValor) return;
          addUser(`R$ ${consValor}/mês`);
          addJ("Desconto mensal", `R$ ${consValor}`);
          botDelay("**Já reclamou no banco ou no INSS?**", 1000, () => setShowUI("cons-reclamou"));
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Continuar →</button>
      </div>
    );

    if (showUI === "cons-reclamou") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim",  label: "Sim, sem sucesso" },
          { key: "nao",  label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
          <OptBtn key={b} label={b} small onClick={() => {
            setBloqBanco(b);
            addUser(b);
            addJ("Banco", b);
            botDelay("**Recebeu alguma justificativa para o bloqueio?**", 1000, () => setShowUI("bloq-justificativa"));
          }} />
        ))}
      </div>
    );

    if (showUI === "bloq-justificativa") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim", label: "Sim, recebi justificativa" },
          { key: "nao", label: "Não, nenhuma explicação" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setBloqJustificativa(o.key);
            addUser(o.label);
            addJ("Recebeu justificativa", o.label);
            botDelay("**Tem saldo ou dinheiro retido na conta?**", 1000, () => setShowUI("bloq-saldo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "bloq-saldo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim, tenho saldo retido" small onClick={() => {
          setBloqSaldo("sim");
          addUser("Sim, tenho saldo retido");
          addJ("Saldo retido", "Sim");
          botDelay("**A conta é usada para receber salário ou benefícios?**", 1000, () => setShowUI("bloq-salario"));
        }} />
        <OptBtn label="Não" small onClick={() => {
          setBloqSaldo("nao");
          addUser("Não");
          addJ("Saldo retido", "Não");
          botDelay("**A conta é usada para receber salário ou benefícios?**", 1000, () => setShowUI("bloq-salario"));
        }} />
      </div>
    );

    if (showUI === "bloq-salario") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim", label: "Sim, recebo salário/benefício nessa conta" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "cpf",      label: "CPF" },
          { key: "email",    label: "E-mail" },
          { key: "telefone", label: "Telefone" },
          { key: "bancario", label: "Dados bancários" },
          { key: "fotos",    label: "Fotos / imagens pessoais" },
          { key: "outros",   label: "Outros dados" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small
            selected={lgpdDados.includes(o.key)}
            onClick={() => setLgpdDados(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <button onClick={() => {
          const txt = lgpdDados.join(", ") || "Não informado";
          addUser(txt);
          addJ("Dados vazados", txt);
          botDelay("**Sabe qual empresa vazou seus dados?**", 1000, () => setShowUI("lgpd-empresa"));
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Confirmar →</button>
      </div>
    );

    if (showUI === "lgpd-empresa") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim, sei qual empresa" small onClick={() => {
          setLgpdEmpresa("sim");
          addUser("Sim, sei qual empresa");
          addJ("Empresa identificada", "Sim");
          botDelay("**Sofreu algum prejuízo após o vazamento?**", 1000, () => setShowUI("lgpd-prejuizo"));
        }} />
        <OptBtn label="Não sei" small onClick={() => {
          setLgpdEmpresa("nao");
          addUser("Não sei qual empresa");
          addJ("Empresa identificada", "Não");
          botDelay("**Sofreu algum prejuízo após o vazamento?**", 1000, () => setShowUI("lgpd-prejuizo"));
        }} />
      </div>
    );

    if (showUI === "lgpd-prejuizo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "golpe",       label: "Fui vítima de golpe após o vazamento" },
          { key: "spam",        label: "Recebo spam / ligações indesejadas" },
          { key: "negativacao", label: "Fui negativado indevidamente" },
          { key: "exposicao",   label: "Dados/fotos foram expostos publicamente" },
          { key: "nenhum",      label: "Nenhum prejuízo concreto" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small
            selected={lgpdPrejuizo.includes(o.key)}
            onClick={() => setLgpdPrejuizo(prev =>
              prev.includes(o.key) ? prev.filter(x => x !== o.key) : [...prev, o.key]
            )}
          />
        ))}
        <button onClick={() => {
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
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Confirmar →</button>
      </div>
    );

    // ── Difamação ──
    if (showUI === "dif-onde") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "instagram",  label: "Instagram" },
          { key: "facebook",   label: "Facebook" },
          { key: "tiktok",     label: "TikTok" },
          { key: "google",     label: "Google / sites" },
          { key: "whatsapp",   label: "WhatsApp / grupos" },
          { key: "outro",      label: "Outro" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setDifOnde(o.key);
            addUser(o.label);
            addJ("Plataforma (difamação)", o.label);
            botDelay("**Você conhece quem está fazendo isso?**", 1000, () => setShowUI("dif-conhece"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-conhece") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim", label: "Sim, conheço" },
          { key: "nao", label: "Não sei quem é" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setDifConhece(o.key);
            addUser(o.label);
            addJ("Conhece o autor", o.label);
            botDelay("**É conteúdo íntimo ou sexual publicado sem seu consentimento?**", 1000, () => setShowUI("dif-intimo"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-intimo") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <OptBtn label="Sim" small onClick={() => {
          setDifIntimo("sim");
          addUser("Sim, conteúdo íntimo sem consentimento");
          addJ("Conteúdo íntimo", "Sim");
          botDelay("⚠️ **Isso é crime** tipificado pela Lei 13.718/2018. Além da responsabilidade criminal, há direito a indenização por dano moral.", 1200,
            () => botDelay("**Tem prints ou provas salvas?**", 1000, () => setShowUI("dif-provas"))
          );
        }} />
        <OptBtn label="Não" small onClick={() => {
          setDifIntimo("nao");
          addUser("Não");
          addJ("Conteúdo íntimo", "Não");
          botDelay("**Já tentou denunciar na plataforma?**", 1000, () => setShowUI("dif-denunciou"));
        }} />
      </div>
    );

    if (showUI === "dif-denunciou") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim", label: "Sim, sem resultado" },
          { key: "nao", label: "Não" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
            setDifDenunciou(o.key);
            addUser(o.label);
            addJ("Denunciou na plataforma", o.label);
            botDelay("**Tem prints ou provas salvas?**", 1000, () => setShowUI("dif-provas"));
          }} />
        ))}
      </div>
    );

    if (showUI === "dif-provas") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { key: "sim",  label: "Sim, tenho prints" },
          { key: "nao",  label: "Não tenho provas" },
        ].map(o => (
          <OptBtn key={o.key} label={o.label} small onClick={() => {
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
        <button onClick={() => {
          if (!nome.trim()) return;
          addUser(nome);
          addJ("Nome", nome);
          botDelay("Agora me conte, em poucas palavras, **o que aconteceu:**", 800, () => setShowUI("coleta-relato"));
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Continuar →</button>
      </div>
    );

    if (showUI === "coleta-relato") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <TextInput placeholder={
          vertical === "golpe" ? "Descreva como o golpe aconteceu, valores envolvidos e o que o golpista fez..." :
          vertical === "juros" ? "Descreva sua situação com o banco, dificuldades que está enfrentando..." :
          "Descreva brevemente o que aconteceu..."
        } value={relato} onChange={setRelato} multiline />
        <button onClick={() => {
          if (!relato.trim()) return;
          addUser(relato);
          botDelay("**Quais danos você sofreu?** (selecione todos que se aplicam)", 800, () => setShowUI("coleta-danos"));
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Continuar →</button>
      </div>
    );

    if (showUI === "coleta-danos") return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <DamageSelector damages={damages} setDamages={setDamages} />
        <button onClick={() => {
          const labels = damages.map(d => DAMAGE_OPTIONS.find(o => o.key === d)?.label).filter(Boolean).join(", ") || "Não informado";
          addUser(labels);

          botDelay("Obrigado, **" + nome.split(" ")[0] + "**! Analisei todas as informações.", 1200, () => {
            addBot("Um advogado especializado vai revisar seu caso e entrar em contato com orientações específicas.");
            botDelay("Clique abaixo para enviar tudo pelo WhatsApp:", 1000, () => setShowUI("whatsapp-final"));
          });
        }}
          style={{
            padding: "10px", background: "#15253f", color: "#f3e0a8",
            border: "none", borderRadius: "10px", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif",
          }}
        >Finalizar análise →</button>
      </div>
    );

    if (showUI === "whatsapp-final") return (
      <div style={{
        background: "linear-gradient(135deg, #15253f, #1e3a5f)",
        borderRadius: "14px", padding: "18px", textAlign: "center",
      }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>
          As informações que você compartilhou serão enviadas automaticamente para agilizar o atendimento.
        </div>
        <button onClick={openWhatsApp}
          style={{
            width: "100%", padding: "13px",
            background: "linear-gradient(135deg, #20b954, #25D366)",
            border: "none", borderRadius: "11px", cursor: "pointer",
            fontSize: "14px", color: "#fff", fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700, display: "flex", alignItems: "center",
            justifyContent: "center", gap: "9px",
            boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "17px" }}>💬</span>
          Falar pelo WhatsApp agora
        </button>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "10px" }}>
          Atendimento em horário comercial · Resposta em até 2h úteis
        </div>
      </div>
    );

    return null;
  };

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════

  return (
    <div style={{
      maxWidth: "420px", margin: "0 auto", height: "100vh",
      display: "flex", flexDirection: "column",
      fontFamily: "'Montserrat', sans-serif",
      background: "#faf8f4",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, #15253f, #1e3a5f)",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(243,224,168,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: 700, color: "#f3e0a8",
        }}>L</div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#f3e0a8" }}>Lex</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
            Assistente Jurídico · Marques & Cunha
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          width: 10, height: 10, borderRadius: "50%",
          background: "#25D366",
          boxShadow: "0 0 6px rgba(37,211,102,0.6)",
        }} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column",
      }}>
        {renderMessages()}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #15253f, #1e3a5f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", color: "#f3e0a8", fontWeight: 700,
            }}>L</div>
            <div style={{
              background: "#f5f0e6", borderRadius: "14px", padding: "10px 16px",
              display: "flex", gap: "4px",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#b79f6f",
                  animation: `lexBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {renderUI()}

        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div style={{
        padding: "9px 16px",
        borderTop: "1px solid #f0ece4",
        background: "#faf8f4",
        textAlign: "center",
        fontSize: "10.5px",
        color: "#bbb",
      }}>
        🔒 Informações confidenciais · Marques & Cunha Advogados · OAB/SP
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes lexBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-7px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d8c8; border-radius: 4px; }
      `}</style>
    </div>
  );
}
