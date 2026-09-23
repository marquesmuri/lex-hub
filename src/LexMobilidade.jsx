// ════════════════════════════════════════════
// LexMobilidade — fluxo de triagem para motoristas/entregadores de app
// (Uber, 99, InDrive, iFood...). Módulo só de DADOS e REGRAS:
// perguntas, ramificações, prioridade e bloco do resumo do WhatsApp.
// A renderização fica no LexChatbot (tela genérica "mob_step").
// ════════════════════════════════════════════

// ─── Detecção do app (botões do sub_app + texto digitado em "Outro aplicativo") ───
const MOB_APP_PATTERNS = [
  { re: /\buber\b/i,          name: "Uber" },
  { re: /(^|[\s\-])99(\s*(pop|food|taxi|app|moto))?($|[\s\-.,!])/i, name: "99" },
  { re: /\bin\s?drive(r)?\b/i, name: "InDrive" },
  { re: /\bi\s?food\b/i,       name: "iFood" },
  { re: /\brappi\b/i,          name: "Rappi" },
  { re: /\blalamove\b/i,       name: "Lalamove" },
];

export function detectMobilityApp(text) {
  if (!text) return null;
  const hit = MOB_APP_PATTERNS.find(p => p.re.test(text));
  return hit ? hit.name : null;
}

// Apps com guia de recurso próprio no LexChatbot
export const MOB_GUIDE = { "Uber": "guide_uber", "99": "guide_99" };

// ─── Condições reutilizáveis ───
const isWorker     = a => a.perfil && a.perfil !== "passageiro";
const hadActivity  = a => isWorker(a) && a.situacao !== "recusado";
const wantsExtra   = a => a.extra_gate === "sim";

// ─── Perguntas ───
// type: "single" (padrão) | "multi" | "text"
// when(a): exibe a etapa só se retornar true
// react: { [valor]: texto } — comentário curto do Lex após a resposta
// summary: rótulo da linha no resumo do WhatsApp (sem summary = não entra)
export const MOB_STEPS = [
  // ── Parte obrigatória ──
  {
    id: "perfil", summary: "Perfil",
    q: (app) => `Você usa o **${app}** como:`,
    options: [
      { v: "motorista",  icon: "🚗", label: "Motorista parceiro" },
      { v: "entregador", icon: "🛵", label: "Entregador" },
      { v: "passageiro", icon: "🙋", label: "Passageiro / cliente" },
    ],
  },
  {
    id: "situacao", summary: "Situação da conta",
    q: () => "Qual é a **situação atual** da sua conta?",
    options: [
      { v: "suspensa",   icon: "⏸️", label: "Suspensa temporariamente", sub: "Bloqueio com prazo ou em análise" },
      { v: "desativada", icon: "⛔", label: "Desativada / banida de vez" },
      { v: "recusado",   icon: "📄", label: "Meu cadastro nunca foi aprovado", sub: "Recusado na análise de documentos", when: isWorker },
    ],
  },
  {
    id: "quando", summary: "Quando aconteceu",
    q: () => "**Há quanto tempo** isso aconteceu?",
    options: [
      { v: "30d",    icon: "🕐", label: "Menos de 30 dias" },
      { v: "6m",     icon: "📅", label: "Entre 1 e 6 meses" },
      { v: "12m",    icon: "📅", label: "Entre 6 e 12 meses" },
      { v: "3a",     icon: "🗓️", label: "Entre 1 e 3 anos" },
      { v: "mais3a", icon: "⏳", label: "Mais de 3 anos" },
    ],
    react: {
      "30d":    "Casos recentes têm **mais chance de reversão rápida** — agir agora faz diferença.",
      "mais3a": "Anotado. Em casos mais antigos, o advogado verifica primeiro os **prazos aplicáveis**.",
    },
  },
  {
    id: "motivo", summary: "Motivo informado pelo app",
    q: () => "O app **informou algum motivo** para o bloqueio?",
    options: [
      { v: "nenhum",     icon: "❓", label: "Não informou nenhum motivo" },
      { v: "denuncia",   icon: "🚩", label: "Denúncia de outro usuário", sub: "Passageiro, motorista ou cliente — comportamento, segurança, reclamação" },
      { v: "facial",     icon: "🤳", label: "Falha no reconhecimento facial / selfie" },
      { v: "documentos", icon: "📄", label: "Problema com documentos ou cadastro", sub: "Conta duplicada, documento recusado, antecedentes" },
      { v: "fraude",     icon: "🔍", label: "Suspeita de fraude ou uso irregular", sub: "Corridas fora do app, cancelamentos, GPS, conta compartilhada" },
      { v: "avaliacao",  icon: "⭐", label: "Nota baixa ou taxa de cancelamento", when: isWorker },
      { v: "outro",      icon: "📋", label: "Outro motivo" },
    ],
    react: {
      nenhum: "A **falta de motivação** é, por si só, um ponto relevante — a plataforma precisa informar o motivo e permitir defesa.",
      facial: "A LGPD garante o direito de pedir a **revisão de decisões tomadas exclusivamente por sistema automatizado** — como o reconhecimento facial.",
    },
  },
  // Ramo: denúncia
  {
    id: "denuncia_tipo", summary: "Tipo de denúncia",
    when: a => a.motivo === "denuncia",
    q: () => "Qual foi o **tipo de denúncia** informado? Não precisa dar detalhes agora — só a categoria.",
    options: [
      { v: "comportamento", icon: "💬", label: "Comportamento inadequado (genérico)" },
      { v: "assedio",       icon: "⚠️", label: "Assédio, importunação ou conduta sexual" },
      { v: "agressao",      icon: "⚠️", label: "Discussão ou agressão física" },
      { v: "direcao",       icon: "🚦", label: "Direção perigosa / segurança" },
      { v: "nao_informado", icon: "❓", label: "Não informaram qual foi" },
    ],
  },
  {
    id: "policial", summary: "B.O., intimação ou processo",
    when: a => a.motivo === "denuncia",
    q: () => "Existe **boletim de ocorrência, intimação ou processo** relacionado a essa denúncia?",
    options: [
      { v: "sim",     icon: "📑", label: "Sim" },
      { v: "nao",     icon: "✖️", label: "Não" },
      { v: "nao_sei", icon: "❓", label: "Não sei" },
    ],
    react: {
      sim: "Entendido. Casos assim são analisados **diretamente pelo advogado**, com total sigilo.",
    },
  },
  // Ramo: reconhecimento facial
  {
    id: "facial_detalhe", summary: "Verificação facial",
    when: a => a.motivo === "facial",
    q: () => "Na verificação facial, **o que aconteceu**?",
    options: [
      { v: "nao_reconheceu", icon: "🤳", label: "Não reconheceu meu rosto, mesmo sendo eu" },
      { v: "aparencia",      icon: "🧔", label: "Mudei a aparência", sub: "Barba, cabelo, óculos, peso" },
      { v: "aparelho",       icon: "📱", label: "Troquei de celular / problema na câmera" },
      { v: "terceiro",       icon: "👤", label: "Outra pessoa usou minha conta sem autorização" },
    ],
  },
  // Ramo: documentos / cadastro
  {
    id: "doc_tipo", summary: "Problema cadastral",
    when: a => a.motivo === "documentos",
    q: () => "Qual foi o **problema apontado** no cadastro?",
    options: [
      { v: "duplicada",    icon: "👥", label: "Conta duplicada — mas só tenho uma" },
      { v: "doc_invalido", icon: "📄", label: "Documento considerado inválido ou falso" },
      { v: "antecedentes", icon: "🔎", label: "Checagem de antecedentes" },
      { v: "cnh",          icon: "🪪", label: "CNH", sub: "Vencida, sem EAR, pontuação" },
      { v: "outro",        icon: "📋", label: "Outro problema de cadastro" },
    ],
  },
  {
    id: "contestou", summary: "Contestação no app",
    q: () => "Você **contestou** o bloqueio no próprio app ou na central de ajuda?",
    options: [
      { v: "nao",          icon: "✖️", label: "Ainda não contestei" },
      { v: "negado",       icon: "⛔", label: "Contestei e negaram" },
      { v: "sem_resposta", icon: "⌛", label: "Contestei e não tive resposta" },
      { v: "automatica",   icon: "🤖", label: "Só recebi resposta automática / genérica" },
    ],
  },
  {
    id: "dados", summary: "Pediu dados / gravações / motivo detalhado",
    q: () => "Você pediu ao app **seus dados, as gravações ou o motivo detalhado** do bloqueio?",
    options: [
      { v: "negado",       icon: "⛔", label: "Pedi e negaram" },
      { v: "sem_resposta", icon: "⌛", label: "Pedi e não responderam" },
      { v: "nao",          icon: "✖️", label: "Não pedi" },
    ],
    react: {
      negado: "Isso é relevante: a **LGPD garante ao titular o acesso aos próprios dados** — a recusa fortalece o seu caso.",
    },
  },
  {
    id: "renda", summary: "Peso na renda",
    when: isWorker,
    q: () => "Qual era o peso do app na sua **renda**?",
    options: [
      { v: "unica",        icon: "💼", label: "Era minha única renda" },
      { v: "principal",    icon: "💰", label: "Era minha principal renda" },
      { v: "complementar", icon: "➕", label: "Era renda complementar" },
    ],
  },

  // ── Portão da parte opcional ──
  {
    id: "extra_gate", gate: true,
    q: (app, n) => `Com isso já consigo registrar seu caso. **Quer responder mais ${n} perguntas rápidas** para o advogado já chegar com a análise adiantada?`,
    options: [
      { v: "sim", icon: "⚡", label: "Sim, quero adiantar a análise" },
      { v: "nao", icon: "➡️", label: "Não, seguir para o registro" },
    ],
  },

  // ── Parte opcional ──
  {
    id: "ganho", summary: "Ganho médio semanal", optional: true,
    when: a => wantsExtra(a) && hadActivity(a),
    q: () => "Em média, quanto você **ganhava por semana** no app?",
    options: [
      { v: "ate500",   icon: "💵", label: "Até R$ 500" },
      { v: "500_1000", icon: "💵", label: "De R$ 500 a R$ 1.000" },
      { v: "1000_2000",icon: "💵", label: "De R$ 1.000 a R$ 2.000" },
      { v: "mais2000", icon: "💵", label: "Mais de R$ 2.000" },
      { v: "nao_inf",  icon: "🔒", label: "Prefiro não informar" },
    ],
  },
  {
    id: "veiculo", summary: "Veículo de trabalho", optional: true,
    when: a => wantsExtra(a) && isWorker(a),
    q: () => "O veículo que você usa para trabalhar é:",
    options: [
      { v: "financiado", icon: "🏦", label: "Financiado", sub: "Parcelas continuam correndo" },
      { v: "alugado",    icon: "🔑", label: "Alugado para rodar em app" },
      { v: "proprio",    icon: "🚘", label: "Próprio, já quitado" },
      { v: "outro",      icon: "🚲", label: "Outro / não uso veículo próprio" },
    ],
  },
  {
    id: "tempo", summary: "Tempo de plataforma", optional: true,
    when: a => wantsExtra(a) && hadActivity(a),
    q: () => "Há **quanto tempo** você trabalhava no app?",
    options: [
      { v: "menos6m", icon: "🌱", label: "Menos de 6 meses" },
      { v: "6m_2a",   icon: "📈", label: "Entre 6 meses e 2 anos" },
      { v: "2a_5a",   icon: "🏅", label: "Entre 2 e 5 anos" },
      { v: "mais5a",  icon: "🏆", label: "Mais de 5 anos" },
    ],
  },
  {
    id: "nota", summary: "Nota na plataforma", optional: true,
    when: a => wantsExtra(a) && hadActivity(a),
    q: () => "Qual era a sua **nota** aproximada?",
    options: [
      { v: "49",      icon: "⭐", label: "4,9 ou mais" },
      { v: "47",      icon: "⭐", label: "Entre 4,7 e 4,89" },
      { v: "abaixo",  icon: "⭐", label: "Abaixo de 4,7" },
      { v: "nao_sei", icon: "❓", label: "Não lembro" },
    ],
  },
  {
    id: "provas", summary: "Provas em mãos", optional: true, type: "multi",
    when: wantsExtra,
    q: () => "Quais **provas** você tem hoje? Pode marcar mais de uma.",
    options: [
      { v: "print",     icon: "📸", label: "Print do aviso de bloqueio" },
      { v: "protocolo", icon: "📨", label: "E-mails ou protocolos da contestação" },
      { v: "extrato",   icon: "📊", label: "Extrato de ganhos / histórico de corridas" },
      { v: "nenhuma",   icon: "✖️", label: "Ainda não tenho nada guardado", exclusive: true },
    ],
  },
  {
    id: "acao", summary: "Advogado / processo existente", optional: true,
    when: wantsExtra,
    q: () => "Você já tem **advogado ou processo** sobre esse bloqueio?",
    options: [
      { v: "nao",         icon: "✖️", label: "Não" },
      { v: "civel",       icon: "⚖️", label: "Sim, ação na Justiça comum / Juizado" },
      { v: "trabalhista", icon: "👷", label: "Sim, ação trabalhista" },
      { v: "procon",      icon: "📝", label: "Só reclamação no Procon / consumidor.gov" },
    ],
  },
  {
    id: "cidade", summary: "Cidade/UF", optional: true, type: "text",
    when: wantsExtra,
    q: () => "Por último: em qual **cidade/UF** você trabalha?",
    placeholder: "Ex: Santos/SP",
  },
];

const STEP_BY_ID = Object.fromEntries(MOB_STEPS.map(s => [s.id, s]));
export const getMobStep = (id) => STEP_BY_ID[id];

// Opções visíveis de uma etapa (algumas dependem de respostas anteriores)
export function visibleOptions(step, answers) {
  return (step.options || []).filter(o => !o.when || o.when(answers));
}

// Próxima etapa a partir de `fromId` (null = começa do início). Retorna id ou null (fim).
export function nextMobStep(fromId, answers) {
  const start = fromId ? MOB_STEPS.findIndex(s => s.id === fromId) + 1 : 0;
  for (let i = start; i < MOB_STEPS.length; i++) {
    const s = MOB_STEPS[i];
    if (s.gate) {
      if (countOptional(answers) > 0) return s.id;
      continue;
    }
    if (!s.when || s.when(answers)) return s.id;
  }
  return null;
}

// Quantas perguntas opcionais o lead verá se aceitar o portão
export function countOptional(answers) {
  const hypo = { ...answers, extra_gate: "sim" };
  return MOB_STEPS.filter(s => s.optional && (!s.when || s.when(hypo))).length;
}

// ─── Prioridade (mapeada para as faixas do LexChatbot) ───
export function classifyMobility(a, app) {
  const flags = mobFlags(a);

  if (a.perfil === "passageiro") {
    const recent = ["30d", "6m", "12m"].includes(a.quando);
    return {
      prob: a.situacao === "desativada" && recent ? "media" : "baixa",
      flags,
      scenario: `📋 Bloqueios de conta de **passageiro** podem dar direito à reativação, especialmente quando o **${app}** não explica o motivo.`,
      note: "Um advogado vai avaliar se cabe pedido de reativação e, havendo dano concreto, indenização.",
    };
  }

  let pts = 0;
  pts += { desativada: 2, suspensa: 1, recusado: 0 }[a.situacao] ?? 0;
  pts += { "30d": 2, "6m": 2, "12m": 1, "3a": 0, "mais3a": -2 }[a.quando] ?? 0;
  pts += { nenhum: 2, denuncia: 1, facial: 1, documentos: 1, outro: 1, avaliacao: 0, fraude: -1 }[a.motivo] ?? 0;
  if (["negado", "sem_resposta", "automatica"].includes(a.contestou)) pts += 1;
  if (["negado", "sem_resposta"].includes(a.dados)) pts += 1;
  pts += { unica: 2, principal: 2, complementar: 1 }[a.renda] ?? 0;

  const prob = pts >= 8 ? "muito_alta" : pts >= 6 ? "alta" : pts >= 3 ? "media" : "baixa";

  const scenarios = {
    nenhum:     "⚡ Seu caso se enquadra como **bloqueio sem motivação** — os tribunais têm reconhecido que a plataforma precisa informar o motivo e permitir defesa antes de desligar o parceiro.",
    denuncia:   "⚡ Seu caso envolve **bloqueio baseado em denúncia, sem direito de defesa** — há decisões recentes condenando a plataforma quando o parceiro não teve acesso às provas nem chance de se defender.",
    facial:     "⚡ Seu caso envolve **bloqueio por falha em verificação automatizada** — a LGPD garante o direito de pedir revisão de decisões tomadas exclusivamente por sistema automatizado.",
    documentos: "⚡ Seu caso envolve **bloqueio por inconsistência cadastral** — com a documentação regular, a plataforma precisa rever a decisão e apontar o problema concreto.",
    fraude:     "📋 Casos de **suspeita de uso irregular** dependem das provas de cada lado — o advogado vai avaliar se a plataforma demonstrou a irregularidade.",
    avaliacao:  "📋 Bloqueios por **nota ou cancelamentos** dependem de como a regra foi aplicada e comunicada a você — vale a análise do advogado.",
    outro:      "📋 Seu caso precisa de uma **análise individual** — o advogado vai verificar se o bloqueio respeitou o direito de defesa.",
  };
  let scenario = flags.sensitive
    ? "📋 Seu caso envolve uma **denúncia que exige análise cuidadosa**. Ele será avaliado diretamente por um advogado, com total sigilo."
    : scenarios[a.motivo] || scenarios.outro;
  if (a.situacao === "recusado" && !flags.sensitive) {
    scenario = "📋 Seu caso envolve **cadastro recusado** — se a documentação estava regular, a plataforma precisa justificar a recusa de forma concreta.";
  }

  let note = ["unica", "principal"].includes(a.renda) && a.situacao !== "recusado"
    ? "Como o app era sua fonte de renda, também pode haver pedido de **indenização pelos ganhos perdidos**, além da reativação."
    : "Um advogado vai avaliar se cabe pedido de reativação e indenização.";
  if (flags.old) note += " Como o bloqueio tem mais de 3 anos, o advogado verifica primeiro os prazos aplicáveis.";

  return { prob, flags, scenario, note };
}

export function mobFlags(a) {
  return {
    sensitive: a.motivo === "denuncia" && (["assedio", "agressao"].includes(a.denuncia_tipo) || a.policial === "sim"),
    old: a.quando === "mais3a",
    trabalhista: a.acao === "trabalhista",
    recusado: a.situacao === "recusado",
    semProvas: Array.isArray(a.provas) && a.provas.includes("nenhuma"),
  };
}

// ─── Danos específicos do caminho mobilidade ───
export const MOB_DAMAGE_OPTIONS = [
  { key: "mob_renda",   icon: "💸", label: "Perda de renda (corridas ou entregas)" },
  { key: "mob_veiculo", icon: "🚗", label: "Parcelas do veículo ou aluguel sem poder rodar" },
  { key: "mob_moral",   icon: "😔", label: "Dano moral pela acusação ou exposição" },
  { key: "mob_outros",  icon: "📋", label: "Outros danos" },
];

// ─── Bloco do resumo enviado ao WhatsApp ───
// labels: { [stepId]: "rótulo exibido" } (para multi: array de rótulos)
export function buildMobilityBlock(labels, answers) {
  let out = `*DETALHES — MOBILIDADE (APP-MOB)*\n`;
  MOB_STEPS.forEach(s => {
    if (!s.summary) return;
    const l = labels[s.id];
    if (l === undefined || l === null || l === "") return;
    out += `• ${s.summary}: ${Array.isArray(l) ? l.join(", ") : l}\n`;
  });
  out += `\n`;

  const f = mobFlags(answers);
  const alerts = [];
  if (f.sensitive)   alerts.push("⚠️ CASO SENSÍVEL — acusação grave / possível interface criminal: revisão direta do advogado");
  if (f.old)         alerts.push("⏳ Bloqueio há mais de 3 anos — verificar prazo prescricional");
  if (f.trabalhista) alerts.push("⚖️ Já existe ação trabalhista — verificar litispendência e competência (Tema 1291/STF pendente)");
  if (f.recusado)    alerts.push("📄 Cadastro nunca aprovado — sem histórico de ganhos na plataforma");
  if (f.semProvas)   alerts.push("📸 Lead sem provas guardadas — orientar coleta (prints, protocolos, extrato)");
  if (alerts.length) {
    out += `*ALERTAS*\n`;
    alerts.forEach(x => { out += `• ${x}\n`; });
    out += `\n`;
  }
  return out;
}
