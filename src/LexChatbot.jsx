import { useState, useEffect, useRef } from "react";
import {
  WHATSAPP_NUMBER, META_VERIFIED_BADGE, fmt,
  OptBtn, GhostBtn, BotBubble, UserBubble, TypingRow, ChatShell,
} from "./brand";
const APP_LOGOS = {
  tiktok: "data:image/jpeg;base64," +
    "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" +
    "qpZnyPkdvPNnuiIiKCIiIi//2Q==",
  ml: "data:image/jpeg;base64," +
    "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",
  uber: "data:image/jpeg;base64," +
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAd" +
    "Hx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3" +
    "Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIA" +
    "AhEBAxEB/8QAGwABAQEBAAMBAAAAAAAAAAAAAAcGBQEDBAj/xAA2EAABAwQBAwIDBQYHAAAAAAAB" +
    "AAIDBAUGEQcSITFBYRNRcRQVIoGRCCUyN0JyOFNzobKzwf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/" +
    "xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCGoiICIiAiIgIiICIiAiIgIiICIiAi" +
    "IgIiICIiAiIgDyqJkWC2y18ZWnJ4KirdW1johJG9zfhjqDidADf9I9VPB5Ctmb/yDxz++n/4vQRJ" +
    "US4YLbKbimjytlRVmunc0OjLm/DG5C3sNb8D5qeDyrZev8Ots/vZ/wBzkGTynB7baON7JklNPVOr" +
    "K90Yljkc0xjqY5x0AN+Wj1U+0v0i2x2i98R44chrXUdsoYYqqd7excAxzQ3fpsu9ASfA8rI0954e" +
    "q5xbX2GrpYSehta/qAHuSHlw/MII4i3PJ+BHDq2CeinNVaKzZp5iQS0+elxHY9jsH1H0WmtGE4vi" +
    "GN0195C+NPU1YDqe3REgjtvRAIJOiCdkAb15QSBFarbaeN+Qmy2+x0lTY7uGF0PXv8evbqLXAeo7" +
    "HSzvGmGUtTyHW4/lFGJhSwS9cfxHNHU1zdOBBB1o7HsUE3RVvNrdxzi9JdbRBDUVd9LXmOUFxZTP" +
    "J21n8QHYED+o/NSRB5HlXC+wSXr9n21SUDTL9i+G+Zre5AYXMd29t7+ihy2/HXI1dhbpaZ0ArbZO" +
    "7qkpnO6S13guafQ68g9jpBiQDsdld8vt1RauArdR1jDHOwwuexw0Wlzy7R9xtcw8kcfUc33jbMK/" +
    "eQPUwvijYxrvmCCdfUNXKzHlZuVYYbRV0D4698zZHysIEQAeSAB58aCDSZnS1lTwJYXUYc6OBlPL" +
    "UBv+X0uGz7Bxaf8AdQwA7Crlq5kjtGMWe00tpMzqRjYqoTvHRNGGkEDXcHevO/XsvbT8g8c0M4uN" +
    "DhT23Fp6mgtYGNd8wdkD6hqDo5qPuriDE6O+tP2ptTA74Tx+JrGhxI17MIBWi5YvGO211tqr9jJv" +
    "FPNG4QVIkAaz16fzGj7/AJKG5xmNyzK6ituHTHHGC2CnjP4Im/8ApPqfX9AtRiPKTaKyNx/K7Uy8" +
    "WpjQ2Pq0XxtHgaPZwHp4I+aDq2fPMKpblBPaMCmbXRkuiMEm3ggHZAHttdLjrIqfKuZay8U1K+mZ" +
    "NbS0xvcCdt+G3ex9FzG8nYlj8MsmF4l9nr5GlonqdDo/QuJHtsLKYFm4x3L6nILpBJVvqIpA9sPS" +
    "zbnuBJ14A7HsEHGzcl2ZX0uJJ+8ajuf9Ry4i++/1zLpfLjcI2OjZVVUkzWOOy0OcTo/qvgQEREBE" +
    "RAREQEREBERAREQEREBERAREQEREBERAREQf/9k=",
  n99: "data:image/jpeg;base64," +
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAd" +
    "Hx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3" +
    "Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIA" +
    "AhEBAxEB/8QAHAAAAgIDAQEAAAAAAAAAAAAAAAIGBwEFCAME/8QANhAAAQMDAgMHAgUCBwAAAAAA" +
    "AQIDBAAFEQYhBzFBEhMiUWFxgRWRFCNSobEWwUJVYpLR4fD/xAAbAQACAwEBAQAAAAAAAAAAAAAC" +
    "BAEDBQYAB//EAC4RAAEDAwIEBAYDAQAAAAAAAAEAAgMEBREhMRITQVEUYaGxBiNxgcHwIkRy4f/a" +
    "AAwDAQACEQMRAD8AqjSWmZ2qLmIcIBCEjtPPqHhaT5nzPkOtXrp3QdgsTSO6hokyRzkSUhaifQHZ" +
    "PxRw5sSLFpaI32AJMhIfkKxuVKGQPgYH3qT1wF3u8tRK6ON2GDTTr5lacEDWtyd1hKQkAJAAHQDF" +
    "ZoorBTKKKKK8vIoJoJpCalSAgmkXhQIUAQeYIzQTSE0QCMBRrUWh7DfG195DRGkHlIjJCFA+oGyv" +
    "mqQ1Vpubpm4mJMAWhQ7TLyR4XU+Y8j5jpXSJNRniFZUXvTMpvsAyI6S+wrqFJGSPkZH2rftN1lgl" +
    "Echyw6a9PMJeopWvaXNGqmKQEpCUjAAwBWaKK51WIoqO6y1fA0pDS5JBelOg9zGQcKX6k9E+v2qo" +
    "blxT1PLdKo0lqE3nZDLKTge6gSa1aKz1VY3jYAG9yqZKhkZwV0BQTVEWXizf4byfqXc3BjPiCkBt" +
    "ePRSR/INXBp6/wADUVtROtzhUgnsrQrZTav0qHn/ADQVtqqaMZkGR3GymKZkmgW0JpCa1mpL/B07" +
    "bVTri4QkHsoQndTiv0pH/sVT154q36Y6r6d3MBnPhCUBa8eqlD+AKKhtVRWDijGB3OyKSdkWh3V4" +
    "k0hNURbuJ2pYroMmQ1Mbzuh5pIyPdOCKtXSWrIOp4anI2WpLeO+jrOSj1B6j1q2stFTSN43jI7hF" +
    "DUxyHA3UgJrzXhSSk7gjBrJNeZNZ4CcAW1o99qKCAoFJ5HalkouYdX3l2/aimz3VEpW4UtD9LY2S" +
    "B8fuTUt0Fw1RqC1i6XSU6xGcJDLbIHaWAcFRJ5DII5dKgdziOW+4yYbwKXGHVNqB8wcVanDXX9qh" +
    "WJq03l78K5GyGnVJJQtJJODgbEZP7V9EuRqIaJoohtjbU4x09Flw8LpPmKKcQtDK0otiRGkKkQX1" +
    "FCVLAC0KAzg42ORyPoabhLeHbbqtmL2j+HnDuXE9O1glB987fJrY8VdaQb+1GttpUp2Oy53rj5SU" +
    "hSsEAJB3wMneo9w4iOTNZ2xLYJDTvfLPklIz/YD5qI+bLa3eLGuDv6fdSeFs45fdffxYvDty1Y/G" +
    "7R/DwfyW052zzUfcnb4FJoHRKtUF6RJkKjwmVBBUgAqWrGcDOwwOZ9RXxcRIjkPWV0S4CA48Xknz" +
    "SvxD+f2rf8MNZQbEzItt1UWmHXO9beCSoJVgAggb42G9efzYrY3wg1wNvX7qW8LpzzNspNdcPEWC" +
    "3G5W2S6/HbUA8h4DtIycAgjmM4HKovpO7uWS/wAOa2ohKXAl0fqQdlD7fuBU+4ja6tk6zOWq0Pfi" +
    "VyCA66EkJQkEHAzzJIFVlbYrk64RorQJcedShIHmTijt5nloyKwb537efqvThjZRyv0rpkmlJrB2" +
    "GByFKTXCgLoQFuqCaCaQmlEiAq14n6BdvD6rxZUBUzsgSI/LvcclJ/1Y2x19+dNSY78V5TMllxl1" +
    "JwpDiSkj4NdVPvNsMrdeWlDbaSpa1HASAMkmuc9d6lXqa+uShkRWvy4yD0QOp9Tz/bpXafD1bUSj" +
    "kuGWtG/bsPNIVcTG/wAhuVHKvHhZpf6LavqMtGJ01IOCN22uYHueZ+PKoJwv0t9cu342Y3mBDUFK" +
    "BGzjnMJ9up+B1q8yaH4guH9WM/6/A/KsoYM/MP2UO4h6OGpYqJEQpRcWE4QVbB1PPsk9PQ+p86pG" +
    "4W6ZbJCo8+M7HdTzS4nH2866cJqkOKGp/rN0ECIvMKGojI5OOcir2HIfJ60Ngq6hzuRjLR17fvZF" +
    "XQxgcex91CKtDhPprsj69MRvumIkj4Uv+w+ahmjdPuaivLcXxJjo8chwf4UDp7nkP+qvxlpuOy2y" +
    "whLbTaQlCE8kgbACm77X8tnh2HU7/T/vsht9Nxu5jtgvQmkJoJpCa5IBboC3pNITQFhSQpJyCMg0" +
    "hNJgJABQrie1f7jbm7XYoLrzL/ikuoUkbA7I3PXmfj1qr2eH2qHHkIVa3GwpQBWtacJ9TvyroImk" +
    "Jrbo7xNSRcqNo+uufdUyUjZHcTiVr7DaY1itMe3RB4Gk7qI3Wo81H1Jr7iaCa8yazHOc9xc45JTj" +
    "WgDAWh1s7dxZHGLDFcelP/llaFAFpJG53PPoPeqe/oXU3+Uvf70f81fhNITWrQ3SSjYWRtGvU5z7" +
    "qqajbM7LiVoNF6eRp2zIYUEmW7hchY6q8h6Dl9z1rek0E0hNJSyPmeZHnUpyOMMaGt2CCaQmsE0i" +
    "1BIJJ2AyagBXALw4e31F80vFcKwZEdIYfGdwpIwD8jB+9SImubtK6km6ZuIlwyFIUOy8yo+F1Pkf" +
    "I+R6Vddh1xY722nupaI8g848hQQoH0PJXxWhdbTLBKZIxlh106eSxKWoa9oa46qSE0hNY7YUMpII" +
    "PUGkJrGAT4CCaUmgmkJowFYAgmkJoJpCaMBWAIJpCaCa81qCRkkAeZowFYAsk1Htb3dFpsEhYVh9" +
    "5JaZHUqI3PwMn7UXvV9ntLau3JS++OTLBClE+p5D5qpNRX2Xf5xkyiEpSMNNJPhbT5D18zW1bbbJ" +
    "NIHvGGj1SFbWsiYWtOXH0X//2Q==",
  x: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjgiIGZpbGw9IiMwMDAiLz4KPHBhdGggZD0iTTggOGg3bDUgNy41TDI2IDhoNkwyNCAxOWwxMCAxM2gtN2wtNS41LTgtNi41IDhIOWw4LTExeiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
};

const PLATFORMS = {
  instagram: { label: "Instagram / Facebook", logos: ["ig", "fb"] },
  whatsapp:  { label: "WhatsApp",             logo: "wa" },
  email:     { label: "E-mail",               icon: "📧" },
  other:     { label: "Outro aplicativo",     icon: "📲" },
};

const DAMAGE_OPTIONS = [
  { key: "financial",  icon: "💸", label: "Prejuízo financeiro (vendas, contratos, anúncios)" },
  { key: "moral",      icon: "😔", label: "Dano moral / constrangimento público" },
  { key: "reputation", icon: "💼", label: "Reputação profissional ou comercial afetada" },
  { key: "privacy",    icon: "🔐", label: "Dados pessoais ou fotos íntimas expostos" },
  { key: "other",      icon: "📋", label: "Outros danos" },
];



// ─── Guia passo a passo ───
function GuideSteps({ title, steps, note, link, linkLabel }) {
  return (
    <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
      <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}
        dangerouslySetInnerHTML={{ __html: fmt(title) }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#15253f", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
            <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.55" }} dangerouslySetInnerHTML={{ __html: fmt(step) }} />
          </div>
        ))}
      </div>
      {note && <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fff9e6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>{note}</div>}
      {link && <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", padding: "8px 14px", background: "linear-gradient(135deg, #15253f, #1d3357)", borderRadius: "8px", fontSize: "12px", color: "#f3e0a8", textDecoration: "none", fontWeight: "600" }}>{linkLabel}</a>}
    </div>
  );
}

// ─── Guia + botões pós-tentativa ───
function GuidePanel({ guide, onFail, failLabel, onDirect, directLabel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
      <GuideSteps {...guide} />
      <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
        <strong>💡 Conseguiu resolver?</strong> Ótimo! Se ainda tiver dificuldades ou descobrir que houve danos reais, podemos analisar juridicamente.
      </div>
      {onFail && <GhostBtn onClick={onFail} label={`${failLabel} →`} />}
      {onDirect && directLabel && <GhostBtn onClick={onDirect} label={`${directLabel} →`} />}
    </div>
  );
}

// ─── Badge de probabilidade ───
function ProbabilityBadge({ level }) {
  const config = {
    muito_alta: { label: "🔥 Potencial jurídico muito alto", bg: "#fff3e0", border: "#f0a030", color: "#7a3e00" },
    alta:       { label: "⚡ Potencial jurídico alto",       bg: "#e8f5e9", border: "#66bb6a", color: "#1b5e20" },
    media:      { label: "📋 Potencial jurídico moderado",   bg: "#e3f2fd", border: "#64b5f6", color: "#0d47a1" },
    baixa:      { label: "ℹ️ Baixo potencial de ação judicial", bg: "#f5f5f5", border: "#bdbdbd", color: "#424242" },
  };
  const c = config[level] || config.media;
  return (
    <div style={{ padding: "10px 14px", background: c.bg, border: `2px solid ${c.border}`, borderRadius: "10px", fontSize: "12px", fontWeight: "700", color: c.color, textAlign: "center" }}>
      {c.label}
    </div>
  );
}

// ─── Guias de recuperação ───
const GUIDES = {
  ig_has_access: {
    title: "🔒 Aja agora para proteger sua conta",
    steps: [
      "**Troque sua senha imediatamente** — use uma senha forte e única (letras, números e símbolos)",
      "Vá em **Configurações → Segurança → Atividade de login** e encerre todas as sessões ativas em dispositivos desconhecidos",
      "Confira em **Configurações → Segurança → E-mail e telefone** se os dados ainda são os seus",
      "**Ative a verificação em dois fatores** (2FA) via app autenticador — não apenas SMS",
      "Revogue acesso de todos os **apps de terceiros suspeitos** em Configurações → Segurança → Apps autorizados",
    ],
    note: "⚠️ Mesmo tendo recuperado o acesso, se o invasor aplicou golpes, expôs seus dados ou causou outros danos — há respaldo jurídico.",
    link: "https://www.instagram.com/accounts/password/change/",
    linkLabel: "Trocar senha no Instagram →",
  },
  ig_hardening: {
    title: "🛡️ Proteja sua conta agora — etapas pós-recuperação",
    steps: [
      "**Troque sua senha imediatamente** — use uma combinação de letras maiúsculas, minúsculas, números e símbolos que você não usa em outro serviço",
      "Vá em **Configurações → Segurança → Atividade de login** e encerre todas as sessões ativas — especialmente em dispositivos desconhecidos",
      "**Ative a verificação em dois fatores (2FA) via app autenticador** (Google Authenticator, Authy) — evite apenas SMS, que pode ser interceptado",
      "Acesse **Configurações → Segurança → Códigos de backup** e salve os códigos em local seguro — eles permitem acesso mesmo sem o autenticador",
      "Revise os **apps conectados à sua conta**: Configurações → Segurança → Apps autorizados — remova qualquer acesso desconhecido",
      "Verifique se o **e-mail e telefone cadastrados** ainda são os seus em Configurações → Conta → Informações pessoais",
    ],
    note: "⚠️ Contas recuperadas sem hardening imediato têm alto risco de re-invasão. Os backup codes são especialmente importantes — sem eles, uma nova perda de 2FA pode ser muito mais difícil de resolver.",
    link: "https://www.instagram.com/accounts/password/change/",
    linkLabel: "Trocar senha no Instagram →",
  },
  ig_cred_ok: {
    title: "Recuperar Instagram pelo e-mail ou telefone",
    steps: [
      "**Use o celular ou computador que você costumava usar** para acessar o Instagram — sistemas de segurança confiam mais em dispositivos conhecidos e isso aumenta a chance de aprovação",
      "Na tela de login, toque em **«Esqueci a senha»** ou **«Obter ajuda para entrar»**",
      "Informe seu nome de usuário, e-mail ou telefone cadastrado e toque em **Avançar**",
      "Escolha receber o código por **SMS** ou pelo **e-mail** vinculado à conta",
      "Insira o código recebido e crie uma **nova senha segura**",
      "Após entrar, vá em **Configurações → Segurança** e encerre todas as sessões ativas",
    ],
    link: "https://www.instagram.com/accounts/password/reset/",
    linkLabel: "Recuperar senha no Instagram →",
  },
  ig_email_changed: {
    title: "O hacker trocou o e-mail — o que fazer",
    steps: [
      "**Use o celular ou computador que você costumava usar** para acessar o Instagram — isso aumenta a confiança do sistema de segurança",
      "**Verifique seu e-mail original** — o Instagram envia automaticamente um e-mail de «reverter alteração» quando o e-mail da conta é trocado",
      "Se encontrar esse e-mail, clique em **«Reverter esta alteração»** — isso anula a troca e devolve o acesso",
      "Procure também na pasta de **spam** e **lixo eletrônico**",
      "Se não encontrou o e-mail de reversão, tente recuperar **pelo número de telefone**: tela de login → Esqueci a senha → opção por SMS",
      "Se o telefone também foi alterado, acesse **instagram.com/hacked** para iniciar recuperação por identidade",
    ],
    link: "https://instagram.com/hacked",
    linkLabel: "instagram.com/hacked →",
  },
  ig_phone_changed: {
    title: "O hacker trocou o telefone — o que fazer",
    steps: [
      "**Use o celular ou computador que você costumava usar** para acessar o Instagram — sistemas de segurança confiam mais em dispositivos conhecidos",
      "Tente recuperar pelo **e-mail cadastrado**: tela de login → Esqueci a senha → receber código por e-mail",
      "Se o código chegar, acesse a conta e vá direto em **Configurações → Número de telefone** para restaurar o seu",
      "Se o e-mail também foi alterado, verifique sua caixa de entrada pelo e-mail de **«Reverter alteração»** enviado pelo Instagram",
      "Se nenhuma opção funcionar, acesse **instagram.com/hacked** para verificação de identidade",
    ],
    link: "https://instagram.com/hacked",
    linkLabel: "instagram.com/hacked →",
  },
  ig_both_photos: {
    title: "Recuperação por selfie de vídeo (perfil com fotos)",
    steps: [
      "**Use o celular ou computador que você costumava usar** para acessar o Instagram — isso reduz o atrito no processo de verificação",
      "Acesse **instagram.com/hacked** no navegador do seu celular ou computador",
      "Informe o nome de usuário da conta e selecione **«Minha conta foi hackeada»**",
      "Forneça um **e-mail de contato válido** (pode ser um e-mail novo, não vinculado ao Instagram)",
      "O Instagram solicitará uma **selfie de vídeo** — você virará o rosto lentamente em diferentes direções na câmera. Para aumentar a chance de aprovação: boa iluminação, rosto centralizado, mesma aparência das fotos do perfil e ambiente silencioso",
      "Após o envio, aguarde a análise — o Instagram responderá pelo e-mail fornecido em **3 a 10 dias úteis**",
    ],
    note: "⚠️ Esse processo pode ser demorado e sem garantia. Se você teve prejuízo real, uma ação jurídica pode ser mais eficaz.",
    link: "https://instagram.com/hacked",
    linkLabel: "Iniciar recuperação no Instagram →",
  },
  ig_both_nophotos: {
    title: "Recuperação por formulário de identidade (perfil sem fotos)",
    steps: [
      "**Use o celular ou computador que você costumava usar** para acessar o Instagram — sistemas de segurança confiam mais em dispositivos conhecidos",
      "Acesse **instagram.com/hacked** e informe o nome de usuário da conta",
      "Selecione **«Minha conta foi hackeada»** e forneça um e-mail de contato válido",
      "Preencha o formulário descrevendo a situação e informando o **tipo de dispositivo** que você usava (Android, iPhone, iPad...)",
      "Forneça detalhes que provem a titularidade: data de criação da conta, e-mail antigo, nomes de seguidores próximos",
      "O Instagram pode solicitar uma **selfie de vídeo** mesmo sem fotos no perfil — se isso ocorrer: boa iluminação, rosto centralizado e ambiente sem interferências",
      "Aguarde a resposta do Instagram pelo e-mail informado — **pode levar de 7 a 14 dias úteis**",
    ],
    note: "⚠️ Sem fotos no perfil, a verificação é mais difícil. A via jurídica pode ser mais eficaz.",
    link: "https://instagram.com/hacked",
    linkLabel: "Iniciar recuperação no Instagram →",
  },
  wa_hacked: {
    title: "WhatsApp clonado — recuperar acesso",
    steps: [
      "**Use o número de telefone original** — reinstale o WhatsApp no seu aparelho e insira seu número",
      "O app enviará um **código de 6 dígitos por SMS** — ao inserir, sua conta é desconectada do dispositivo do hacker",
      "Se o hacker ativou PIN de 2 fatores, toque em **«Esqueci o PIN»** e acesse pelo e-mail de recuperação",
      "Se não tiver e-mail de recuperação, aguarde **7 dias** para o PIN ser desativado automaticamente",
      "Após recuperar, **ative a verificação em dois fatores** imediatamente: Configurações → Conta → Verificação em duas etapas",
    ],
    note: "⚠️ Se o hacker usou sua conta para aplicar golpes em contatos ou você sofreu danos, há respaldo jurídico.",
    link: "https://faq.whatsapp.com/465883178708358",
    linkLabel: "Central de ajuda do WhatsApp →",
  },
  wa_banned: {
    title: "WhatsApp banido — como recorrer",
    steps: [
      "Abra o WhatsApp — se a conta foi banida, verá a mensagem **«Esta conta está impedida de usar o WhatsApp»**",
      "Se disponível, toque em **«Solicitar Análise»** diretamente no app e explique que o banimento foi um erro",
      "Se não aparecer a opção, envie e-mail para **[support@whatsapp.com](mailto:support@whatsapp.com)** relatando o banimento indevido e seu número completo com DDI",
      "**Documente tudo**: print da tela de banimento, print do e-mail enviado e qualquer resposta recebida",
      "Se a conta era usada para negócios, reúna provas do uso profissional: prints de atendimento, contratos, recibos",
    ],
    note: "⚖️ O WhatsApp frequentemente bane sem dar motivo nem direito de defesa — o que configura violação ao CDC. Juízes brasileiros têm determinado reativações em até 3 dias úteis, com multa diária ao WhatsApp em caso de descumprimento.",
    link: "https://faq.whatsapp.com/465883178708358",
    linkLabel: "Central de ajuda do WhatsApp →",
  },
  email_hacked: {
    title: "E-mail comprometido — recuperar acesso",
    steps: [
      "Acesse a página de login e clique em **«Esqueci a senha»** ou **«Não consigo acessar»**",
      "Verifique se ainda tem acesso ao **telefone** ou **e-mail alternativo** de recuperação",
      "Se os dados foram alterados, o provedor pode solicitar verificação de identidade com documentos",
      "No Gmail: acesse **accounts.google.com/signin/recovery** e siga o processo guiado",
    ],
    link: "https://accounts.google.com/signin/recovery",
    linkLabel: "Recuperar conta Google →",
  },
  other_hacked: {
    title: "Conta invadida — passos gerais",
    steps: [
      "Use a opção **«Esqueci a senha»** ou **«Recuperar conta»** na tela de login",
      "Se o hacker alterou o e-mail/telefone, procure na caixa de entrada por e-mails de **«reverter alterações»**",
      "Contate o **suporte oficial** do aplicativo relatando a invasão",
    ],
    link: null, linkLabel: null,
  },
  password: {
    instagram: { title: "Recuperar senha do Instagram / Facebook", steps: ["Toque em **«Esqueci a senha»** na tela de login", "Informe e-mail, telefone ou nome de usuário cadastrado", "Escolha receber o código por **SMS** ou **e-mail**", "Insira o código e crie uma nova senha segura"], link: "https://www.instagram.com/accounts/password/reset/", linkLabel: "Redefinir senha →" },
    whatsapp:  { title: "Recuperar acesso ao WhatsApp", steps: ["Desinstale e reinstale o app do WhatsApp", "Insira o mesmo número de telefone que usava", "Aguarde o **código por SMS** (6 dígitos)", "Se não chegar, solicite chamada de voz automática"], link: "https://faq.whatsapp.com/", linkLabel: "Central de ajuda →" },
    email:     { title: "Recuperar acesso ao e-mail", steps: ["Acesse a página do provedor e clique em **«Esqueci a senha»**", "Siga o processo de recuperação por celular ou e-mail alternativo", "No Gmail: accounts.google.com/signin/recovery"], link: "https://accounts.google.com/signin/recovery", linkLabel: "Recuperar conta Google →" },
    other:     { title: "Recuperar acesso ao aplicativo", steps: ["Procure **«Esqueci a senha»** na tela de login", "Informe e-mail ou telefone cadastrado", "Verifique sua caixa de entrada pelo link de recuperação"], link: null, linkLabel: null },
  },
  twofa: {
    instagram: { title: "Instagram / Facebook sem autenticador", steps: ["Procure os **códigos de backup de 8 dígitos** guardados ao ativar o 2FA", "Na tela de login, após a senha clique em **«Tentar outra forma»**", "Selecione **«Obter ajuda»** e siga as instruções de verificação de identidade"], link: "https://help.instagram.com/", linkLabel: "Central de ajuda →" },
    whatsapp:  { title: "WhatsApp sem PIN de 2 fatores", steps: ["Reinstale o app e insira seu número", "Após SMS de verificação, toque em **«Esqueci o PIN»**", "Use o e-mail de recuperação cadastrado", "Se não tiver e-mail, aguarde **7 dias** para o PIN expirar"], link: "https://faq.whatsapp.com/", linkLabel: "Central de ajuda →" },
    email:     { title: "E-mail sem autenticador", steps: ["Procure os **códigos de backup** do quando ativou o 2FA", "Nas opções de recuperação, selecione **«Outra forma»**"], link: "https://accounts.google.com/signin/recovery", linkLabel: "Recuperar conta Google →" },
    other:     { title: "Sem autenticador", steps: ["Procure os **códigos de backup** do quando ativou o 2FA", "Contate o suporte do app explicando que perdeu o autenticador"], link: null, linkLabel: null },
  },
  suspended: {
    title: "Conta suspensa ou desativada — como recorrer",
    steps: [
      "Verifique nas configurações do app se há uma seção de **status da conta** ou **central de ajuda** — lá costuma aparecer o motivo e um botão de recurso",
      "Tente fazer login normalmente: se aparecer mensagem de suspensão ou desativação, procure a opção **«Contestar»**, **«Recorrer»** ou **«Solicitar revisão»**",
      "Se não aparecer a opção no app, acesse o **site oficial de suporte da plataforma** e busque o formulário de contestação de conta suspensa ou desativada",
      "Preencha com seus dados reais e descreva o caso de forma **objetiva e respeitosa** — jamais use tom agressivo ou forneça informações falsas",
      "Sem resposta em 7 dias úteis, envie novamente — é permitido repetir o recurso",
      "**Tire prints de tudo**: telas de suspensão ou desativação, formulários enviados e qualquer resposta recebida — são provas fundamentais",
    ],
    note: "⚖️ Se a suspensão ou desativação foi indevida e causou danos financeiros, morais ou de reputação — especialmente em contas comerciais ou de influenciadores — é possível buscar reativação por liminar judicial e indenização.",
    link: null, linkLabel: null,
  },
};



// ════════════════════════════════════════════
//   COMPONENTE PRINCIPAL
// ════════════════════════════════════════════
export default function LexChatbot() {
  const [messages, setMessages]     = useState([]);
  const [showUI, setShowUI]         = useState(null);
  const [isTyping, setIsTyping]     = useState(false);

  // Dados básicos
  const [platform, setPlatform]     = useState(null);
  const [name, setName]             = useState("");
  const nameRef = useRef("");
  const [description, setDescription] = useState("");
  const [damages, setDamages]       = useState([]);
  const [inputVal, setInputVal]     = useState("");

  // Fluxo Instagram — credenciais (invasão por hacker)
  const [emailChanged, setEmailChanged] = useState(null);
  const [phoneChanged, setPhoneChanged] = useState(null);
  const [hasPhotos, setHasPhotos]   = useState(null);

  // Fluxo Instagram — desativação/suspensão (novo)
  const [msgType, setMsgType]           = useState(null); // desativada|suspensa|atividade|verificacao|nenhuma
  const [emailNotif, setEmailNotif]     = useState(null); // recebeu email?
  const [emailReason, setEmailReason]   = useState(null);
  const [invasionSigns, setInvasionSigns] = useState(null);
  const [economic, setEconomic]         = useState(null);
  const [economicType, setEconomicType] = useState(null);
  const [timeDeactivated, setTimeDeactivated] = useState(null);
  const [appealTried, setAppealTried]   = useState(null);
  const [caseProbability, setCaseProbability] = useState(null);
  const [forcedProb, setForcedProb]           = useState(null);
  const [journey, setJourney]           = useState([]); // registro completo do fluxo
  const [subApp, setSubApp]             = useState(null); // para "outro aplicativo"
  const [pendingIssue, setPendingIssue] = useState(null);
  const [waIssueType, setWaIssueType]   = useState(null); // hacked|banned|other
  // Fluxo 2FA
  const [tfaHasPassword, setTfaHasPassword] = useState(null);
  const [tfaMethod, setTfaMethod]           = useState(null);

  // ─── Fase 1: novos campos de triagem ───
  const [securityEmailReceived, setSecurityEmailReceived] = useState(null); // 1.1 e-mail security@
  const [hasBusinessManager,    setHasBusinessManager]    = useState(null); // 1.2 BM / Ads
  const [hasMetaVerified,       setHasMetaVerified]       = useState(null); // 1.3 Meta Verified
  const [officialTried,   setOfficialTried]   = useState(null); // canais oficiais Meta: sim|sem_acesso|nao
  const [officialOutcome, setOfficialOutcome] = useState(null); // resultado no canal oficial
  const [layer,         setLayer]         = useState(null); // Etapa 3: camada Meta afetada
  const [sessionAccess, setSessionAccess] = useState(null); // Etapa 3: ainda tem acesso?

  const bottomRef = useRef(null);
  const guideRef  = useRef(null);
  const officialOptsRef = useRef({}); // carrega opts (ex.: loopDetected) até a classificação
  const metaPatternRef = useRef(false); // Etapa 2: padrão recente de invasão via suporte da Meta

  const addBot  = (text) => setMessages(p => [...p, { role: "bot",  text, id: Math.random() }]);
  const addUser = (text) => setMessages(p => [...p, { role: "user", text, id: Math.random() }]);
  const addJourney = (label, value) => setJourney(p => [...p, { label, value }]);

  const botDelay = (text, delay, after = null) => {
    setIsTyping(true); setShowUI(null);
    setTimeout(() => { setIsTyping(false); addBot(text); if (after) after(); }, delay);
  };

  useEffect(() => {
    setTimeout(() => {
      addBot("Olá! Eu sou o **Lex**, assistente jurídico do escritório **Marques & Cunha**. 👋");
      botDelay("Estou aqui para entender o que aconteceu com sua conta e verificar se há amparo jurídico para o seu caso.", 1600,
        () => botDelay("Vou te guiar por algumas perguntas rápidas — **basta clicar nas opções** que aparecerem abaixo de cada mensagem. 👇", 1400,
          () => botDelay("Primeiro, me diga: **qual plataforma** foi afetada?", 1100, () => setShowUI("platform"))
        )
      );
    }, 400);
  }, []);

  const isGuideUI = (ui) => typeof ui === "string" && (ui.startsWith("guide_") || ui === "ig_restriction_guide" || ui === "ig_csam_guide" || ui.startsWith("twofa_guide") || ui === "ig_appeal_guide" || ui === "ig_metaai_guide");

  useEffect(() => {
    if (isGuideUI(showUI)) {
      setTimeout(() => { guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showUI, isTyping]);

  // ─── WhatsApp opener ───
  const openWhatsApp = () => {
    const probLabels = { muito_alta: "🔥 Muito alta", alta: "⚡ Alta", media: "📋 Moderada", baixa: "ℹ️ Baixa" };
    let msg = `*Novo caso — Lex Assistente Jurídico*\n━━━━━━━━━━━━━━━━\n\n`;

    // Bloco 1: Identificação
    msg += `*IDENTIFICAÇÃO*\n`;
    if (name) msg += `• Nome: ${name}\n`;
    msg += `• Plataforma: ${PLATFORMS[platform]?.label}\n`;
    if (subApp) msg += `• Aplicativo: ${subApp}\n`;
    if (economic !== null) msg += `• Uso comercial/profissional: ${economic ? "Sim" : "Não"}\n`;
    msg += `\n`;

    // Bloco 2: Diagnóstico do problema (jornada capturada)
    // Labels com bloco dedicado na mensagem são filtrados para evitar duplicidade
    const JOURNEY_SKIP = new Set([
      // Bloco 1 — IDENTIFICAÇÃO
      "Nome", "Plataforma", "Problema relatado", "Aplicativo",
      "Conta com fins econômicos", "WhatsApp — Uso para trabalho/negócios",
      // Bloco 3 — DETALHES DO BLOQUEIO
      "Mensagem exibida ao tentar acessar", "Recebeu e-mail da plataforma",
      "Motivo alegado no e-mail", "Sinais de invasão antes da suspensão ou desativação",
      "Tempo desde a suspensão ou desativação", "Tentou recorrer na plataforma",
      // Bloco 4 — CREDENCIAIS
      "E-mail alterado pelo hacker", "Telefone alterado pelo hacker", "Fotos no perfil",
      // Bloco 5 — IMPACTO ECONÔMICO
      "Conta gerava renda", "Tipo de atividade econômica",
      // Bloco 1 — FASE 1 (novos campos)
      "E-mail de reversão recebido (security@)", "Tem Business Manager / Anúncios", "Meta Verified",
      // DIAGNÓSTICO — sub-labels com bloco dedicado
      "Conteúdo sinalizado — descrição",
      // Resultados internos (não chegam ao WA, mas por segurança)
      "Resultado", "Resultado 2FA",
    ]);
    const journeyFiltered = journey.filter(({ label }) => !JOURNEY_SKIP.has(label));
    if (journeyFiltered.length > 0) {
      msg += `*DIAGNÓSTICO DO CASO*\n`;
      journeyFiltered.forEach(({ label, value }) => {
        msg += `• ${label}: ${value}\n`;
      });
      msg += `\n`;
    }

    // Bloco 3: Detalhes da desativação/bloqueio
    const hasBlockDetails = msgType || emailNotif !== null || emailReason || invasionSigns !== null || timeDeactivated || appealTried;
    if (hasBlockDetails) {
      msg += `*DETALHES DO BLOQUEIO*\n`;
      if (msgType) msg += `• Mensagem exibida: ${msgType}\n`;
      if (emailNotif === false) msg += `• E-mail da plataforma: Não recebeu\n`;
      if (emailNotif === true) msg += `• E-mail da plataforma: Recebeu\n`;
      if (emailReason) msg += `• Motivo alegado: ${emailReason}\n`;
      if (invasionSigns === true) msg += `• Sinais de invasão prévia: ⚠️ Sim\n`;
      if (invasionSigns === false) msg += `• Sinais de invasão prévia: Não\n`;
      if (timeDeactivated) msg += `• Tempo desde a suspensão ou desativação: ${timeDeactivated}\n`;
      if (appealTried) msg += `• Tentou recorrer: ${appealTried}\n`;
      msg += `\n`;
    }

    // Bloco 4: Credenciais (hacker)
    const hasCredDetails = emailChanged !== null || phoneChanged !== null || hasPhotos !== null || securityEmailReceived !== null;
    if (hasCredDetails) {
      msg += `*CREDENCIAIS*\n`;
      if (emailChanged !== null) msg += `• E-mail alterado pelo hacker: ${emailChanged === true ? "Sim" : emailChanged === false ? "Não" : "Desconhecido"}\n`;
      if (securityEmailReceived !== null) msg += `• E-mail de reversão (security@): ${securityEmailReceived === true ? "✅ Recebeu" : securityEmailReceived === false ? "Não recebeu" : "Não verificou"}\n`;
      if (phoneChanged !== null) msg += `• Telefone alterado pelo hacker: ${phoneChanged === true ? "Sim" : phoneChanged === false ? "Não" : "Desconhecido"}\n`;
      if (hasPhotos !== null) msg += `• Fotos no perfil: ${hasPhotos ? "Sim" : "Não"}\n`;
      msg += `\n`;
    }

    // Bloco 5: Impacto econômico (tipo de atividade, se informado)
    if (economicType) {
      msg += `*IMPACTO ECONÔMICO*\n`;
      msg += `• Tipo de atividade: ${economicType}\n`;
      if (hasBusinessManager !== null) msg += `• Business Manager / Anúncios: ${hasBusinessManager ? "Sim" : "Não"}\n`;
      if (hasMetaVerified !== null) {
        const mvLabel = hasMetaVerified === "tem" ? "Sim, tem ativo" : "Não tem";
        msg += `• Meta Verified: ${mvLabel}\n`;
      }
      msg += `\n`;
    }

    // Bloco 6: Descrição livre
    if (description) {
      msg += `*RELATO DO CASO*\n`;
      msg += `${description}\n\n`;
    }

    // Bloco 7: Danos
    const dmg = damages.map(d => DAMAGE_OPTIONS.find(o => o.key === d)?.label).filter(Boolean);
    if (dmg.length) {
      msg += `*DANOS SOFRIDOS*\n`;
      dmg.forEach(d => { msg += `• ${d}\n`; });
      msg += `\n`;
    }

    // Bloco 8: Classificação
    if (caseProbability) {
      msg += `*CLASSIFICAÇÃO*\n`;
      msg += `• Potencial jurídico: ${probLabels[caseProbability] || caseProbability}\n`;
    }

    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ─── Escalada para coleta de dados ───
  const escalate = (intro) => {
    const text = intro || "Vamos coletar os dados do seu caso para que um advogado possa analisá-lo com precisão.";
    botDelay(text, 900, () => {
      if (name) {
        botDelay(`Perfeito, **${name.split(" ")[0]}**. Me conte mais sobre o que aconteceu:`, 800, () => setShowUI("desc-input"));
      } else {
        botDelay("**Qual é o seu nome completo?**", 900, () => setShowUI("name-input"));
      }
    });
  };

  // ─── Classificação do caso e mensagem automática ───
  const classifyAndEscalate = ({ prob, scenario, note }) => {
    setCaseProbability(prob);
    const hasSupportChannel = hasMetaVerified === "tem" || hasBusinessManager === true;
    botDelay(`**Análise preliminar concluída.**`, 800,
      () => botDelay(scenario, 1200,
        () => botDelay(note || "Para que um advogado possa avaliar formalmente o seu caso, preciso de mais alguns dados.", 1300,
          () => {
            if (hasSupportChannel) {
              const canal = hasMetaVerified === "tem"
                ? "Meta Verified"
                : "Business Support (conta de anúncios)";
              botDelay(`Antes de registrar o caso, uma observação importante: você tem acesso ao **${canal}**, que dá acesso a um canal de suporte prioritário da Meta.`, 1300,
                () => botDelay("Se quiser tentar esse canal primeiro, use o modelo abaixo para a mensagem de suporte — mensagens objetivas, no formato de incidente e com pedido claro costumam ter mais chance de resolução:", 1300,
                  () => setShowUI("ig_support_template")
                )
              );
            } else {
              if (description) {
                // Descrição já coletada anteriormente — pular desc-input
                if (name) {
                  botDelay("**Quais danos você sofreu?** Pode marcar mais de um.", 900, () => setShowUI("damages"));
                } else {
                  botDelay("**Qual é o seu nome completo?**", 900, () => setShowUI("name-input"));
                }
              } else if (name) {
                botDelay(`Perfeito, **${name.split(" ")[0]}**. Me conte mais sobre o que aconteceu:`, 800, () => setShowUI("desc-input"));
              } else {
                botDelay("**Qual é o seu nome completo?**", 900, () => setShowUI("name-input"));
              }
            }
          }
        )
      )
    );
  };

  // ─── Calcular probabilidade e classificar ───
  const computeAndClassify = ({ inv, econ, msg, emailN, loopDetected }) => {
    const invasion = inv ?? invasionSigns;
    const hasEcon  = econ ?? economic;
    const mType    = msg ?? msgType;
    const noEmail  = emailN !== undefined ? emailN : (emailNotif === false);

    if (forcedProb) {
      const tipoEntry = journey.find(j => j.label === "Tipo do caso");
      const tipo = tipoEntry?.value || "";
      let sc = "", nt = "";
      if (tipo.includes("nudez") || tipo.includes("sexualiz")) {
        sc = "\uD83D\uDD25 Seu caso se enquadra como **acusação indevida de nudez ou sexualização infantil** — falso positivo do algoritmo da Meta, com **altíssimo potencial jurídico**. Temos precedente do TJSP com condenação à reativação em 48h e indenização por danos morais.";
        nt = "A própria acusação falsa constitui dano moral autônomo — mesmo que a conta seja reativada, o dano já ocorreu e é indenizável.";
      } else if (tipo.includes("Restrições")) {
        sc = "\u26A1 Seu caso se enquadra como **restrição indevida de funcionalidades** — a falta de motivação concreta da plataforma tem sido amplamente acolhida pelos tribunais brasileiros para determinar a remoção das restrições.";
        nt = "Dependendo do impacto econômico comprovável, há base para pedido de indenização por dano material e moral.";
      } else if (tipo.includes("Invasão") || tipo.includes("invasão")) {
        sc = "\uD83D\uDD25 Seu caso se enquadra como **invasão de conta** — um dos cenários com **maior probabilidade de êxito judicial** contra a Meta no Brasil.";
        nt = "A combinação de invasão + danos gera forte argumento jurídico, podendo incluir pedido de liminar para reativação e indenização.";
      } else if (tipo.includes("2FA")) {
        sc = "\u26A1 Seu caso se enquadra como **bloqueio de acesso por falha no sistema de autenticação** — quando todos os mecanismos oficiais falham, isso configura falha da própria plataforma em garantir acesso ao titular legítimo.";
        nt = "Há base jurídica para exigir a reativação e, dependendo dos danos sofridos, indenização.";
      } else {
        sc = "\u26A1 Seu caso apresenta **alto potencial jurídico** com base no relato coletado.";
        nt = "Um advogado especializado irá avaliar a melhor estratégia para o seu caso.";
      }
      if (metaPatternRef.current) {
        nt += " Há ainda indício de **falha no próprio mecanismo de suporte/recuperação da Meta** (acesso comprometido sem interação do titular), o que reforça a tese de responsabilidade da plataforma.";
      }
      classifyAndEscalate({ prob: forcedProb, scenario: sc, note: nt });
      return;
    }

    let prob = "media";
    let scenario = "";
    let note = "";

    if (invasion === true) {
      prob = "muito_alta";
      scenario = "🔥 Com base no que você descreveu, este se enquadra como **conta hackeada e depois suspensa ou desativada** — um dos cenários com **maior probabilidade de êxito judicial** contra a Meta no Brasil.";
      note = "A combinação de invasão + suspensão/desativação gera forte argumento jurídico, podendo incluir pedido de **liminar para reativação** e **indenização por danos**.";
    } else if (noEmail || mType === "desativada" || mType === "suspensa") {
      prob = "alta";
      scenario = "⚡ Seu caso se enquadra como **suspensão ou desativação sem fundamento claro** — em processos contra a Meta, a ausência de notificação ou motivação genérica tem sido amplamente acolhida pelos tribunais brasileiros para **determinar a reativação da conta**.";
      note = hasEcon
        ? "Como a conta gerava renda, há também forte base para pedido de **indenização por dano material e moral**."
        : "Podemos avaliar pedidos de reativação e, se cabível, **indenização por dano moral**.";
    } else if (mType === "atividade" || mType === "verificacao" || mType === "twofa_hacker") {
      prob = "alta";
      scenario = "⚡ A **restrição por atividade suspeita, verificação de identidade ou bloqueio de 2 fatores** — especialmente sem sucesso no processo de recuperação — é tratado como **falha da plataforma** em garantir o acesso legítimo ao titular da conta.";
      note = "Há base jurídica para exigir a reativação e, dependendo dos danos sofridos, indenização.";
    } else {
      prob = "media";
      scenario = "📋 Com base nas informações coletadas, seu caso apresenta **potencial jurídico moderado**. Precisamos analisar os detalhes completos para definir a melhor estratégia.";
      note = "Um advogado especializado poderá avaliar se há base para ação judicial ou recurso administrativo efetivo.";
    }

    // 3.1 — Loop de revisão detectado: reforçar nota com orientação de canais oficiais de suporte
    if (loopDetected) {
      note += " Como o recurso dentro da plataforma não estava acessível, recomendamos priorizar os canais oficiais de suporte da Meta (assistente de suporte da Meta AI, Central de Recuperação ou Meta Verified, se disponível) antes de acionar a via judicial.";
    }

    classifyAndEscalate({ prob, scenario, note });
  };

  // ─── Perguntas complementares (economic → time → appeal → classify) ───
  const askEconomic = () => {
    botDelay("**Mais uma pergunta importante:** a conta era usada para trabalho ou gerava alguma renda?", 1000, () => setShowUI("ig_economic"));
  };

  const onEconomic = (val) => {
    setEconomic(val);
    addUser(val ? "Sim, gerava renda / era usada para trabalho" : "Não, era pessoal"); addJourney("Conta gerava renda", val ? "Sim" : "Não");
    if (val) {
      botDelay("Que tipo de atividade econômica?", 800, () => setShowUI("ig_economic_type"));
    } else {
      askTime(); // conta pessoal: pula BM e Meta Verified
    }
  };

  const onEconomicType = (type) => {
    setEconomicType(type); addUser(type); addJourney("Tipo de atividade econômica", type); askBusinessAndVerified();
  };

  // ─── 1.2 + 1.3 — Business Manager e Meta Verified ───
  const askBusinessAndVerified = () => {
    botDelay("Mais uma pergunta rápida — essa conta está vinculada a uma **conta de anúncios ou Business Manager** do Facebook?", 1000, () => setShowUI("ig_business_manager"));
  };

  const onBusinessManager = (val) => {
    setHasBusinessManager(val);
    addUser(val ? "Sim, tem conta de anúncios ou Business Manager" : "Não, não tem");
    addJourney("Tem Business Manager / Anúncios", val ? "Sim" : "Não");
    botDelay("Última pergunta antes do diagnóstico: você tem o **Meta Verified**::mv::ativo na sua conta?", 1000, () => setShowUI("ig_meta_verified"));
  };

  const onMetaVerified = (val) => {
    setHasMetaVerified(val);
    const labels = { tem: "Sim, tenho Meta Verified ativo", pode: "Não tenho", nao: "Não tenho e não quero" };
    addUser(labels[val] || val);
    addJourney("Meta Verified", labels[val] || val);
    askTime();
  };

  const askTime = () => {
    botDelay("**Há quanto tempo** a conta foi suspensa ou desativada?", 900, () => setShowUI("ig_time"));
  };

  const onTime = (val) => {
    setTimeDeactivated(val); addUser(val); addJourney("Tempo desde a suspensão ou desativação", val);
    if (val === "Hoje / menos de 24 horas") {
      botDelay("⚡ **Casos recentes têm maior chance de resolução** — agir nas primeiras horas aumenta significativamente a eficácia do recurso dentro da própria plataforma.", 1100,
        () => askAppeal()
      );
    } else {
      askAppeal();
    }
  };

  const askAppeal = () => {
    botDelay("**Você já tentou recorrer** da decisão dentro do próprio Instagram ou Facebook?", 900, () => setShowUI("ig_appeal"));
  };

  const onAppeal = (val) => {
    setAppealTried(val); addUser(val); addJourney("Tentou recorrer na plataforma", val);
    if (val === "Não, ainda não tentei recorrer") {
      botDelay("Antes de mostrar como recorrer — uma pergunta importante:", 900,
        () => botDelay("**A conta ainda existe?** Você consegue ver o perfil no Instagram ou Facebook ao abrir o app ou acessar pelo navegador?", 1100, () => setShowUI("ig_account_exists"))
      );
    } else if (val === "Tentei, mas não consegui acessar o recurso") {
      // 3.1 — Loop de revisão detectado: botão some ou cliente fica preso
      botDelay("Esse é um padrão frequente — a opção de recurso desaparece ou o app entra em loop sem permitir o apelo.", 1100,
        () => botDelay("Quando isso acontece, ficar insistindo pelo aplicativo geralmente não resolve. O caminho mais eficaz é usar os canais oficiais de suporte da Meta — como o assistente de suporte da Meta AI ou a Central de Recuperação.", 1200,
          () => botDelay("Vamos classificar seu caso e identificar o melhor canal disponível para você.", 1000,
            () => askOfficialChannels({ loopDetected: true })
          )
        )
      );
    } else {
      askOfficialChannels({});
    }
  };

  // ─── Canais oficiais da Meta (esgotamento administrativo + prova) ───
  const askOfficialChannels = (opts = {}) => {
    officialOptsRef.current = opts;
    botDelay("**Mais uma pergunta importante** para o especialista: você já tentou recuperar a conta pelos **canais oficiais da Meta** — o assistente de suporte da Meta AI, a Central de Recuperação ou o suporte dentro do app?", 1000, () => setShowUI("ig_official_channels"));
  };

  const onOfficialChannels = (val) => {
    setOfficialTried(val);
    const labels = {
      sim: "Sim, tentei pelos canais oficiais",
      sem_acesso: "Tentei, mas não consegui nem abrir o suporte",
      nao: "Não, ainda não tentei",
    };
    addUser(labels[val]); addJourney("Tentou os canais oficiais da Meta", labels[val]);
    if (val === "sim") {
      botDelay("E o que aconteceu quando você tentou?", 800, () => setShowUI("ig_official_outcome"));
    } else {
      offerMetaAIGuide();
    }
  };

  const onOfficialOutcome = (val) => {
    setOfficialOutcome(val); addUser(val); addJourney("Resultado no canal oficial", val);
    offerMetaAIGuide();
  };

  // ─── Guia: pedir nova análise pelo assistente de suporte da Meta AI ───
  const offerMetaAIGuide = () => {
    botDelay("Existe um caminho oficial e gratuito que pode pedir uma **nova análise** da sua conta: o **assistente de suporte da Meta AI**. Quer que eu te mostre o passo a passo? Se não resolver, vira prova e fortalece o seu caso.", 1100, () => setShowUI("ig_metaai_offer"));
  };

  // ─── Etapa 2 — padrão recente de invasão via suporte da Meta (junho/2026) ───
  // Só pergunta quando o caso é de invasão; senão segue direto para a classificação.
  const maybeAskMetaPattern = () => {
    const tipo = (journey.find(j => j.label === "Tipo do caso")?.value) || "";
    const isInvasion = invasionSigns === true || emailChanged === true || phoneChanged === true || /invas|hack/i.test(tipo);
    if (isInvasion) {
      botDelay("Para o especialista entender **como** o acesso foi perdido: você chegou a clicar em algum link suspeito ou a informar sua senha / código de verificação a alguém?", 1000, () => setShowUI("ig_meta_pattern"));
    } else {
      computeAndClassify(officialOptsRef.current);
    }
  };

  const onMetaPattern = (val) => {
    const labels = {
      nao_interagiu: "Não — não cliquei em nada nem passei senha/código a ninguém",
      interagiu: "Sim — cliquei em link ou informei senha/código",
      incerto: "Não tenho certeza",
    };
    addUser(labels[val]); addJourney("Clicou em link ou passou senha/código", labels[val]);

    // Impressão digital do padrão recente: sem interação do usuário + credencial trocada por terceiro.
    const credentialTaken = emailChanged === true || phoneChanged === true;
    const recente = timeDeactivated === "Hoje / menos de 24 horas" || timeDeactivated === "Menos de 30 dias";
    const pattern = val === "nao_interagiu" && credentialTaken;
    metaPatternRef.current = pattern;
    if (pattern) {
      setForcedProb("muito_alta");
      addJourney("⚠️ Alerta", recente
        ? "Possível padrão recente de invasão via suporte da Meta (acesso perdido sem interação do usuário, credencial trocada, caso recente) — avaliar tese de falha sistêmica da plataforma."
        : "Possível invasão sem interação do usuário com credencial trocada por terceiro — avaliar tese de falha no mecanismo de suporte/recuperação da Meta.");
    }
    computeAndClassify(officialOptsRef.current);
  };

  // ─── Handlers principais ───
  const onPlatform = (key) => {
    setPlatform(key);
    addUser(PLATFORMS[key].label); addJourney("Plataforma", PLATFORMS[key].label);
    if (key === "other") {
      botDelay("Entendido. Em qual aplicativo?", 700, () => setShowUI("sub_app"));
    } else if (key === "instagram") {
      botDelay(`Entendido — sua conta no **${PLATFORMS[key].label}** foi afetada.`, 900,
        () => askLayer()
      );
    } else {
      botDelay(`Entendido — sua conta no **${PLATFORMS[key].label}** foi afetada.`, 900,
        () => botDelay("O que exatamente aconteceu?", 1000, () => setShowUI("issue"))
      );
    }
  };

  // ─── Etapa 3 — camada Meta afetada + validade de sessão (só Instagram/Facebook) ───
  const askLayer = () => {
    botDelay("Antes de continuar, uma pergunta rápida: o problema atingiu o quê?", 900, () => setShowUI("ig_layer"));
  };

  const onLayer = (val) => {
    setLayer(val); addUser(val); addJourney("Camada afetada", val);
    const shared = val === "Os dois juntos (mesmo login)" || val.includes("Threads");
    if (shared) addJourney("⚠️ Alerta — conta Meta", "Login compartilhado da Meta afetado (múltiplos apps ligados) — vários ativos atingidos de uma vez, maior gravidade e urgência.");
    botDelay("E você ainda consegue acessar algum desses apps?", 900, () => setShowUI("ig_session"));
  };

  const onSession = (val) => {
    setSessionAccess(val); addUser(val); addJourney("Ainda tem acesso", val);
    botDelay("O que exatamente aconteceu?", 1000, () => setShowUI("issue"));
  };

  const onSubApp = (app) => {
    setSubApp(app); addUser(app); addJourney("Aplicativo", app);
    botDelay(`Entendido — sua conta no **${app}** foi afetada.`, 900,
      () => botDelay("O que exatamente aconteceu?", 1000, () => setShowUI("issue"))
    );
  };

  // ─── Guias por app específico ───
  const getSubAppGuide = (app, issueType) => {
    const guides = {
      "TikTok": {
        hacked: "guide_tiktok_hacked",
        suspended: "guide_tiktok_ban",
        default: "guide_tiktok_ban",
      },
      "Uber": { suspended: "guide_uber", default: "guide_uber" },
      "99":   { suspended: "guide_99",   default: "guide_99"   },
      "Mercado Livre": { suspended: "guide_ml", default: "guide_ml" },
      "X (Twitter)":   { suspended: "guide_x",  default: "guide_x"  },
    };
    const g = guides[app];
    if (!g) return null;
    return g[issueType] || g.default || null;
  };

  const onIssue = (key, skipJourney = false) => {
    const labels = {
      hacked:     "Alguém invadiu minha conta sem minha autorização",
      password:   "Esqueci minha senha",
      twofa:      "Perdi acesso ao autenticador / 2 fatores",
      suspended:  "Minha conta foi suspensa ou desativada",
      restricted: "Minha conta sofreu restrições de funcionalidades",
    };
    if (!skipJourney) {
      addUser(labels[key]); addJourney("Problema relatado", labels[key]);
    }
    if (!nameRef.current) {
      setPendingIssue(key);
      botDelay("Antes de continuar, como posso te chamar?", 800, () => setShowUI("name-early-input"));
      return;
    }

    // Sub-app specific routing (only for suspended/hacked, NOT for twofa/password)
    if (platform === "other" && subApp && key !== "twofa" && key !== "password") {
      const guideKey = getSubAppGuide(subApp, key);
      if (guideKey) {
        botDelay(`Entendido. Vou te mostrar as informações sobre o caso no **${subApp}**.`, 1000,
          () => setShowUI(guideKey)
        );
        return;
      }
    }

    if (key === "hacked") {
      if (platform === "instagram") {
        botDelay("Lamento muito que você esteja passando por isso. 💙", 900,
          () => botDelay("Vou te fazer algumas perguntas para entender exatamente o que aconteceu e encontrar o melhor caminho.", 1200,
            () => botDelay("**Você ainda consegue entrar na sua conta?**", 1000, () => setShowUI("ig_access"))
          )
        );
      } else if (platform === "whatsapp") {
        botDelay("Que situação difícil. Vamos tentar resolver isso. 💙", 900,
          () => botDelay("Para te dar o caminho certo, preciso entender melhor:", 900, () => setShowUI("wa_issue_type"))
        );
      } else if (platform === "email") {
        botDelay("Entendido. Veja o que fazer para tentar recuperar:", 900, () => setShowUI("guide_email"));
      } else {
        botDelay("Entendido. Veja os passos gerais para tentar recuperar:", 900, () => setShowUI("guide_other"));
      }
    } else if (key === "suspended") {
      if (platform === "instagram") {
        botDelay("Suspensão ou desativação indevida **pode ter respaldo jurídico** — especialmente se causou prejuízo real.", 900,
          () => botDelay("Vou fazer algumas perguntas para entender melhor seu caso.", 1100,
            () => botDelay("**Qual mensagem aparece** quando você tenta acessar a conta?", 1000, () => setShowUI("ig_message"))
          )
        );
      } else if (platform === "whatsapp") {
        botDelay("Banimento ou suspensão indevida do WhatsApp **pode ter forte respaldo jurídico** no Brasil.", 900,
          () => botDelay("Vou entender melhor o seu caso.", 900, () => setShowUI("wa_ban_type"))
        );
      } else if (platform === "email") {
        botDelay("Bloqueio de e-mail pode ter respaldo jurídico se causou danos reais.", 800,
          () => botDelay("**O que aconteceu exatamente?**", 800, () => setShowUI("email_block_reason"))
        );
      } else {
        botDelay("Suspensão ou desativação indevida pode ter respaldo jurídico se causou danos reais.", 900,
          () => botDelay("Veja como tentar reverter diretamente:", 1000, () => setShowUI("guide_suspended"))
        );
      }
    } else if (key === "password") {
      if (platform === "email") {
        botDelay("Esse tipo de problema tem solução pela própria plataforma.", 800,
          () => botDelay("Qual é o seu provedor de e-mail?", 900, () => setShowUI("email_provider"))
        );
      } else {
        botDelay("Esse tipo de problema costuma ter solução pela própria plataforma.", 900,
          () => botDelay("Preparei um guia prático:", 900, () => setShowUI("guide_password"))
        );
      }
    } else if (key === "twofa") {
      botDelay("Entendido. Vou te fazer algumas perguntas para encontrar o caminho certo de recuperação.", 1000,
        () => botDelay("**Você ainda lembra a senha da conta?**", 900, () => setShowUI("twofa_password"))
      );
    } else if (key === "restricted") {
      botDelay("Esse é um caso muito relevante juridicamente — e cada vez mais frequente. 📋", 900,
        () => botDelay("**Restrições de funcionalidades** são diferentes de suspensão: a conta continua ativa, mas a plataforma limita ou remove recursos sem necessariamente explicar o motivo.", 1200,
          () => botDelay("**Quais restrições você identificou na sua conta?** Selecione todas que se aplicam.", 1000, () => setShowUI("ig_restriction_type"))
        )
      );
    }
  };

  // ─── Fluxo Restrições IG: tipo de restrição ───
  const [restrictionTypes, setRestrictionTypes] = useState([]);
  const [restrictionReason, setRestrictionReason] = useState(null);
  const [hasProofDocs, setHasProofDocs] = useState(null);

  const onRestrictionType = (types) => {
    setRestrictionTypes(types);
    const label = types.join(", ");
    addUser(label); addJourney("Restrições identificadas", label);
    botDelay("Entendido. E **a plataforma informou algum motivo** para essas restrições?", 1000, () => setShowUI("ig_restriction_reason"));
  };

  const onRestrictionReason = (reason) => {
    setRestrictionReason(reason); addUser(reason); addJourney("Motivo alegado pela plataforma", reason);
    if (reason === "Suspeita de produtos falsificados / violação de propriedade intelectual") {
      botDelay("Esse é um dos casos mais injustos — e com **forte precedente jurídico**. O TJSP já determinou a remoção de restrições e indenização em casos onde a plataforma aplicou sanção sem apresentar prova concreta da infração.", 1300,
        () => botDelay("Para se defender de uma acusação de produto falso ou violação de marca, o caminho jurídico é simples: **provar que você vende produtos originais ou tem autorização para usar a marca**.", 1200,
          () => botDelay("Esses documentos servem como prova — **notas fiscais de compra, autorizações do fabricante ou certificados de marca** já foram suficientes para obter liminares nos tribunais brasileiros.", 1200,
            () => botDelay("**Você tem algum desses documentos?**", 800, () => setShowUI("ig_restriction_proof"))
          )
        )
      );
    } else if (reason === "Acusação de nudez, exploração sexual ou sexualização infantil") {
      botDelay("Esse é um dos casos mais graves e traumatizantes — e infelizmente muito mais comum do que parece.", 1100,
        () => botDelay("O sistema de moderação automática da Meta comete **falsos positivos com frequência**: fotos de infância, imagens de amamentação, biquínis, nudez artística e até conteúdo profissional são erroneamente sinalizados.", 1300,
          () => botDelay("Além do prejuízo à conta, a própria **acusação falsa de sexualização infantil atinge diretamente a honra** da pessoa — o que os tribunais têm reconhecido como dano moral autônomo.", 1200,
            () => botDelay("**Que tipo de conteúdo estava na conta quando a restrição foi aplicada?**", 1000, () => setShowUI("ig_csam_content"))
          )
        )
      );
    } else if (reason === "Nenhum — sem explicação") {
      botDelay("A ausência de motivação é em si um argumento jurídico. O Marco Civil da Internet e o CDC exigem que plataformas sejam transparentes ao aplicar sanções.", 1200,
        () => botDelay("**Essa conta gera renda ou é utilizada profissionalmente?**", 1000, () => setShowUI("ig_restriction_economic"))
      );
    } else {
      botDelay("Entendido. **Essa conta gera renda ou é utilizada profissionalmente?**", 1000, () => setShowUI("ig_restriction_economic"));
    }
  };

  const onRestrictionProof = (has) => {
    setHasProofDocs(has);
    addUser(has === true ? "Sim, tenho documentos" : has === false ? "Não tenho documentos no momento" : "Tenho alguns, mas incompletos");
    addJourney("Possui documentos comprobatórios", has === true ? "Sim" : has === false ? "Não" : "Parcial");
    if (has === true) {
      botDelay("Ótimo — esses documentos são fundamentais. Em casos de restrição por suposta violação de propriedade intelectual, **notas fiscais e autorizações do fabricante já foram suficientes para obter liminares** nos tribunais brasileiros.", 1300,
        () => botDelay("**Essa conta gera renda ou é utilizada profissionalmente?**", 1000, () => setShowUI("ig_restriction_economic"))
      );
    } else if (has === false) {
      botDelay("Não se preocupe — reúna o que for possível: notas de compra, e-mails de fornecedores, qualquer documento que comprove a origem legítima. Eles serão essenciais.", 1200,
        () => botDelay("**Essa conta gera renda ou é utilizada profissionalmente?**", 1000, () => setShowUI("ig_restriction_economic"))
      );
    } else {
      botDelay("Qualquer documentação parcial já ajuda. Junte o que tiver e vamos trabalhar com isso.", 1000,
        () => botDelay("**Essa conta gera renda ou é utilizada profissionalmente?**", 1000, () => setShowUI("ig_restriction_economic"))
      );
    }
  };

  // ─── Fluxo Instagram: P1 — ainda tem acesso? ───
  const onIgAccess = (has) => {
    addUser(has ? "Sim, ainda consigo entrar" : "Não, fui bloqueado / não consigo mais entrar"); addJourney("Ainda tem acesso à conta", has ? "Sim" : "Não");
    if (has) {
      botDelay("Ótimo — como você ainda tem acesso, há ações urgentes para expulsar o invasor e proteger sua conta.", 900,
        () => setShowUI("guide_ig_access")
      );
    } else {
      botDelay("Entendido. Para identificar a melhor estratégia, preciso entender o que aconteceu.", 900,
        () => botDelay("**Qual mensagem aparece** quando você tenta acessar a conta?", 1000, () => setShowUI("ig_message"))
      );
    }
  };

  // ─── Fluxo Instagram: P2 — qual mensagem aparece? ───
  const onIgMessage = (type) => {
    setMsgType(type);
    const labels = {
      desativada:    "Conta desativada",
      suspensa:      "Conta suspensa",
      atividade:     "Atividade suspeita detectada",
      verificacao:   "Verificação de identidade solicitada",
      twofa_hacker:  "Pedindo código de autenticação (2 fatores)",
      nenhuma:       "Não aparece mensagem / não lembro",
    };
    addUser(labels[type]); addJourney("Mensagem exibida ao tentar acessar", labels[type]);

    if (type === "desativada" || type === "suspensa") {
      botDelay("Entendido. Precisamos entender se a plataforma te informou o motivo.", 900,
        () => botDelay("**Você recebeu algum e-mail** do Instagram ou Facebook explicando o motivo da suspensão ou desativação?", 1100, () => setShowUI("ig_email_notif"))
      );
    } else if (type === "atividade" || type === "verificacao") {
      // Pode ser hacker alterando credenciais
      botDelay("Esse tipo de mensagem pode indicar uma **tentativa de invasão** à sua conta.", 1000,
        () => botDelay("Vou verificar se suas credenciais foram comprometidas.", 900,
          () => botDelay("**O hacker alterou o e-mail** cadastrado na sua conta?", 1000, () => setShowUI("ig_email"))
        )
      );
    } else if (type === "twofa_hacker") {
      botDelay("Esse é o cenário mais frequente em invasões — o hacker entra na conta e **ativa o 2 fatores pelo lado dele**, impedindo que você entre mesmo com sua própria senha.", 1300,
        () => botDelay("A boa notícia: o Instagram tem um processo específico para isso, que permite recuperar a conta **sem precisar do código** — por verificação de identidade.", 1200,
          () => botDelay("**O hacker também alterou o e-mail** cadastrado na sua conta?", 1000, () => setShowUI("ig_email"))
        )
      );
    } else {
      // sem mensagem — contexto de bloqueio/suspensão sem informação clara
      botDelay("Tudo bem, isso é comum — nem sempre a plataforma exibe uma mensagem clara.", 900,
        () => botDelay("Nesse caso, o primeiro passo é **tentar acessar sua conta** pelo app ou pelo site e verificar o que aparece na tela.", 1100,
          () => botDelay("Enquanto isso, verifique sua **caixa de entrada e spam** por e-mails do Instagram ou Facebook — às vezes a notificação chega por e-mail sem aparecer no app.", 1200,
            () => botDelay("Caso não consiga acessar e não identifique o motivo, isso pode indicar uma **restrição silenciosa**, suspensão ou desativação indevida. Nosso escritório pode analisar seu caso e acionar os canais corretos junto à plataforma. Deseja falar com um especialista?", 1300, () => setShowUI("cta_specialist"))
          )
        )
      );
    }
  };

  // ─── Fluxo desativação: P3 — recebeu e-mail? ───
  const onEmailNotif = (received) => {
    setEmailNotif(received);
    addUser(received === true ? "Sim, recebi e-mail do Instagram" : received === false ? "Não, não recebi nenhum e-mail" : "Não sei / não verifiquei"); addJourney("Recebeu e-mail da plataforma", received === true ? "Sim" : received === false ? "Não" : "Não sabe");
    if (received === true) {
      botDelay("O que o e-mail menciona como motivo?", 800, () => setShowUI("ig_email_reason"));
    } else {
      // Sem e-mail = desativação sem fundamento claro
      botDelay("A ausência de notificação é um ponto jurídico relevante — plataformas têm obrigação de informar o motivo da suspensão ou desativação.", 1000,
        () => botDelay("Uma dica: no app do Instagram, acesse **Configurações → Conta → Status da conta** — às vezes o motivo aparece lá mesmo sem chegar por e-mail.", 1200,
          () => botDelay("Antes de seguir, preciso descartar uma possibilidade: **algumas contas são suspensas logo após serem invadidas** — quando isso acontece, o caminho a seguir é completamente diferente.", 1300,
            () => botDelay("**Antes da conta ser suspensa ou desativada**, você percebeu algum sinal de invasão — como senha alterada, e-mail trocado, publicações que você não fez?", 1200, () => setShowUI("ig_invasion"))
          )
        )
      );
    }
  };

  const onEmailReason = (reason) => {
    setEmailReason(reason); addUser(reason); addJourney("Motivo alegado no e-mail", reason);
    const vagueReasons = ["Não ficou claro / explicação genérica", "Comportamento suspeito"];
    if (reason === "Acusação de nudez, exploração sexual ou sexualização infantil") {
      botDelay("Esse é um dos casos mais graves — e a acusação em si já constitui dano moral, independentemente de qualquer prova. 💙", 1100,
        () => botDelay("O algoritmo da Meta comete **falsos positivos com frequência nessa categoria**: fotos de infância, amamentação, biquínis e conteúdo artístico são frequentemente sinalizados de forma errada.", 1300,
          () => botDelay("Temos **sentença favorável do TJSP** nesse exato cenário — a Meta foi condenada a restabelecer as contas em 48h, sob multa de R$ 1.000/dia, e a pagar indenização por danos morais.", 1200,
            () => botDelay("**Que tipo de conteúdo estava na conta quando a suspensão foi aplicada?**", 1000, () => setShowUI("ig_csam_content"))
          )
        )
      );
    } else if (reason === "Denúncias em massa") {
      botDelay("Banimento por denúncias em massa é um dos casos mais injustos — qualquer usuário pode denunciar uma conta sem fundamento, e a plataforma costuma agir automaticamente.", 1200,
        () => botDelay("**A boa notícia:** tribunais brasileiros têm reconhecido que a Meta não pode banir sem investigar adequadamente o conteúdo denunciado.", 1100,
          () => botDelay("**Antes da suspensão ou desativação**, você percebeu algum sinal de invasão — como senha alterada, e-mail trocado ou publicações que você não fez?", 1100, () => setShowUI("ig_invasion"))
        )
      );
    } else if (vagueReasons.includes(reason)) {
      botDelay("Importante: a Meta frequentemente alega genericamente 'violação das diretrizes' **sem apresentar prova específica** — o que tem sido acolhido pelos tribunais brasileiros para determinar a reativação.", 1200,
        () => botDelay("Antes de concluir, preciso verificar uma última coisa: **às vezes contas são suspensas logo após sofrer uma invasão** — quando isso acontece, muda completamente a estratégia de recuperação.", 1200,
          () => botDelay("**Antes da suspensão ou desativação**, você percebeu algum sinal — como senha alterada, e-mail trocado ou publicações que você não fez?", 1100, () => setShowUI("ig_invasion"))
        )
      );
    } else {
      botDelay("**Antes da suspensão ou desativação**, você percebeu algum sinal de invasão — como senha alterada, e-mail trocado ou publicações que você não fez?", 1100, () => setShowUI("ig_invasion"));
    }
  };

  // ─── P5 — sinais de invasão ───
  const onInvasion = (val) => {
    setInvasionSigns(val);
    addUser(val === true ? "Sim, percebi sinais de invasão" : val === false ? "Não, não percebi nada" : "Não sei / não tenho certeza"); addJourney("Sinais de invasão antes da suspensão ou desativação", val === true ? "Sim" : val === false ? "Não" : "Não sabe");
    if (val === true) {
      botDelay("Esse é um dos cenários com **maior potencial jurídico** — conta hackeada e depois suspensa ou desativada é frequentemente acolhida nas ações contra a Meta.", 1100,
        () => askEconomic()
      );
    } else {
      if (val === null) {
        botDelay("Tudo bem — vamos continuar sem essa informação. Se houver qualquer indício de invasão depois, é importante registrar.", 1000,
          () => askEconomic()
        );
      } else {
        askEconomic();
      }
    }
  };

  // ─── Fluxo de credenciais hackeadas (atividade suspeita / verificação) ───
  const emailChangedRef = useRef(null);
  const onIgEmail = (changed) => {
    emailChangedRef.current = changed;
    setEmailChanged(changed); addUser(changed === true ? "Sim, o hacker trocou o e-mail" : changed === false ? "Não, o e-mail ainda é o meu" : "Não sei / não consigo verificar"); addJourney("E-mail alterado pelo hacker", changed === true ? "Sim" : changed === false ? "Não" : "Desconhecido");
    if (changed === true) {
      // 1.1 — Antes de prosseguir, verificar se o e-mail de reversão foi recebido
      botDelay("Importante: quando o hacker troca o e-mail, o Instagram envia automaticamente uma mensagem para o **seu e-mail original** com um link de reversão.", 1200,
        () => botDelay("**Você recebeu algum e-mail de security@mail.instagram.com** avisando sobre essa alteração? (Verifique também spam e lixo eletrônico)", 1300,
          () => setShowUI("ig_security_email")
        )
      );
    } else {
      botDelay("E o **número de telefone** cadastrado na conta — o hacker alterou?", 1000, () => setShowUI("ig_phone"));
    }
  };

  const onSecurityEmail = (received) => {
    setSecurityEmailReceived(received);
    addUser(received === true ? "Sim, recebi o e-mail de segurança" : received === false ? "Não, não recebi nada" : "Não sei / não verifiquei");
    addJourney("E-mail de reversão recebido (security@)", received === true ? "Sim" : received === false ? "Não" : "Não verificado");
    if (received === true) {
      botDelay("✅ **Ótimo — esse é o caminho mais rápido.** O link nesse e-mail anula a troca e devolve o acesso imediatamente, sem precisar de mais nada.", 1300,
        () => botDelay("Clique em **«Reverter esta alteração»** no e-mail. Depois disso, troque sua senha e ative a verificação em dois fatores.", 1300,
          () => botDelay("Se o link já expirou ou você precisar de mais ajuda, me avise. Continuando — o hacker também alterou o **número de telefone**?", 1200,
            () => setShowUI("ig_phone")
          )
        )
      );
    } else {
      botDelay(received === false
        ? "Sem o e-mail de reversão, vamos usar o telefone ou verificação de identidade. Continuando —"
        : "Tudo bem — verifique agora mesmo antes de continuar, pode estar no spam. Se não encontrar,",
        900,
        () => botDelay("O hacker também alterou o **número de telefone** cadastrado?", 900, () => setShowUI("ig_phone"))
      );
    }
  };

  const onIgPhone = (changed) => {
    setPhoneChanged(changed); addUser(changed === true ? "Sim, o hacker trocou o número" : changed === false ? "Não, o telefone ainda é o meu" : "Não sei / não consigo verificar"); addJourney("Telefone alterado pelo hacker", changed === true ? "Sim" : changed === false ? "Não" : "Desconhecido");

    const eOk = emailChangedRef.current === false;
    const pOk = changed === false;

    if (eOk && pOk) {
      botDelay("Boa notícia — seus dados de contato ainda são os seus, a recuperação é mais direta.", 900,
        () => setShowUI("guide_ig_cred_ok")
      );
    } else if (!eOk && pOk) {
      botDelay("O e-mail foi alterado, mas você ainda tem o telefone. Veja como usar isso para recuperar:", 900,
        () => setShowUI("guide_ig_email_changed")
      );
    } else if (eOk && !pOk) {
      botDelay("O telefone foi alterado, mas você ainda tem o e-mail. Veja como proceder:", 900,
        () => setShowUI("guide_ig_phone_changed")
      );
    } else {
      botDelay("Quando os dois dados foram alterados, o Instagram usa **verificação de identidade**.", 1000,
        () => botDelay("Última pergunta para te dar o processo correto:", 900,
          () => botDelay("**Você tem fotos suas no perfil** — fotos em que o seu rosto aparece?", 1000, () => setShowUI("ig_photos"))
        )
      );
    }
  };

  const onIgPhotos = (has) => {
    setHasPhotos(has); addUser(has ? "Sim, tenho fotos minhas no perfil" : "Não, não tenho fotos minhas"); addJourney("Fotos no perfil", has ? "Sim" : "Não");
    if (has) {
      botDelay("O Instagram usa **verificação por selfie de vídeo** nesse caso.", 900,
        () => botDelay("Você virará o rosto em diferentes direções na câmera — é o jeito que a plataforma confirma que você é o dono da conta, sem precisar de senha ou código.", 1300,
          () => botDelay("O processo leva de **3 a 10 dias úteis** para ser analisado. Veja o passo a passo:", 1000,
            () => setShowUI("guide_ig_both_photos")
          )
        )
      );
    } else {
      botDelay("Como o perfil não tem fotos suas, o Instagram usará um **formulário de identidade** — você descreve detalhes da conta para provar que é o titular.", 1200,
        () => botDelay("O processo pode levar de **7 a 14 dias úteis**. Veja o passo a passo:", 1000,
          () => setShowUI("guide_ig_both_nophotos")
        )
      );
    }
  };

  // ─── Inputs de texto ───
  const onNameEarlySubmit = () => {
    if (!inputVal.trim()) return;
    const n = inputVal.trim(); nameRef.current = n; setName(n); addUser(n); addJourney("Nome", n); setInputVal("");
    botDelay(`Prazer, **${n.split(" ")[0]}**! O que exatamente aconteceu com sua conta?`, 900, () => setShowUI("issue"));
  };

  const onNameSubmit = () => {
    if (!inputVal.trim()) return;
    const n = inputVal.trim(); nameRef.current = n; setName(n); addUser(n); setInputVal("");
    botDelay(`Obrigado, **${n.split(" ")[0]}**! Me conte com mais detalhes:`, 800,
      () => botDelay("**O que aconteceu exatamente?** Quando percebeu o problema? Seu perfil enviou mensagens ou publicou algo sem ser você?", 1300, () => setShowUI("desc-input"))
    );
  };

  const onDescSubmit = () => {
    if (!inputVal.trim()) return;
    setDescription(inputVal.trim()); addUser(inputVal.trim()); setInputVal("");
    botDelay("**Quais danos você sofreu?** Pode marcar mais de um.", 900, () => setShowUI("damages"));
  };

  const finalizeDamages = () => {
    if (!damages.length) return;
    addUser(damages.map(d => DAMAGE_OPTIONS.find(o => o.key === d)?.label).join(", "));
    botDelay("✅ **Análise concluída!** Com base em tudo que você compartilhou, seu caso tem potencial para intervenção jurídica.", 900,
      () => botDelay("Um advogado especializado vai analisar sua situação e indicar os próximos passos — sem compromisso.", 1300,
        () => setShowUI("whatsapp")
      )
    );
  };

  const col = { display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" };

  return (
    <ChatShell>

          {messages.map(m => m.role === "bot" ? <BotBubble key={m.id} text={m.text} /> : <UserBubble key={m.id} text={m.text} />)}

          {isTyping && <TypingRow />}

          {/* ══ UI Panels ══ */}

          {!isTyping && showUI === "platform" && (
            <div style={col}>
              {Object.entries(PLATFORMS).map(([k, p]) => <OptBtn key={k} onClick={() => onPlatform(k)} icon={p.icon} logo={p.logo} logos={p.logos} label={p.label} />)}
            </div>
          )}

          {!isTyping && showUI === "ig_layer" && (
            <div style={col}>
              <OptBtn onClick={() => onLayer("Só o Instagram")}                       logo="ig" label="Só o Instagram" />
              <OptBtn onClick={() => onLayer("Só o Facebook")}                        logo="fb" label="Só o Facebook" />
              <OptBtn onClick={() => onLayer("Os dois juntos (mesmo login)")}         icon="🔗" label="Os dois juntos (mesmo login)" sub="Instagram e Facebook na mesma conta Meta" />
              <OptBtn onClick={() => onLayer("Também o Threads / outras contas ligadas")} logo="threads" label="Também o Threads / outras contas ligadas" />
              <OptBtn onClick={() => onLayer("Não sei dizer")}                        icon="❓" label="Não sei dizer" />
            </div>
          )}
          {!isTyping && showUI === "ig_session" && (
            <div style={col}>
              <OptBtn onClick={() => onSession("Sim, ainda entro em pelo menos um")}  icon="✅" label="Sim, ainda entro em pelo menos um" />
              <OptBtn onClick={() => onSession("Não, perdi o acesso a tudo")}         icon="⛔" label="Não, perdi o acesso a tudo" />
              <OptBtn onClick={() => onSession("Só abro o suporte, mas não a conta")} icon="🛟" label="Só abro o suporte, mas não a conta" />
            </div>
          )}

          {!isTyping && showUI === "issue" && (
            <div style={col}>
              <OptBtn onClick={() => onIssue("hacked")}      icon="🔓" label="Alguém invadiu minha conta sem minha autorização" sub="Perdi acesso parcial ou total à conta" />
              <OptBtn onClick={() => onIssue("suspended")}   icon="🚫" label="Minha conta foi suspensa ou desativada"            sub="Perdi acesso parcial ou total à conta" />
              <OptBtn onClick={() => onIssue("restricted")}  icon="⚠️" label="Minha conta sofreu restrições de funcionalidades"  sub="Lives, alcance, stories, anúncios, recomendações" />
              <OptBtn onClick={() => onIssue("password")}    icon="🔑" label="Esqueci minha senha e não consigo acessar"         sub="Problema técnico" />
              <OptBtn onClick={() => onIssue("twofa")}       icon="📲" label="Perdi acesso ao autenticador / 2 fatores"          sub="Problema técnico" />
            </div>
          )}

          {/* P1: ainda tem acesso? */}
          {!isTyping && showUI === "ig_access" && (
            <div style={col}>
              <OptBtn onClick={() => onIgAccess(true)}  icon="✅" label="Sim, ainda consigo entrar na conta" />
              <OptBtn onClick={() => onIgAccess(false)} icon="❌" label="Não, fui bloqueado / não consigo mais entrar" />
            </div>
          )}

          {/* Guia: ainda tem acesso */}
          {!isTyping && showUI === "guide_ig_access" && (
            <div ref={guideRef} style={col}>
              <GuideSteps {...GUIDES.ig_has_access} />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Mesmo tendo recuperado o acesso:</strong> se o invasor aplicou golpes, expôs dados ou causou danos — há respaldo jurídico.
              </div>
              <GhostBtn onClick={() => { addUser("Consegui proteger minha conta"); botDelay("Ótimo! 🎉 Agora veja os passos finais para blindar sua conta contra novas invasões.", 900, () => setShowUI("guide_ig_hardening")); }} label="✅ Consegui proteger — e agora?" />
              <GhostBtn onClick={() => { addUser("Houve danos — quero falar com um advogado"); addJourney("Tipo do caso", "Invasão com danos — conta recuperada"); setForcedProb("muito_alta"); botDelay("Entendido. Preciso de mais algumas informações para o especialista chegar preparado.", 900, () => askEconomic()); }} label="⚖️ Houve danos — quero falar com um advogado →" />
            </div>
          )}

          {/* P2: qual mensagem? */}
          {!isTyping && showUI === "ig_message" && (
            <div style={col}>
              <OptBtn onClick={() => onIgMessage("desativada")}    icon="⛔" label="Conta desativada" sub="Mensagem de que a conta foi desativada por violar diretrizes" />
              <OptBtn onClick={() => onIgMessage("suspensa")}      icon="🔒" label="Conta suspensa"   sub="Mensagem de suspensão — acesso restrito ou temporariamente bloqueado" />
              <OptBtn onClick={() => onIgMessage("twofa_hacker")}  icon="🔐" label="Pedindo código de autenticação (2 fatores)" sub="O app pede um código de 6 dígitos que você não tem acesso" />
              <OptBtn onClick={() => onIgMessage("atividade")}     icon="⚠️" label="Atividade suspeita detectada" sub="Alerta de segurança ou login incomum" />
              <OptBtn onClick={() => onIgMessage("verificacao")}   icon="🪪" label="Verificação de identidade" sub="Pedindo selfie, documento ou código" />
              <OptBtn onClick={() => onIgMessage("nenhuma")}       icon="❓" label="Não aparece mensagem / não lembro" />
            </div>
          )}

          {/* P3: recebeu e-mail? */}
          {!isTyping && showUI === "ig_email_notif" && (
            <div style={col}>
              <OptBtn onClick={() => onEmailNotif(true)}  icon="✅" label="Sim, recebi e-mail do Instagram / Facebook" />
              <OptBtn onClick={() => onEmailNotif(false)} icon="❌" label="Não, não recebi nenhum e-mail" />
              <OptBtn onClick={() => onEmailNotif(null)}  icon="❓" label="Não sei / não verifiquei" />
            </div>
          )}

          {/* ── FLUXO RESTRIÇÕES ── */}

          {/* R1: quais restrições */}
          {!isTyping && showUI === "ig_restriction_type" && (() => {
            const opts = [
              { key: "Live bloqueada", icon: "🎙️", label: "Live bloqueada", sub: "Não consigo transmitir ao vivo" },
              { key: "Alcance limitado / shadowban", icon: "📉", label: "Alcance limitado / shadowban", sub: "Posts aparecem para muito menos pessoas que o normal — queda brusca de visualizações" },
              { key: "Stories removidos ou com alcance reduzido", icon: "📱", label: "Stories removidos ou com alcance reduzido" },
              { key: "Conta não recomendada (Explorar, Reels, Sugeridos)", icon: "🔍", label: "Conta não recomendada", sub: "Parou de aparecer para novos públicos — Explorar, Pesquisar, Sugeridos ou Reels" },
              { key: "Anúncios / Business Manager bloqueados", icon: "📢", label: "Anúncios / Business Manager bloqueados", sub: "Não consigo criar anúncios, minha conta de anúncios foi desabilitada" },
              { key: "Restrição de curtir, seguir ou comentar", icon: "🚫", label: "Restrição de curtir, seguir ou comentar", sub: "Suspensão parcial de ações" },
              { key: "Conteúdo removido sem aviso", icon: "🗑️", label: "Conteúdo removido sem aviso", sub: "Posts, Reels ou Stories sumiram sem qualquer notificação ou explicação" },
            ];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {opts.map(o => (
                  <OptBtn key={o.key}
                    onClick={() => setRestrictionTypes(p => p.includes(o.key) ? p.filter(x => x !== o.key) : [...p, o.key])}
                    icon={restrictionTypes.includes(o.key) ? "✅" : o.icon}
                    label={o.label}
                    sub={o.sub}
                    selected={restrictionTypes.includes(o.key)}
                  />
                ))}
                <button
                  onClick={() => restrictionTypes.length > 0 && onRestrictionType(restrictionTypes)}
                  disabled={restrictionTypes.length === 0}
                  style={{ padding: "12px", background: restrictionTypes.length ? "linear-gradient(135deg, #15253f, #1d3357)" : "#d0cfc8", border: "none", borderRadius: "11px", cursor: restrictionTypes.length ? "pointer" : "not-allowed", fontSize: "13px", color: restrictionTypes.length ? "#f3e0a8" : "#888", fontFamily: "inherit", fontWeight: "700" }}>
                  Continuar →
                </button>
              </div>
            );
          })()}

          {/* R2: motivo alegado */}
          {!isTyping && showUI === "ig_restriction_reason" && (
            <div style={col}>
              <OptBtn onClick={() => onRestrictionReason("Acusação de nudez, exploração sexual ou sexualização infantil")} icon="🚨" label="Acusação de nudez, exploração sexual ou sexualização infantil" sub="Falso positivo do algoritmo — caso com forte amparo jurídico" />
              <OptBtn onClick={() => onRestrictionReason("Suspeita de produtos falsificados / violação de propriedade intelectual")} icon="⚖️" label="Suspeita de produtos falsificados ou violação de propriedade intelectual" />
              <OptBtn onClick={() => onRestrictionReason("Violação das diretrizes da comunidade")}     icon="📋" label="Violação das diretrizes da comunidade" />
              <OptBtn onClick={() => onRestrictionReason("Spam ou comportamento automatizado")}        icon="🤖" label="Spam ou comportamento automatizado" />
              <OptBtn onClick={() => onRestrictionReason("Denúncias de outros usuários")}              icon="🚩" label="Denúncias de outros usuários" />
              <OptBtn onClick={() => onRestrictionReason("Direitos autorais (música, vídeo, imagem)")} icon="🎵" label="Direitos autorais (música, vídeo ou imagem)" />
              <OptBtn onClick={() => onRestrictionReason("Nenhum — sem explicação")}                   icon="❓" label="Nenhum — sem explicação clara" />
            </div>
          )}

          {/* R3: tem documentos? (somente para PI) */}
          {!isTyping && showUI === "ig_restriction_proof" && (
            <div style={col}>
              <OptBtn onClick={() => onRestrictionProof(true)}  icon="✅" label="Sim, tenho notas fiscais, autorizações ou outros documentos" />
              <OptBtn onClick={() => onRestrictionProof(null)}  icon="📄" label="Tenho alguns documentos, mas podem estar incompletos" />
              <OptBtn onClick={() => onRestrictionProof(false)} icon="❌" label="Não tenho documentos no momento" />
            </div>
          )}

          {/* R4: conta gera renda? */}
          {!isTyping && showUI === "ig_restriction_economic" && (
            <div style={col}>
              <OptBtn onClick={() => {
                setEconomic(true); addUser("Sim, gera renda ou é usada profissionalmente"); addJourney("Conta com fins econômicos", "Sim");
                botDelay("**Importante:** o TJSP já reconheceu que **mesmo contas profissionais são protegidas pelo CDC** — a plataforma é fornecedora de serviço e o usuário é consumidor, independentemente de monetização.", 1300,
                  () => botDelay("Para contas com impacto econômico comprovável, a **tutela de urgência** pode ser mais rápida que aguardar resposta da Meta — tribunais brasileiros têm determinado remoção de restrições em 48 a 72 horas.", 1300,
                    () => setShowUI("ig_restriction_guide")
                  )
                );
              }} icon="💰" label="Sim, gera renda ou é usada profissionalmente" sub="Vendas, influência, publicidade, marca" />
              <OptBtn onClick={() => {
                setEconomic(false); addUser("Não, é conta pessoal"); addJourney("Conta com fins econômicos", "Não");
                botDelay("Mesmo para contas pessoais há respaldo jurídico — restrições sem motivação concreta violam o Marco Civil da Internet.", 1100,
                  () => setShowUI("ig_restriction_guide")
                );
              }} icon="👤" label="Não, é uma conta pessoal" />
            </div>
          )}

          {/* R5: guia de restrições */}
          {!isTyping && showUI === "ig_restriction_guide" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
                <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}>O que fazer agora — Restrições no Instagram / Facebook</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {[
                    "Acesse **Configurações → Conta → Status da conta** — lá aparecem as restrições ativas, conteúdos removidos e um botão para solicitar revisão de cada item",
                    "**Documente tudo antes de qualquer ação**: prints do Status da conta, prints das restrições, métricas de alcance antes e depois (disponíveis no Instagram Insights), prints de qualquer notificação recebida",
                    "Solicite revisão diretamente no app — se a plataforma não responder ou negar sem justificativa concreta, isso já é prova para ação judicial",
                    "Se a restrição envolve alegação de produto falso ou violação de propriedade intelectual: **reúna notas fiscais, autorizações de fabricante ou certificados de marca** — esses documentos são suficientes para comprovar a legitimidade em juízo",
                    "Envie notificação extrajudicial formal à Meta pedindo revisão motivada da sanção — guarde o protocolo",
                    "**Não exclua os conteúdos sinalizados** antes de consultar um advogado — a exclusão pode enfraquecer sua posição",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#15253f", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                      <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.55" }} dangerouslySetInnerHTML={{ __html: fmt(step) }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fff9e6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>
                  ⚖️ <strong>Precedente do TJSP:</strong> a justiça determinou remoção de restrições e indenização em caso onde a plataforma aplicou sanção sem apresentar prova concreta da violação — alegando apenas genericamente "descumprimento das diretrizes". O CDC foi aplicado ao caso.
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fef0f0", border: "1px solid #f0b0b0", borderRadius: "8px", fontSize: "12px", color: "#7a1010", lineHeight: "1.5" }}>
                  ⚠️ <strong>Atenção:</strong> em casos graves (queda de faturamento, contratos cancelados, perda de relevância de mercado), é possível requerer <strong>tutela de urgência (liminar)</strong> para remoção imediata das restrições.
                </div>
              </div>
              <GhostBtn onClick={() => { addUser("Consegui resolver as restrições"); addJourney("Resultado", "Resolveu as restrições"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se as restrições voltarem ou surgirem novas, pode contar conosco.", 1000, () => setShowUI(null)); }} label="✅ Consegui resolver as restrições" />
              <GhostBtn onClick={() => { addUser("Quero falar com um especialista sobre as restrições"); addJourney("Tipo do caso", "Restrições em conta Instagram/Facebook"); setForcedProb("alta"); botDelay("Perfeito. Antes de te conectar com nosso especialista, preciso de mais algumas informações para ele já chegar preparado.", 1100, () => askTime()); }} label="⚖️ Quero falar com um especialista →" />
            </div>
          )}

          {/* P4: motivo no e-mail */}
          {!isTyping && showUI === "ig_email_reason" && (
            <div style={col}>
              <OptBtn onClick={() => onEmailReason("Violação das diretrizes da comunidade")} icon="📋" label="Violação das diretrizes da comunidade" />
              <OptBtn onClick={() => onEmailReason("Acusação de nudez, exploração sexual ou sexualização infantil")} icon="🚨" label="Acusação de nudez, exploração sexual ou sexualização infantil" sub="Falso positivo do algoritmo — caso com forte amparo jurídico" />
              <OptBtn onClick={() => onEmailReason("Spam ou comportamento automatizado")}   icon="🤖" label="Spam ou comportamento automatizado (bot)" />
              <OptBtn onClick={() => onEmailReason("Conta falsa ou impersonação")}          icon="🎭" label="Conta falsa ou impersonação" />
              <OptBtn onClick={() => onEmailReason("Denúncias em massa")}                   icon="🚩" label="Denúncias em massa" sub="Conta suspensa ou desativada por denúncias de outros usuários" />
              <OptBtn onClick={() => onEmailReason("Não ficou claro / explicação genérica")} icon="🤷" label="Não ficou claro / explicação genérica" />
              <OptBtn onClick={() => onEmailReason("Associação com conta banida anteriormente")} icon="🔗" label="Associação com conta banida anteriormente" />
            </div>
          )}

          {/* P5: sinais de invasão */}
          {!isTyping && showUI === "ig_invasion" && (
            <div style={col}>
              <OptBtn onClick={() => onInvasion(true)}  icon="⚠️" label="Sim, percebi sinais de invasão" sub="Senha alterada, e-mail trocado, posts ou mensagens não autorizadas" />
              <OptBtn onClick={() => onInvasion(false)} icon="✅" label="Não, não percebi nada incomum" />
              <OptBtn onClick={() => onInvasion(null)}  icon="❓" label="Não sei / não tenho certeza" />
            </div>
          )}

          {/* ── FLUXO CSAM FALSO POSITIVO ── */}

          {/* CSAM-1: tipo de conteúdo sinalizado */}
          {!isTyping && showUI === "ig_csam_content" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Fotos de infância ou família"); addJourney("Conteúdo sinalizado", "Fotos de infância ou família"); botDelay("Esse é um dos falsos positivos mais documentados — fotos inocentes de crianças sendo identificadas erroneamente pelo algoritmo.", 1100, () => setShowUI("ig_csam_guide")); }} icon="👶" label="Fotos de infância ou da família" sub="Fotos pessoais sem qualquer conotação sexual" />
              <OptBtn onClick={() => { addUser("Conteúdo artístico, moda ou esportes"); addJourney("Conteúdo sinalizado", "Artístico, moda ou esportes"); botDelay("Conteúdo artístico e de moda é frequentemente mal interpretado pelo sistema automático da plataforma.", 1100, () => setShowUI("ig_csam_guide")); }} icon="🎨" label="Conteúdo artístico, moda, dança ou esportes" />
              <OptBtn onClick={() => { addUser("Imagens de amamentação, gestação ou saúde"); addJourney("Conteúdo sinalizado", "Amamentação/saúde"); botDelay("O Instagram teoricamente permite esse conteúdo — mas o algoritmo frequentemente falha no reconhecimento do contexto.", 1100, () => setShowUI("ig_csam_guide")); }} icon="🤱" label="Imagens de amamentação, gestação ou saúde" />
              <OptBtn onClick={() => { addUser("Não sei qual conteúdo foi sinalizado"); addJourney("Conteúdo sinalizado", "Desconhecido"); botDelay("Falta de transparência sobre o conteúdo sinalizado é em si um problema jurídico — a plataforma tem obrigação de indicar o que motivou a sanção.", 1100, () => setShowUI("ig_csam_guide")); }} icon="❓" label="Não sei qual conteúdo foi sinalizado" />
              <OptBtn onClick={() => { addUser("Outro tipo de conteúdo"); addJourney("Conteúdo sinalizado", "Outro"); botDelay("Entendido. Para que nosso especialista chegue preparado, descreva brevemente o conteúdo:", 800, () => setShowUI("csam_other_desc")); }} icon="📄" label="Outro tipo de conteúdo" />
            </div>
          )}

          {/* CSAM-2: guia específico */}
          {!isTyping && showUI === "ig_csam_guide" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
                <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}>O que fazer — Acusação indevida de nudez ou sexualização infantil</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {[
                    "**Documente tudo imediatamente**: prints da mensagem de suspensão ou restrição, incluindo o trecho exato com a alegação — esse é o ponto de partida da sua defesa",
                    "Verifique **Configurações → Conta → Status da conta** — às vezes aparece o conteúdo específico que foi sinalizado",
                    "**Não exclua o conteúdo** antes de consultar um advogado — a exclusão pode ser interpretada como reconhecimento de culpa e enfraquece sua posição",
                    "Solicite revisão dentro do app — se a Meta admitir o erro **por escrito** (e-mail ou notificação), guarde essa prova com cuidado: ela tem valor de confissão extrajudicial perante o tribunal",
                    "Reúna evidências da **inocência do conteúdo**: data original da foto, contexto, outras imagens do mesmo evento, histórico de publicações anteriores sem sanções",
                    "Se a conta for profissional, documente o **impacto financeiro**: queda de alcance, contratos perdidos, capturas de tela de métricas antes e depois",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#15253f", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                      <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.55" }} dangerouslySetInnerHTML={{ __html: fmt(step) }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fff9e6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.6" }}>
                  ⚖️ <strong>Precedente judicial (dez/2025):</strong> Em caso idêntico, o TJSP condenou o Instagram a reativar as contas em até 48 horas e a pagar <strong>R$ 10.000 de indenização por danos morais</strong> — porque a acusação era falsa e atingiu diretamente a honra das pessoas envolvidas. A plataforma chegou a admitir o próprio erro por escrito, mas mesmo assim manteve o bloqueio.
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fef0f0", border: "1px solid #f0b0b0", borderRadius: "8px", fontSize: "12px", color: "#7a1010", lineHeight: "1.5" }}>
                  ⚠️ <strong>Atenção:</strong> mesmo que a plataforma reverta a sanção após recurso, <strong>a acusação em si gera dano moral indenizável</strong> — especialmente quando envolve alegações tão graves quanto exploração sexual infantil.
                </div>
              </div>
              <GhostBtn onClick={() => { addUser("A plataforma reverteu a acusação / conta foi reativada"); addJourney("Resultado", "Conta reativada após recurso"); botDelay("Ainda assim, a **acusação indevida em si gera dano moral** — mesmo que a conta tenha sido reativada, você pode ter direito a indenização. Se quiser analisar isso, estamos disponíveis.", 1300, () => setShowUI(null)); }} label="✅ A plataforma reverteu — conta reativada" />
              <GhostBtn onClick={() => { addUser("Quero falar com um especialista sobre essa acusação"); addJourney("Tipo do caso", "Acusação indevida de nudez ou sexualização infantil"); setForcedProb("muito_alta"); botDelay("Perfeito. Antes de te conectar com nosso especialista, preciso de mais algumas informações para ele já chegar preparado.", 1100, () => askEconomic()); }} label="⚖️ Quero falar com um especialista →" />
            </div>
          )}

          {/* P6: gerava renda? */}
          {!isTyping && showUI === "ig_economic" && (
            <div style={col}>
              <OptBtn onClick={() => onEconomic(true)}  icon="💰" label="Sim, gerava renda ou era usada para trabalho" />
              <OptBtn onClick={() => onEconomic(false)} icon="👤" label="Não, era uma conta pessoal" />
            </div>
          )}

          {/* P6b: tipo de renda */}
          {!isTyping && showUI === "ig_economic_type" && (
            <div style={col}>
              <OptBtn onClick={() => onEconomicType("Vendas de produtos ou serviços")}       icon="🛍️" label="Vendas de produtos ou serviços" />
              <OptBtn onClick={() => onEconomicType("Influenciador / criador de conteúdo")}  icon="🎥" label="Influenciador / criador de conteúdo" />
              <OptBtn onClick={() => onEconomicType("Anúncios e publicidade paga")}          icon="📢" label="Anúncios e publicidade paga" />
              <OptBtn onClick={() => onEconomicType("Empresa ou marca profissional")}        icon="🏢" label="Empresa ou marca profissional" />
              <OptBtn onClick={() => onEconomicType("Outra atividade econômica")}            icon="📋" label="Outra atividade econômica" />
            </div>
          )}

          {/* 2.1 — Template de suporte formato incidente */}
          {!isTyping && showUI === "ig_support_template" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
                <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}>
                  Modelo de mensagem para suporte Meta
                </div>
                <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                  {[
                    "**Assunto:** Recuperação urgente de conta – [@seu_usuario] – acesso indevido por terceiro",
                    "",
                    "**Resumo:** Conta perdeu acesso em [data/hora]; e-mail e/ou 2FA foram alterados por terceiro não autorizado. Solicito reversão das alterações e restauração do acesso ao titular.",
                    "",
                    "**Identificadores:**",
                    "• Usuário/handle: @seu_usuario",
                    "• E-mail original: seu@email.com",
                    "• Telefone original: +55 11 9xxxx-xxxx",
                    "• Dispositivo usual / cidade: [ex.: iPhone 14, São Paulo/SP]",
                    "",
                    "**Linha do tempo:**",
                    "• [hh:mm] Recebi e-mail de alteração de e-mail / login suspeito",
                    "• [hh:mm] Perdi acesso / 2FA desconhecido ativado",
                    "",
                    "**Pedido específico:**",
                    "1. Reverter e-mail para [email original]",
                    "2. Remover 2FA inserido por terceiro",
                    "3. Restaurar acesso ao titular",
                    "4. Confirmar por escrito o número de protocolo / case ID",
                  ].map((line, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: fmt(line) || "&nbsp;" }} />
                  ))}
                </div>
              </div>
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Dica:</strong> Evite narrativas longas. Pedidos objetivos e específicos costumam ser resolvidos mais rápido do que relatos genéricos.
              </div>
              <GhostBtn onClick={() => {
                addUser("Entendi o template — quero registrar o caso com o escritório também");
                if (name) {
                  botDelay(`Perfeito, **${name.split(" ")[0]}**. Me conte mais sobre o que aconteceu:`, 800, () => setShowUI("desc-input"));
                } else {
                  botDelay("**Qual é o seu nome completo?**", 900, () => setShowUI("name-input"));
                }
              }} label="Entendi — registrar o caso com o escritório também →" />
            </div>
          )}

          {/* 1.2 — Business Manager / Anúncios */}
          {!isTyping && showUI === "ig_business_manager" && (
            <div style={col}>
              <OptBtn onClick={() => onBusinessManager(true)}  icon="📊" label="Sim, tem conta de anúncios ou Business Manager" sub="Facebook Ads, Meta Business Suite, Commerce ou Shop" />
              <OptBtn onClick={() => onBusinessManager(false)} icon="👤" label="Não, não tem" />
            </div>
          )}

          {/* 1.3 — Meta Verified */}
          {!isTyping && showUI === "ig_meta_verified" && (() => {
            const MvBadge = () => (
              <img src={META_VERIFIED_BADGE} alt="Meta Verified" style={{ width: "16px", height: "16px", verticalAlign: "middle", display: "inline-block", marginLeft: "3px", marginRight: "0px", position: "relative", top: "-1px" }} />
            );
            return (
              <div style={col}>
                <OptBtn
                  onClick={() => onMetaVerified("tem")}
                  icon="✅"
                  label={<span>Sim, tenho o <strong>Meta Verified</strong><MvBadge />ativo</span>}
                  sub="Selo azul de verificação no perfil"
                />
                <OptBtn
                  onClick={() => onMetaVerified("nao")}
                  icon="❌"
                  label="Não tenho"
                />
              </div>
            );
          })()}

          {/* P7: tempo desde a desativação */}
          {!isTyping && showUI === "ig_time" && (
            <div style={col}>
              <OptBtn onClick={() => onTime("Hoje / menos de 24 horas")} icon="🚨" label="Hoje / menos de 24 horas" sub="Nas primeiras horas — janela mais crítica para recuperação" />
              <OptBtn onClick={() => onTime("Menos de 30 dias")}              icon="📅" label="Menos de 30 dias" />
              <OptBtn onClick={() => onTime("1 a 6 meses")}                   icon="📅" label="1 a 6 meses" />
              <OptBtn onClick={() => onTime("6 meses a 1 ano")}               icon="📅" label="6 meses a 1 ano" />
              <OptBtn onClick={() => onTime("Mais de 1 ano")}                 icon="📅" label="Mais de 1 ano" />
            </div>
          )}

          {/* P8: já tentou recorrer? */}
          {!isTyping && showUI === "ig_appeal" && (
            <div style={col}>
              <OptBtn onClick={() => onAppeal("Sim, tentei recorrer dentro da plataforma")}        icon="✅" label="Sim, tentei recorrer dentro da plataforma" />
              <OptBtn onClick={() => onAppeal("Não, ainda não tentei recorrer")}                   icon="❌" label="Não, ainda não tentei recorrer" />
              <OptBtn onClick={() => onAppeal("Tentei, mas não consegui acessar o recurso")}       icon="🚫" label="Tentei, mas não consegui acessar o recurso" />
            </div>
          )}

          {/* Canais oficiais da Meta — esgotamento administrativo */}
          {!isTyping && showUI === "ig_official_channels" && (
            <div style={col}>
              <OptBtn onClick={() => onOfficialChannels("sim")}        icon="✅" label="Sim, tentei pelos canais oficiais" sub="Suporte no app, assistente Meta AI ou Central de Recuperação" />
              <OptBtn onClick={() => onOfficialChannels("sem_acesso")} icon="🚫" label="Tentei, mas não consegui nem abrir o suporte" />
              <OptBtn onClick={() => onOfficialChannels("nao")}        icon="❌" label="Não, ainda não tentei" />
            </div>
          )}
          {!isTyping && showUI === "ig_official_outcome" && (
            <div style={col}>
              <OptBtn onClick={() => onOfficialOutcome("Resposta automática ou genérica")} icon="🤖" label="Resposta automática ou genérica" />
              <OptBtn onClick={() => onOfficialOutcome("Negaram / não resolveram")}        icon="⛔" label="Negaram / não resolveram" />
              <OptBtn onClick={() => onOfficialOutcome("Não responderam")}                 icon="🔇" label="Não responderam" />
              <OptBtn onClick={() => onOfficialOutcome("Pediram selfie em vídeo ou documento")} icon="🪪" label="Pediram selfie em vídeo ou documento" />
              <OptBtn onClick={() => onOfficialOutcome("Resolveram só em parte")}           icon="◐" label="Resolveram só em parte" />
            </div>
          )}
          {!isTyping && showUI === "ig_meta_pattern" && (
            <div style={col}>
              <OptBtn onClick={() => onMetaPattern("nao_interagiu")} icon="🛡️" label="Não cliquei em nada nem passei senha/código a ninguém" sub="O acesso foi perdido sem eu fazer nada" />
              <OptBtn onClick={() => onMetaPattern("interagiu")}     icon="⚠️" label="Sim, cliquei em link ou informei senha/código" />
              <OptBtn onClick={() => onMetaPattern("incerto")}       icon="❓" label="Não tenho certeza" />
            </div>
          )}

          {!isTyping && showUI === "ig_metaai_offer" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Sim, me mostra como usar a Meta AI"); botDelay("Perfeito. Veja o passo a passo:", 800, () => setShowUI("ig_metaai_guide")); }} icon="🤖" label="Sim, me mostra o passo a passo" />
              <OptBtn onClick={() => { addUser("Não precisa, pode seguir"); maybeAskMetaPattern(); }} icon="➡️" label="Não precisa, pode seguir" />
            </div>
          )}
          {!isTyping && showUI === "ig_metaai_guide" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
                <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}>Como pedir uma nova análise pelo assistente de suporte da Meta AI</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {[
                    "Abra o **Instagram ou Facebook → Configurações e atividade**. Em **«Mais informações e suporte»**, toque em **«Assistente de suporte da Meta AI»** (ou em **«Ajuda»**). Pelo navegador: [assistente de suporte da Meta AI](https://www.meta.com/br/account-recovery-support/ai-support-assistant/#how-to-find-it)",
                    "Faça isso de um **aparelho ou navegador que você já usou** para entrar na conta — os sistemas da Meta confiam mais nesses sinais",
                    "Descreva o problema de forma **objetiva**: o que aconteceu (desativação, suspensão, invasão ou restrição), quando, e que você **não violou** as diretrizes, se for o caso",
                    "Peça expressamente uma **nova análise**, **revisão adicional** ou **segunda análise** da decisão. Se já apelou antes, diga que a apelação foi **negada** ou ficou **sem resposta**",
                    "Confira a **«Caixa de Entrada de Suporte»** (em Ajuda e Suporte) — lá aparece o status das apelações e, às vezes, a opção de enviar uma nova",
                    "Tenha em mãos **evidências**: prints, documento e comprovantes de uso da conta. Se pedirem **selfie em vídeo** ou código, conclua na hora — comprova que você é o titular",
                    "**Tire print de cada etapa** e guarde o número de protocolo/caso — é prova essencial se precisarmos da via jurídica",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#15253f", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                      <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.55" }} dangerouslySetInnerHTML={{ __html: fmt(step) }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fffbe6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>
                  💡 <strong>Modelo de mensagem para o assistente:</strong><br/>
                  <em>"Olá. Minha conta [@usuário] foi [desativada / suspensa / invadida] em [data]. Não cometi nenhuma violação das diretrizes / perdi o acesso sem ter feito nada. Já enviei apelação em [data] e [foi negada / fiquei sem resposta]. Solicito uma nova análise da decisão e a recuperação do acesso. Estou à disposição para verificação de identidade. Obrigado."</em>
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fef0f0", border: "1px solid #f0b0b0", borderRadius: "8px", fontSize: "12px", color: "#7a1010", lineHeight: "1.5" }}>
                  ⚠️ <strong>Segurança:</strong> use só os canais oficiais da Meta. Nunca informe sua senha ou códigos de verificação a ninguém, e desconfie de "suportes" pagos que prometem recuperar a conta — a maioria é golpe.
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fff9e6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>
                  ⚖️ Se o assistente não resolver, isso vira <strong>prova de tentativa administrativa</strong> — e fortalece muito o seu caso na Justiça.
                </div>
              </div>
              <button onClick={() => window.open("https://www.meta.com/br/account-recovery-support/ai-support-assistant/#how-to-find-it", "_blank")} style={{ padding: "12px", background: "linear-gradient(135deg, #15253f, #1d3357)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: "#f3e0a8", fontFamily: "inherit", fontWeight: "700" }}>Abrir o assistente da Meta AI ↗</button>
              <GhostBtn onClick={() => { addUser("Já abri / vou usar o suporte da Meta AI"); addJourney("Orientado a usar o assistente Meta AI", "Sim"); maybeAskMetaPattern(); }} label="Continuar o atendimento →" />
              <GhostBtn onClick={() => { addUser("Já tentei por aí e não resolveu"); addJourney("Nova análise via Meta AI", "Tentou — sem solução"); maybeAskMetaPattern(); }} label="Já tentei por aí e não resolveu →" />
            </div>
          )}

          {/* Credenciais hackeadas — guias */}
          {!isTyping && showUI === "ig_email" && (
            <div style={col}>
              <OptBtn onClick={() => onIgEmail(true)}  icon="🔓" label="Sim, o hacker trocou o e-mail" />
              <OptBtn onClick={() => onIgEmail(false)} icon="🔒" label="Não, o e-mail ainda é o meu" />
              <OptBtn onClick={() => onIgEmail(null)}  icon="❓" label="Não sei / não consigo verificar" />
            </div>
          )}
          {/* 1.1 — E-mail de reversão security@ */}
          {!isTyping && showUI === "ig_security_email" && (
            <div style={col}>
              <OptBtn onClick={() => onSecurityEmail(true)}  icon="✅" label="Sim, recebi o e-mail de segurança" sub="Verifiquei minha caixa de entrada (incluindo spam)" />
              <OptBtn onClick={() => onSecurityEmail(false)} icon="❌" label="Não, não recebi nenhum e-mail" />
              <OptBtn onClick={() => onSecurityEmail(null)}  icon="🔍" label="Não verifiquei ainda" sub="Vou verificar agora antes de continuar" />
            </div>
          )}

          {!isTyping && showUI === "ig_phone" && (
            <div style={col}>
              <OptBtn onClick={() => onIgPhone(true)}  icon="🔓" label="Sim, o hacker trocou o número" />
              <OptBtn onClick={() => onIgPhone(false)} icon="🔒" label="Não, o telefone ainda é o meu" />
              <OptBtn onClick={() => onIgPhone(null)}  icon="❓" label="Não sei / não consigo verificar" />
            </div>
          )}
          {!isTyping && showUI === "ig_photos" && (
            <div style={col}>
              <OptBtn onClick={() => onIgPhotos(true)}  icon="🤳" label="Sim, tenho fotos minhas no perfil" />
              <OptBtn onClick={() => onIgPhotos(false)} icon="🙈" label="Não, não há fotos minhas no perfil" />
            </div>
          )}
          {!isTyping && showUI === "guide_ig_cred_ok" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuidePanel guide={GUIDES.ig_cred_ok}
                onFail={() => { addUser("Tentei e não funcionou — quero ajuda jurídica"); addJourney("Tipo do caso", "Invasão — recuperação pelo app falhou"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} failLabel="Tentei e não funcionou — quero ajuda jurídica"
                onDirect={() => { addUser("Consegui recuperar o acesso"); botDelay("Ótimo! 🎉 Agora é fundamental proteger a conta para evitar uma nova invasão.", 1000, () => setShowUI("guide_ig_hardening")); }} directLabel="✅ Consegui recuperar o acesso — e agora?"
              />
            </div>
          )}

          {!isTyping && showUI === "guide_ig_hardening" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps {...GUIDES.ig_hardening} />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Conta protegida?</strong> Se o invasor teve acesso por algum tempo, pode ter exposto dados, aplicado golpes em seu nome ou causado outros danos. Nesses casos, há respaldo jurídico.
              </div>
              <GhostBtn onClick={() => { addUser("Conta protegida — tudo certo"); addJourney("Resultado", "Conta recuperada e protegida"); botDelay("Perfeito! 🎉 Conta recuperada e protegida. Qualquer problema futuro, estaremos aqui.", 1000, () => setShowUI(null)); }} label="✅ Conta protegida — tudo certo" />
              <GhostBtn onClick={() => { addUser("O invasor causou danos — quero falar com um advogado"); addJourney("Tipo do caso", "Invasão com danos materiais ou morais"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} label="⚖️ O invasor causou danos — quero falar com um advogado →" />
            </div>
          )}
          {!isTyping && showUI === "guide_ig_email_changed" && (
            <div ref={guideRef}><GuidePanel guide={GUIDES.ig_email_changed}
              onFail={() => { addUser("Tentei e não funcionou"); addJourney("Tipo do caso", "Invasão — e-mail alterado, recuperação falhou"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} failLabel="Tentei e não funcionou — quero ajuda jurídica"
              onDirect={() => { addUser("Prefiro ajuda jurídica direta"); addJourney("Tipo do caso", "Invasão — e-mail alterado, prefere via jurídica"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} directLabel="O processo é complexo — prefiro ajuda jurídica direta"
            /></div>
          )}
          {!isTyping && showUI === "guide_ig_phone_changed" && (
            <div ref={guideRef}><GuidePanel guide={GUIDES.ig_phone_changed}
              onFail={() => { addUser("Tentei e não funcionou"); addJourney("Tipo do caso", "Invasão — telefone alterado, recuperação falhou"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} failLabel="Tentei e não funcionou — quero ajuda jurídica"
              onDirect={() => { addUser("Prefiro ajuda jurídica direta"); addJourney("Tipo do caso", "Invasão — telefone alterado, prefere via jurídica"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} directLabel="O processo é complexo — prefiro ajuda jurídica direta"
            /></div>
          )}
          {!isTyping && showUI === "guide_ig_both_photos" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps {...GUIDES.ig_both_photos} />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Conseguiu resolver?</strong> Ótimo! Se ainda tiver dificuldades ou descobrir que houve danos reais, podemos analisar juridicamente.
              </div>
              <GhostBtn onClick={() => { addUser("Quero registrar no Consumidor.gov primeiro"); botDelay("Boa escolha — o Consumidor.gov.br é gratuito, tem prazo de resposta de até 10 dias e gera uma prova formal de tentativa extrajudicial.", 1200, () => botDelay("Acesse **[consumidor.gov.br](https://www.consumidor.gov.br/pages/empresa/20210822003245118/perfil)** e registre sua reclamação com: prints do perfil, data do ocorrido, nome de usuário e descrição do impacto. Guarde o protocolo gerado.", 1800, () => botDelay("Quando tiver o protocolo, volte aqui para registrar o caso com o escritório.", 1100, () => { addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, via Consumidor.gov"); setForcedProb("muito_alta"); askEconomic(); }))); }} label="Registrar no Consumidor.gov.br primeiro →" />
              <GhostBtn onClick={() => { addUser("O Instagram não respondeu / processo não funcionou"); addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, recuperação falhou"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} label="O Instagram não respondeu / processo não funcionou →" />
              <GhostBtn onClick={() => { addUser("Prefiro a via jurídica agora"); addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, prefere via jurídica"); setForcedProb("muito_alta"); botDelay("Ótima decisão. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} label="Prefiro a via jurídica — é mais rápido e eficaz →" />
            </div>
          )}
          {!isTyping && showUI === "guide_ig_both_nophotos" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps {...GUIDES.ig_both_nophotos} />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Conseguiu resolver?</strong> Ótimo! Se ainda tiver dificuldades ou descobrir que houve danos reais, podemos analisar juridicamente.
              </div>
              <GhostBtn onClick={() => { addUser("Quero registrar no Consumidor.gov primeiro"); botDelay("Boa escolha — o Consumidor.gov.br é gratuito, tem prazo de resposta de até 10 dias e gera uma prova formal de tentativa extrajudicial.", 1200, () => botDelay("Acesse **[consumidor.gov.br](https://www.consumidor.gov.br/pages/empresa/20210822003245118/perfil)** e registre sua reclamação com: prints do perfil, data do ocorrido, nome de usuário e descrição do impacto. Guarde o protocolo gerado.", 1800, () => botDelay("Quando tiver o protocolo, volte aqui para registrar o caso com o escritório.", 1100, () => { addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, via Consumidor.gov"); setForcedProb("muito_alta"); askEconomic(); }))); }} label="Registrar no Consumidor.gov.br primeiro →" />
              <GhostBtn onClick={() => { addUser("O Instagram não respondeu / processo não funcionou"); addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, recuperação falhou"); setForcedProb("muito_alta"); botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} label="O Instagram não respondeu / processo não funcionou →" />
              <GhostBtn onClick={() => { addUser("Prefiro a via jurídica agora"); addJourney("Tipo do caso", "Invasão — ambas credenciais alteradas, prefere via jurídica"); setForcedProb("muito_alta"); botDelay("Ótima decisão. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic()); }} label="Prefiro a via jurídica — é mais rápido e eficaz →" />
            </div>
          )}

          {/* Sub-app selector */}
          {!isTyping && showUI === "sub_app" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => onSubApp("TikTok")}        logo_custom={APP_LOGOS.tiktok} label="TikTok" />
              <OptBtn onClick={() => onSubApp("X (Twitter)")}   logo_custom={APP_LOGOS.x}      label="X (Twitter)" />
              <OptBtn onClick={() => onSubApp("Mercado Livre")} logo_custom={APP_LOGOS.ml}     label="Mercado Livre" />
              <OptBtn onClick={() => onSubApp("Uber")}          logo_custom={APP_LOGOS.uber}   label="Uber" />
              <OptBtn onClick={() => onSubApp("99")}            logo_custom={APP_LOGOS.n99}    label="99" />
              <OptBtn onClick={() => { addUser("Outro aplicativo"); addJourney("Aplicativo", "Outro"); botDelay("Entendido. Qual é o nome do aplicativo?", 800, () => setShowUI("other_app_name")); }} icon="📲" label="Outro aplicativo" />
            </div>
          )}

          {/* WA: tipo de problema */}
          {!isTyping && showUI === "wa_issue_type" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => { setWaIssueType("hacked"); addUser("Alguém clonou ou acessou minha conta"); addJourney("WhatsApp — Problema", "Clonagem / acesso indevido"); botDelay("Entendido. Uma pergunta rápida para te dar o caminho certo:", 800, () => setShowUI("wa_hacked_type")); }} icon="🔓" label="Alguém clonou ou acessou minha conta" sub="Clonagem, número no celular de outra pessoa" />
              <OptBtn onClick={() => { setWaIssueType("banned"); addUser("Minha conta foi banida / suspensa pelo WhatsApp"); addJourney("WhatsApp — Problema", "Banimento / suspensão"); botDelay("Entendido. Vou fazer algumas perguntas para entender seu caso.", 900, () => setShowUI("wa_ban_type")); }} icon="🚫" label="Minha conta foi banida ou suspensa pelo WhatsApp" sub="Recebeu mensagem de banimento ou suspensão" />
              <OptBtn onClick={() => { setWaIssueType("other"); addUser("Outro problema com o WhatsApp"); addJourney("WhatsApp — Problema", "Outro"); escalate("Vamos registrar seu caso para análise."); }} icon="❓" label="Outro problema" />
            </div>
          )}

          {/* WA: tipo de banimento */}
          {!isTyping && showUI === "wa_ban_type" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => { addUser("Banimento permanente — \"Esta conta está impedida de usar o WhatsApp\""); addJourney("WhatsApp — Tipo de banimento", "Permanente"); botDelay("Banimento permanente sem justificativa é o cenário com **maior potencial jurídico** no WhatsApp.", 1000, () => botDelay("A conta era usada para trabalho ou negócios?", 900, () => setShowUI("wa_economic"))); }} icon="⛔" label="Banimento permanente" sub='"Esta conta está impedida de usar o WhatsApp"' />
              <OptBtn onClick={() => { addUser("Banimento temporário — bloqueio por tempo determinado"); addJourney("WhatsApp — Tipo de banimento", "Temporário"); botDelay("Banimento temporário tende a se resolver aguardando o prazo. Veja os passos:", 900, () => setShowUI("guide_wa_banned")); }} icon="⏳" label="Banimento temporário" sub="Bloqueio por 24h, 48h ou alguns dias" />
              <OptBtn onClick={() => { addUser("Não sei o tipo de banimento"); addJourney("WhatsApp — Tipo de banimento", "Desconhecido"); botDelay("Entendido. Antes de mostrar o guia, uma pergunta rápida:", 900, () => setShowUI("wa_economic")); }} icon="❓" label="Não sei / não aparece mensagem clara" />
            </div>
          )}

          {/* WA: econômico */}
          {!isTyping && showUI === "wa_economic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => { setEconomic(true); addUser("Sim, usava para trabalho / negócios"); addJourney("WhatsApp — Uso para trabalho/negócios", "Sim"); setCaseProbability("muito_alta"); botDelay("Conta de trabalho banida sem justificativa tem **altíssimo potencial jurídico**.", 900, () => botDelay("Em fevereiro de 2026, o TJMT determinou a reativação de um WhatsApp Business bloqueado sem aviso prévio em **72 horas**, com multa diária por descumprimento — precedente direto para o seu caso.", 1400, () => botDelay("Veja como recorrer primeiro pela própria plataforma. Se não resolver em 48h, a via judicial é o caminho mais previsível:", 1100, () => setShowUI("guide_wa_banned")))); }} icon="💼" label="Sim — usava para trabalho ou negócios" sub="Atendimento a clientes, vendas, WhatsApp Business" />
              <OptBtn onClick={() => { setEconomic(false); addUser("Não, era uso pessoal"); addJourney("WhatsApp — Uso para trabalho/negócios", "Não"); setCaseProbability("alta"); botDelay("Mesmo conta pessoal tem respaldo jurídico se o banimento foi sem motivo claro. Veja como recorrer:", 1000, () => setShowUI("guide_wa_banned")); }} icon="👤" label="Não — era uso pessoal" />
            </div>
          )}

          {/* Outras plataformas */}
          {!isTyping && showUI === "guide_wa" && (
            <div ref={guideRef}><GuidePanel guide={GUIDES.wa_hacked} onFail={() => { addUser("Tentei e não funcionou"); economic === null ? setShowUI("wa_economic") : escalate(); }} failLabel="Tentei e não funcionou — quero ajuda jurídica" /></div>
          )}

          {!isTyping && showUI === "guide_wa_banned" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {caseProbability && <ProbabilityBadge level={caseProbability} />}
              <GuideSteps {...GUIDES.wa_banned} />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Se o WhatsApp negar ou não responder:</strong> a via judicial é a mais eficaz — juízes têm determinado reativação com multa diária de R$500 a R$1.000 por descumprimento.
              </div>
              <GhostBtn onClick={() => { addUser("Quero registrar no Consumidor.gov primeiro"); botDelay("Boa escolha — o Consumidor.gov.br é gratuito, tem prazo de resposta de até 10 dias e gera uma prova formal de tentativa extrajudicial.", 1200, () => botDelay("Acesse **[consumidor.gov.br](https://www.consumidor.gov.br/pages/empresa/20210822003245118/perfil)** e registre sua reclamação com: prints da tela de banimento, data do ocorrido, número com DDI e descrição do impacto. Guarde o protocolo gerado.", 1800, () => botDelay("Quando tiver o número de protocolo do Consumidor.gov, volte aqui para registrar o caso com o escritório.", 1100, () => escalate("Vamos registrar o caso completo para análise jurídica.")))); }} label="Registrar no Consumidor.gov.br primeiro →" />
              <GhostBtn onClick={() => { addUser("O WhatsApp negou ou não respondeu — quero ajuda jurídica"); escalate("Entendido. Vamos registrar o caso para análise jurídica prioritária."); }} label="O WhatsApp negou ou não respondeu — quero ajuda jurídica →" />
              <GhostBtn onClick={() => { addUser("Prefiro já partir para a via jurídica"); escalate("Ótima decisão. Vamos coletar os dados para análise completa do caso."); }} label="Prefiro já partir para a via jurídica →" />
            </div>
          )}
          {!isTyping && showUI === "guide_email" && (
            <div ref={guideRef}><GuidePanel guide={GUIDES.email_hacked} onFail={() => { addUser("Tentei e não funcionou"); escalate(); }} failLabel="Tentei e não funcionou — quero ajuda jurídica" /></div>
          )}
          {!isTyping && showUI === "guide_other" && (
            <div ref={guideRef}><GuidePanel guide={GUIDES.other_hacked} onFail={() => { addUser("Tentei e não funcionou"); escalate(); }} failLabel="Tentei e não funcionou — quero ajuda jurídica" /></div>
          )}
          {!isTyping && showUI === "guide_password" && (() => {
            const g = GUIDES.password[platform] || GUIDES.password.other;
            return (
              <div ref={guideRef} style={col}>
                <GuideSteps {...g} />
                <div ref={guideRef} style={{ padding: "13px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f" }}>
                  <strong>💡 Ainda com dificuldades?</strong> Se descobrir que foi uma invasão real, podemos ajudar juridicamente.
                </div>
                <GhostBtn onClick={() => { addUser("Fui hackeado — quero falar com um advogado"); addJourney("Tipo do caso", "Invasão detectada via problema de senha"); (platform === "instagram" || platform === "facebook") ? (setForcedProb("muito_alta"), botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic())) : escalate("Entendido. Vamos registrar o caso para análise jurídica."); }} label="Fui hackeado — quero falar com um advogado →" />
              </div>
            );
          })()}
          {/* 2FA: P1 — lembra a senha? */}
          {!isTyping && showUI === "twofa_password" && (
            <div style={col}>
              <OptBtn onClick={() => { setTfaHasPassword(true); addUser("Sim, lembro a senha"); addJourney("2FA — Lembra a senha", "Sim"); botDelay("Ótimo — com a senha, temos mais opções de recuperação.", 700, () => botDelay("**Qual é o problema exato com o 2FA?**", 800, () => setShowUI("twofa_method"))); }} icon="✅" label="Sim, lembro a senha" />
              <OptBtn onClick={() => { setTfaHasPassword(false); addUser("Não lembro a senha"); addJourney("2FA — Lembra a senha", "Não"); botDelay("Tudo bem. Vamos verificar quais recursos você ainda tem disponíveis.", 800, () => botDelay("**Qual é o problema exato com o 2FA?**", 800, () => setShowUI("twofa_method"))); }} icon="❌" label="Não lembro a senha" />
            </div>
          )}

          {/* 2FA: P2 — qual é o problema? */}
          {!isTyping && showUI === "twofa_method" && (
            <div style={col}>
              <OptBtn onClick={() => { setTfaMethod("app"); addUser("Perdi acesso ao app autenticador (Google Authenticator, Authy...)"); addJourney("2FA — Problema", "Perdeu app autenticador"); botDelay("Entendido. Você possui algum desses recursos?", 900, () => setShowUI("twofa_resources")); }} icon="📱" label="Perdi o app autenticador" sub="Google Authenticator, Authy, Microsoft Authenticator" />
              <OptBtn onClick={() => { setTfaMethod("sms"); addUser("Não recebo mais o SMS de verificação"); addJourney("2FA — Problema", "Não recebe SMS"); botDelay("Entendido. Você possui algum desses recursos?", 900, () => setShowUI("twofa_resources")); }} icon="💬" label="Não recebo o SMS de verificação" sub="Número trocado, sem sinal, SIM clonado" />
              <OptBtn onClick={() => { setTfaMethod("phone"); addUser("Perdi o celular / ele foi roubado"); addJourney("2FA — Problema", "Perdeu o celular"); botDelay("Entendido. Você ainda tem **o mesmo número de telefone ativo** em outro aparelho?", 900, () => setShowUI("twofa_phone_active")); }} icon="📵" label="Perdi o celular ou foi roubado" />
              <OptBtn onClick={() => { setTfaMethod("other"); addUser("Outro problema com o 2FA"); addJourney("2FA — Problema", "Outro"); botDelay("Entendido. Você possui algum desses recursos?", 900, () => setShowUI("twofa_resources")); }} icon="❓" label="Outro problema" />
            </div>
          )}

          {/* 2FA: P3 — quais recursos tem? */}
          {!isTyping && showUI === "twofa_resources" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Tenho os códigos de backup"); addJourney("2FA — Recurso disponível", "Códigos de backup"); botDelay("Perfeito — os códigos de backup são a forma mais direta de recuperar o acesso.", 900, () => setShowUI("twofa_guide_backup")); }} icon="🗝️" label="Tenho os códigos de backup" sub="Gerados quando ativou o 2FA (normalmente 8 dígitos)" />
              <OptBtn onClick={() => { addUser("Tenho um dispositivo antigo ainda logado na conta"); addJourney("2FA — Recurso disponível", "Dispositivo antigo logado"); botDelay("Ótimo — um dispositivo já logado permite aprovar o acesso sem o 2FA.", 900, () => setShowUI("twofa_guide_device")); }} icon="💻" label="Tenho um dispositivo antigo logado" sub="Celular, tablet ou computador ainda conectado" />
              <OptBtn onClick={() => { addUser("Tenho acesso ao número de telefone cadastrado"); addJourney("2FA — Recurso disponível", "Acesso ao telefone"); botDelay("Com acesso ao SMS, você pode receber o código diretamente.", 900, () => setShowUI("twofa_guide_sms")); }} icon="📞" label="Tenho acesso ao telefone cadastrado" sub="Recebe SMS normalmente nesse número" />
              <OptBtn onClick={() => { addUser("Não tenho nenhum desses recursos"); addJourney("2FA — Recurso disponível", "Nenhum — verificação de identidade necessária"); botDelay("Entendido. Sem os métodos convencionais, a recuperação passa pela **verificação de identidade** — um processo oficial das plataformas.", 1100, () => botDelay("Esse processo leva entre **3 e 14 dias úteis** para ter resposta. Se a plataforma negar sem justificativa ou simplesmente não responder, isso configura **falha no próprio sistema deles** — argumento jurídico muito forte.", 1500, () => botDelay("Veja o passo a passo:", 800, () => setShowUI("twofa_guide_none")))); }} icon="🚫" label="Não tenho nenhum desses recursos" sub="Sem backup, sem dispositivo, sem acesso ao telefone" />
            </div>
          )}

          {/* 2FA: guia — usar código de backup */}
          {!isTyping && showUI === "twofa_guide_backup" && (
            <div style={col}>
              <GuideSteps title="Usando seu código de backup" steps={[
                "Na tela de login, insira sua senha normalmente",
                "Quando pedir o código 2FA, clique em **«Tentar outra forma»** ou **«Usar código de backup»**",
                "Insira um dos códigos de 8 dígitos que você guardou ao ativar o 2FA",
                "Após entrar, vá em **Configurações → Segurança** e configure um novo método de autenticação",
              ]} note="⚠️ Cada código de backup só pode ser usado uma vez. Guarde os restantes com segurança." />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Código não funcionou?</strong> Pode ter sido usado antes ou a conta foi comprometida.
              </div>
              <GhostBtn onClick={() => { addUser("Consegui entrar com o código de backup"); addJourney("Resultado 2FA", "Conseguiu entrar"); botDelay("Ótimo! 🎉 Não esqueça de configurar um novo método de autenticação agora que está dentro. Se tiver qualquer dificuldade futura, estaremos aqui.", 1100, () => setShowUI(null)); }} label="✅ Consegui entrar com o código" />
              <GhostBtn onClick={() => { addUser("O código não funcionou / a conta foi comprometida"); addJourney("Tipo do caso", "2FA — backup code falhou, possível invasão"); (platform === "instagram" || platform === "facebook") ? (setForcedProb("muito_alta"), botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic())) : escalate("Se o código foi alterado por outra pessoa, pode ser indício de invasão — há respaldo jurídico."); }} label="⚖️ O código não funcionou — quero ajuda jurídica →" />
            </div>
          )}

          {/* 2FA: guia — dispositivo confiável */}
          {!isTyping && showUI === "twofa_guide_device" && (
            <div style={col}>
              <GuideSteps title="Aprovando o login pelo dispositivo confiável" steps={[
                "Abra o aplicativo no dispositivo antigo que ainda está logado",
                "Uma notificação de aprovação de login pode aparecer automaticamente no aplicativo — aceite se aparecer",
                "Se não aparecer, vá em **Configurações → Segurança → Logins autorizados** e aprove o acesso",
                "Após entrar no novo dispositivo, redefina o método de 2FA imediatamente",
              ]} note="⚠️ Se não conseguir aprovar pelo dispositivo, passe para a verificação de identidade." />
              <GhostBtn onClick={() => { addUser("Consegui entrar aprovando pelo dispositivo antigo"); addJourney("Resultado 2FA", "Aprovado pelo dispositivo"); botDelay("Ótimo! 🎉 Não esqueça de configurar um novo método de 2FA enquanto está dentro da conta.", 1000, () => setShowUI(null)); }} label="✅ Consegui entrar pela aprovação" />
              <GhostBtn onClick={() => { addUser("Não consigo acessar pelo dispositivo antigo"); botDelay("Entendido. Vamos tentar a verificação de identidade:", 800, () => setShowUI("twofa_guide_none")); }} label="Não consigo acessar pelo dispositivo antigo →" />
            </div>
          )}

          {/* 2FA: guia — SMS */}
          {!isTyping && showUI === "twofa_guide_sms" && (
            <div style={col}>
              <GuideSteps title="Recuperação por SMS" steps={[
                "Na tela de login, insira sua senha e aguarde pedir o código 2FA",
                "Clique em **«Enviar SMS»** ou **«Tentar outra forma»** → opção de SMS",
                "Insira o código de 6 dígitos recebido por mensagem",
                "Após entrar, configure um novo app autenticador ou guarde novos códigos de backup",
              ]} />
              <GhostBtn onClick={() => { addUser("Consegui entrar pelo código SMS"); addJourney("Resultado 2FA", "Entrou pelo SMS"); botDelay("Ótimo! 🎉 Configure um app autenticador como backup para evitar esse problema no futuro.", 1000, () => setShowUI(null)); }} label="✅ Consegui entrar pelo SMS" />
              <GhostBtn onClick={() => { addUser("Não recebi o SMS ou o código não funciona"); botDelay("Sem o SMS, restam as opções de verificação de identidade:", 800, () => setShowUI("twofa_guide_none")); }} label="Não recebi o SMS → ver outras opções" />
            </div>
          )}

          {/* 2FA: guia — sem nenhum recurso (verificação de identidade) */}
          {!isTyping && showUI === "twofa_guide_none" && (
            <div style={col}>
              <GuideSteps
                title="Verificação de identidade — último recurso"
                steps={[
                  "Na tela de login, clique em **«Obter mais ajuda»** ou **«Need more help»**",
                  "A plataforma pode solicitar uma **selfie de vídeo**: você virará o rosto em diferentes ângulos para confirmar identidade",
                  "Forneça um **e-mail de contato válido** (pode ser diferente do cadastrado) para receber a resposta",
                  "Se pedir documentos, envie um RG ou CNH com foto nítida",
                  "Aguarde a resposta — pode levar de **3 a 14 dias úteis**",
                ]}
                note={null}
                link={platform === "instagram" ? "https://help.instagram.com/" : platform === "facebook" ? "https://www.facebook.com/help/" : platform === "whatsapp" ? "https://faq.whatsapp.com/" : null}
                linkLabel={platform === "instagram" || platform === "facebook" || platform === "whatsapp" ? "Central de ajuda →" : null}
              />
              <div style={{ padding: "13px 15px", background: "#fff3e0", border: "1px solid #f0a030", borderRadius: "11px", fontSize: "12px", color: "#7a3e00", lineHeight: "1.55" }}>
                <strong>Importante:</strong> a plataforma possui mecanismos internos de recuperação (backup codes, dispositivo confiável, selfie de vídeo). Se nenhum funcionar, demonstra <strong>falha no próprio sistema da plataforma</strong> — argumento forte em processos judiciais.
              </div>
              <GhostBtn onClick={() => { addUser("A verificação não funcionou ou a plataforma não respondeu — quero ajuda jurídica"); addJourney("Tipo do caso", "2FA — verificação de identidade falhou"); (platform === "instagram" || platform === "facebook") ? (setForcedProb("alta"), botDelay("Entendido. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic())) : escalate("Quando todos os mecanismos de recuperação falham, a via judicial é a mais eficaz. Vamos registrar seu caso."); }} label="A verificação falhou — quero ajuda jurídica →" />
              <GhostBtn onClick={() => { addUser("Prefiro partir direto para a via jurídica"); addJourney("Tipo do caso", "2FA — prefere via jurídica direta"); (platform === "instagram" || platform === "facebook") ? (setForcedProb("alta"), botDelay("Ótima decisão. Mais algumas perguntas para o especialista chegar preparado.", 900, () => askEconomic())) : escalate("Ótima decisão. Vamos coletar os dados para análise completa."); }} label="Prefiro já partir para a via jurídica →" />
            </div>
          )}
          {!isTyping && showUI === "guide_suspended" && (
            <div ref={guideRef} style={col}>
              <GuideSteps {...GUIDES.suspended} />
              <GhostBtn onClick={() => { addUser("Consegui reverter a suspensão ou desativação"); addJourney("Resultado", "Conseguiu reverter"); botDelay("Ótimo! 🎉 Se a suspensão ou desativação causou algum dano durante o período — financeiro, de reputação ou moral — ainda pode haver respaldo jurídico. Se precisar, estamos aqui.", 1200, () => setShowUI(null)); }} label="✅ Consegui reverter" />
              <GhostBtn onClick={() => { addUser("A suspensão ou desativação foi indevida e causou danos — quero ajuda jurídica"); addJourney("Tipo do caso", "Suspensão ou desativação indevida com danos"); botDelay("Entendido. Mais uma pergunta rápida antes de te conectar com o especialista.", 900, () => askEconomic()); }} label="⚖️ A suspensão foi indevida e causou danos — quero ajuda jurídica →" />
            </div>
          )}

          {/* Suspensão sem mensagem clara — CTA especialista */}
          {!isTyping && showUI === "cta_specialist" && (
            <div style={col}>
              <GhostBtn onClick={() => { addUser("Sim, quero falar com um especialista"); addJourney("Tipo do caso", "Suspensão ou restrição sem mensagem clara"); botDelay("Perfeito. Preciso de mais algumas informações para o especialista chegar preparado.", 900, () => askEconomic()); }} label="Sim, quero falar com um especialista →" />
              <GhostBtn onClick={() => { addUser("Vou tentar recorrer primeiro"); addJourney("Opção", "Tentará recorrer sozinho"); botDelay("Tudo bem! Tente acessar sua conta e busque a opção de **«Recorrer»** ou **«Solicitar revisão»** na tela de bloqueio.", 900, () => botDelay("Se não encontrar essa opção, acesse [help.instagram.com](https://help.instagram.com/contact/539876267083971) e preencha o formulário de conta desativada.", 1100, () => botDelay("Se a plataforma não resolver, estaremos aqui para ajudar com os próximos passos. 👊", 1000, () => setShowUI(null)))); }} label="Vou tentar recorrer primeiro" />
            </div>
          )}

          {/* Guia de recurso interno — se nunca tentou */}
          {!isTyping && showUI === "ig_account_exists" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => { addUser("Sim, a conta ainda aparece no perfil"); addJourney("Conta ainda existe", "Sim"); botDelay("Ótimo — como a conta ainda existe, o recurso dentro da plataforma tem boa chance de funcionar.", 900, () => botDelay("Veja o passo a passo para recorrer oficialmente:", 800, () => setShowUI("ig_appeal_guide"))); }} icon="✅" label="Sim, consigo ver o perfil normalmente" sub="A conta aparece no Instagram / Facebook" />
              <OptBtn onClick={() => { addUser("Não, a conta não aparece mais / foi deletada"); addJourney("Conta ainda existe", "Não — parece deletada"); botDelay("Quando a conta some completamente, pode ter sido **deletada** — não apenas suspensa.", 1000, () => botDelay("Contas deletadas têm prazo de recuperação muito curto (30 dias no Instagram). Nesse caso, a via jurídica pode ser o único caminho viável.", 1300, () => askOfficialChannels({}))); }} icon="⛔" label="Não, a conta sumiu / não aparece mais" sub="O perfil não existe ou retorna erro 404" />
              <OptBtn onClick={() => { addUser("Não sei / não consigo verificar agora"); addJourney("Conta ainda existe", "Não sabe"); botDelay("Tudo bem — veja como recorrer formalmente. Independente do status, esses são os passos corretos:", 1000, () => setShowUI("ig_appeal_guide")); }} icon="❓" label="Não sei / não consigo verificar agora" />
            </div>
          )}

          {!isTyping && showUI === "ig_appeal_guide" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <div style={{ padding: "16px", background: "#fdf8ef", border: "2px solid #e8d9b8", borderRadius: "13px" }}>
                <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontWeight: "700", fontSize: "13.5px", color: "#15253f", marginBottom: "12px" }}>Como recorrer dentro do Instagram / Facebook</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {[
                    "Verifique **Configurações → Conta → Status da conta** no app — pode aparecer o motivo e um botão direto de recurso",
                    "Tente fazer login normalmente — na tela de suspensão ou desativação, procure o botão **«Contestar»**, **«Apelar»** ou **«Solicitar revisão»**",
                    "Se não aparecer o botão, acesse o formulário oficial: [help.instagram.com/contact/539876267083971](https://help.instagram.com/contact/539876267083971) (Instagram) ou [facebook.com/help/contact/606967319425038](https://www.facebook.com/help/contact/606967319425038) (Facebook)",
                    "Escreva de forma **objetiva e respeitosa** — tom agressivo ou informações falsas podem eliminar sua chance de recurso",
                    "Se a plataforma pedir uma **selfie segurando papel com código**, envie imediatamente — comprova que você é o titular",
                    "Sem resposta em 7 dias úteis, reenvie o formulário — é permitido repetir",
                    "**Tire print de tudo**: telas de suspensão ou desativação, formulários enviados e qualquer resposta recebida — são provas essenciais",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#15253f", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                      <div style={{ fontSize: "12.5px", color: "#333", lineHeight: "1.55" }} dangerouslySetInnerHTML={{ __html: fmt(step) }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "12px", padding: "10px 12px", background: "#fffbe6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>
                  💡 <strong>Modelo de mensagem para o formulário:</strong><br/>
                  <em>"Olá, minha conta foi suspensa ou desativada e não recebi informações claras sobre o motivo. Acredito que não violei nenhuma diretriz e gostaria de solicitar uma reavaliação. Estou à disposição para fornecer mais dados. Obrigado pela atenção."</em>
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fef0f0", border: "1px solid #f0b0b0", borderRadius: "8px", fontSize: "12px", color: "#7a1010", lineHeight: "1.5" }}>
                  ⚠️ <strong>Evite:</strong> usar formulários errados, contratar terceiros que prometem recuperar a conta (maioria são golpes), enviar mensagens agressivas ou fornecer dados falsos.
                </div>
                <div style={{ marginTop: "8px", padding: "10px 12px", background: "#fff9e6", border: "1px solid #f0d060", borderRadius: "8px", fontSize: "12px", color: "#6b4f00", lineHeight: "1.5" }}>
                  ⚖️ Se a plataforma não responder ou negar o recurso sem justificativa, você terá <strong>prova de tentativa de resolução</strong> — o que fortalece muito a ação jurídica.
                </div>
              </div>
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>📋 Após tentar o recurso:</strong> independente do resultado, voltamos para concluir a análise do seu caso.
              </div>
              <GhostBtn onClick={() => { addUser("Tentei recorrer e não funcionou / plataforma negou"); setAppealTried("Tentei recorrer, mas a plataforma não resolveu"); askOfficialChannels({}); }} label="Tentei recorrer — não funcionou / negaram →" />
              <GhostBtn onClick={() => { addUser("A plataforma não respondeu ao recurso"); setAppealTried("Enviou recurso mas não houve resposta da plataforma"); askOfficialChannels({}); }} label="Enviei o recurso mas a plataforma não respondeu →" />
            </div>
          )}

          {/* Inputs de texto */}
          {!isTyping && showUI === "name-early-input" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "7px" }}>
                <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && inputVal.trim()) { const n = inputVal.trim(); nameRef.current = n; setName(n); addUser(n); setInputVal(""); addJourney("Nome", n); const issue = pendingIssue; setPendingIssue(null); botDelay(`Obrigado, **${n.split(" ")[0]}**! Vamos continuar.`, 700, () => onIssue(issue, true)); }}}
                  placeholder="Seu nome..."
                  style={{ flex: 1, padding: "10px 14px", border: "2px solid #e8e0d0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#15253f" }}
                  onFocus={e => e.target.style.borderColor = "#b79f6f"}
                  onBlur={e => e.target.style.borderColor = "#e8e0d0"}
                />
                <button onClick={() => { if (!inputVal.trim()) return; const n = inputVal.trim(); nameRef.current = n; setName(n); addUser(n); setInputVal(""); addJourney("Nome", n); const issue = pendingIssue; setPendingIssue(null); botDelay(`Obrigado, **${n.split(" ")[0]}**! Vamos continuar.`, 700, () => onIssue(issue, true)); }} style={{ padding: "10px 16px", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", color: "#15253f", fontWeight: "700" }}>→</button>
              </div>
            </div>
          )}

          {!isTyping && showUI === "name-input" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {caseProbability && <ProbabilityBadge level={caseProbability} />}
              <div style={{ display: "flex", gap: "7px" }}>
                <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onNameSubmit()}
                  placeholder="Seu nome completo..."
                  style={{ flex: 1, padding: "10px 14px", border: "2px solid #e8e0d0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#15253f" }}
                  onFocus={e => e.target.style.borderColor = "#b79f6f"}
                  onBlur={e => e.target.style.borderColor = "#e8e0d0"}
                />
                <button onClick={onNameSubmit} style={{ padding: "10px 16px", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", color: "#15253f", fontWeight: "700" }}>→</button>
              </div>
            </div>
          )}
          {!isTyping && showUI === "desc-input" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <textarea autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
                placeholder="Descreva o que aconteceu, quando percebeu, que impactos teve..."
                rows={3}
                style={{ padding: "10px 14px", border: "2px solid #e8e0d0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#15253f", resize: "none" }}
                onFocus={e => e.target.style.borderColor = "#b79f6f"}
                onBlur={e => e.target.style.borderColor = "#e8e0d0"}
              />
              <button onClick={onDescSubmit} style={{ padding: "12px", background: "linear-gradient(135deg, #15253f, #1d3357)", border: "none", borderRadius: "11px", cursor: "pointer", fontSize: "13px", color: "#f3e0a8", fontFamily: "inherit", fontWeight: "700" }}>Continuar →</button>
            </div>
          )}

          {/* Danos */}
          {!isTyping && showUI === "damages" && (
            <div style={col}>
              {DAMAGE_OPTIONS.map(opt => (
                <OptBtn key={opt.key}
                  onClick={() => setDamages(p => p.includes(opt.key) ? p.filter(d => d !== opt.key) : [...p, opt.key])}
                  icon={damages.includes(opt.key) ? "✅" : opt.icon}
                  label={opt.label}
                  selected={damages.includes(opt.key)}
                />
              ))}
              <button onClick={finalizeDamages} disabled={!damages.length}
                style={{ padding: "12px", background: damages.length ? "linear-gradient(135deg, #15253f, #1d3357)" : "#d0cfc8", border: "none", borderRadius: "11px", cursor: damages.length ? "pointer" : "not-allowed", fontSize: "13px", color: damages.length ? "#f3e0a8" : "#888", fontFamily: "inherit", fontWeight: "700" }}>
                Analisar meu caso →
              </button>
            </div>
          )}

          {/* ── TikTok: banimento ── */}
          {!isTyping && showUI === "guide_tiktok_ban" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta TikTok banida — como recorrer"
                steps={[
                  "Abra o TikTok e toque em **«Apelar»** na tela de notificação de banimento — essa opção aparece direto no app",
                  "Acesse **[Formulário de apelação do TikTok](https://www.tiktok.com/legal/report/feedback)** e descreva que o banimento foi um erro, com o máximo de detalhes possível",
                  "Tire **print da tela de banimento** e de qualquer e-mail recebido da plataforma — essas são suas provas",
                  "Se a conta era usada para criação de conteúdo ou gerava renda, reúna evidências: prints de parcerias, contratos, métricas de seguidores",
                  "Aguarde a resposta do TikTok — geralmente em **3 a 7 dias úteis**. Se não responder, isso fortalece a via judicial",
                ]}
                note="⚖️ O TikTok já foi condenado judicialmente no Brasil a reativar contas e pagar indenizações. Contas de criadores de conteúdo têm especialmente forte respaldo jurídico."
                link="https://www.tiktok.com/legal/report/feedback"
                linkLabel="Formulário de apelação TikTok →"
              />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>📌 Importante:</strong> o TikTok tem obrigação legal de informar o motivo do banimento. A ausência de justificativa clara é argumento sólido em processos judiciais.
              </div>
              <GhostBtn onClick={() => { addUser("Consegui resolver pelo TikTok"); addJourney("Resultado", "Resolveu pelo app"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se o problema voltar, pode contar conosco.", 900, () => setShowUI(null)); }} label="✅ Consegui resolver pelo TikTok" />
              <GhostBtn onClick={() => { addUser("TikTok não resolveu — quero ajuda jurídica"); escalate("Entendido. Vamos registrar o caso para análise jurídica."); }} label="O TikTok não resolveu — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── TikTok: hackeada ── */}
          {!isTyping && showUI === "guide_tiktok_hacked" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta TikTok invadida — recuperar acesso"
                steps={[
                  "Na tela de login, toque em **«Usar código de verificação»** e insira seu e-mail ou telefone cadastrado",
                  "Se os dados foram alterados pelo hacker, acesse **[tiktok.com/login/feedback](https://www.tiktok.com/login/feedback)** e solicite recuperação por identidade",
                  "Prepare documentos de identidade (RG ou CNH) — o TikTok pode solicitar para verificar a titularidade",
                  "Documente tudo: prints do perfil, seguidores, conteúdos postados — qualquer prova de que você é o titular",
                ]}
                note="⚠️ Se o hacker usou sua conta para divulgar fraudes ou causou outros danos, há base para ação judicial."
                link="https://www.tiktok.com/login/feedback"
                linkLabel="Recuperação TikTok →"
              />
              <GhostBtn onClick={() => { addUser("Consegui recuperar a conta TikTok"); addJourney("Resultado", "Recuperou TikTok"); botDelay("Ótimo! 🎉 Reative o 2FA assim que entrar para proteger a conta.", 900, () => setShowUI(null)); }} label="✅ Consegui recuperar" />
              <GhostBtn onClick={() => { addUser("Não consegui recuperar — quero ajuda jurídica"); escalate(); }} label="⚖️ Não consegui recuperar — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── Uber ── */}
          {!isTyping && showUI === "guide_uber" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta Uber desativada — como recorrer"
                steps={[
                  "Abra o app da Uber e veja se aparece uma **notificação explicando o motivo** da desativação — guarde um print",
                  "Acesse **[help.uber.com](https://help.uber.com)** → Conta → Minha conta foi desativada, e preencha o formulário de revisão",
                  "Para motoristas parceiros: acesse **[uber.com/br/pt-br/drive/driver-app/deactivation-review](https://www.uber.com/br/pt-br/drive/driver-app/deactivation-review/)** para solicitar revisão formal",
                  "Se houver cobrança pendente como motivo, resolva o pagamento antes de solicitar a reativação",
                  "Documente tudo: prints da tela de desativação, histórico de corridas e qualquer comunicação com a Uber",
                ]}
                note="⚖️ A Uber tem obrigação de informar o motivo da desativação e dar direito de defesa. Desativações sem justificativa clara — especialmente de motoristas parceiros — geram forte base para ação judicial por dano material e moral."
                link="https://help.uber.com"
                linkLabel="Central de ajuda Uber →"
              />
              <div style={{ padding: "13px 15px", background: "#f0f4fb", border: "1px solid #c8d8f0", borderRadius: "11px", fontSize: "12px", color: "#15253f", lineHeight: "1.55" }}>
                <strong>💡 Motorista parceiro?</strong> A desativação injusta pode configurar rescisão indireta do contrato de parceria, com direito a indenização por lucros cessantes.
              </div>
              <GhostBtn onClick={() => { addUser("Consegui resolver pelo Uber"); addJourney("Resultado", "Resolveu pelo app"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se o problema voltar, pode contar conosco.", 900, () => setShowUI(null)); }} label="✅ Consegui resolver pelo Uber" />
              <GhostBtn onClick={() => { addUser("Uber não resolveu — quero ajuda jurídica"); escalate("Vamos registrar o caso. Desativações indevidas da Uber têm forte amparo jurídico."); }} label="A Uber não resolveu — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── 99 ── */}
          {!isTyping && showUI === "guide_99" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta 99 bloqueada — como recorrer"
                steps={[
                  "Acesse o app da 99 e veja a mensagem de bloqueio — ela pode indicar se é temporário ou permanente",
                  "Para bloqueio **temporário**: aguarde o prazo indicado no app. Causas comuns: documentação vencida, excesso de cancelamentos ou avaliações baixas",
                  "Para bloqueio **permanente**: acesse **[portaldarevisao99.com.br](https://www.portaldarevisao99.com.br)** — portal oficial da 99 para solicitação de revisão de desativação",
                  "Reúna provas do bloqueio indevido: prints de avaliações, histórico de corridas, prints da notificação recebida",
                  "Se a revisão for negada sem justificativa, documente a resposta — esse é o passo antes da via judicial",
                ]}
                note="⚖️ Bloqueios injustos na 99 — especialmente sem notificação clara ou com base em denúncias não verificadas — têm respaldo jurídico. É possível pedir liminar para reativação e indenização por danos materiais (renda cessante) e morais."
                link="https://www.portaldarevisao99.com.br"
                linkLabel="Portal de revisão 99 →"
              />
              <GhostBtn onClick={() => { addUser("Consegui resolver pelo 99"); addJourney("Resultado", "Resolveu pelo app"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se o problema voltar, pode contar conosco.", 900, () => setShowUI(null)); }} label="✅ Consegui resolver pelo 99" />
              <GhostBtn onClick={() => { addUser("A 99 não resolveu — quero ajuda jurídica"); escalate("Vamos registrar. Bloqueios indevidos em apps de transporte têm amparo jurídico consolidado."); }} label="A 99 não resolveu — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── Mercado Livre ── */}
          {!isTyping && showUI === "guide_ml" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta Mercado Livre suspensa — como recorrer"
                steps={[
                  "Acesse sua conta e verifique se há **mensagens de notificação** explicando o motivo da suspensão",
                  "Vá em **[mercadolivre.com.br/ajuda](https://www.mercadolivre.com.br/ajuda)** → Conta suspensa ou bloqueada e siga o processo de recurso disponível",
                  "Se houver **reputação negativa** como motivo, acesse o histórico de avaliações e identifique eventuais contestações",
                  "Reúna documentação: prints de vendas, conversas com compradores, comprovantes de envio — especialmente se a suspensão envolver disputas",
                  "Se a resposta do Mercado Livre for genérica ou insatisfatória, documente a comunicação para uso jurídico",
                ]}
                note="⚖️ O Mercado Livre deve motivar a suspensão de conta e garantir contraditório antes de qualquer penalidade definitiva. Suspensões indevidas de vendedores — especialmente profissionais — têm forte embasamento jurídico com base no CDC e no Marco Civil da Internet."
                link="https://www.mercadolivre.com.br/ajuda/25193"
                linkLabel="Central de ajuda Mercado Livre →"
              />
              <GhostBtn onClick={() => { addUser("Consegui resolver pelo Mercado Livre"); addJourney("Resultado", "Resolveu pelo app"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se o problema voltar, pode contar conosco.", 900, () => setShowUI(null)); }} label="✅ Consegui resolver pelo Mercado Livre" />
              <GhostBtn onClick={() => { addUser("Mercado Livre não resolveu — quero ajuda jurídica"); escalate("Vamos registrar o caso para análise jurídica."); }} label="O Mercado Livre não resolveu — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── X (Twitter) ── */}
          {!isTyping && showUI === "guide_x" && (
            <div ref={guideRef} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              <GuideSteps
                title="Conta X (Twitter) suspensa ou bloqueada"
                steps={[
                  "Acesse **[x.com](https://x.com)** e tente fazer login — a mensagem exibida indicará se é suspensão, bloqueio por segurança ou verificação de identidade",
                  "Para **conta bloqueada**: geralmente basta confirmar número de telefone ou resolver uma verificação de segurança diretamente na tela de login",
                  "Para **conta suspensa**: acesse **[help.twitter.com/forms/general](https://help.twitter.com/forms/general)** e preencha o formulário de apelação informando que a suspensão foi um erro",
                  "Documente tudo: tire prints da mensagem de suspensão, dos e-mails recebidos e do formulário enviado",
                  "Aguarde até **5 dias úteis** para resposta. Se não houver retorno ou a resposta for genérica, a via judicial é cabível",
                ]}
                note="⚖️ O X/Twitter deve informar o motivo da suspensão. Suspensões sem justificativa clara, especialmente de contas com valor profissional ou comercial, configuram violação ao CDC e têm base para ação judicial no Brasil."
                link="https://help.twitter.com/forms/general"
                linkLabel="Formulário de apelação X →"
              />
              <GhostBtn onClick={() => { addUser("Consegui resolver pelo X"); addJourney("Resultado", "Resolveu pelo app"); botDelay("Ótimo! 🎉 Fico feliz que resolveu. Se o problema voltar, pode contar conosco.", 900, () => setShowUI(null)); }} label="✅ Consegui resolver pelo X" />
              <GhostBtn onClick={() => { addUser("X (Twitter) não resolveu — quero ajuda jurídica"); escalate("Vamos registrar o caso para análise jurídica."); }} label="O X não resolveu — quero ajuda jurídica →" />
            </div>
          )}

          {/* ── Email: escolha de provedor ── */}
          {!isTyping && showUI === "email_provider" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
              <OptBtn onClick={() => { addUser("Google (Gmail)");      addJourney("Provedor de e-mail", "Google (Gmail)");     botDelay("Preparei um guia para recuperação da conta Google:", 800, () => setShowUI("guide_email_google")); }}    logo="gmail"   label="Google (Gmail)" />
              <OptBtn onClick={() => { addUser("Microsoft (Outlook / Hotmail)"); addJourney("Provedor de e-mail", "Microsoft"); botDelay("Preparei um guia para recuperação da conta Microsoft:", 800, () => setShowUI("guide_email_microsoft")); }} logo="outlook" label="Microsoft (Outlook / Hotmail)" />
              <OptBtn onClick={() => { addUser("Apple (iCloud)");      addJourney("Provedor de e-mail", "Apple (iCloud)");     botDelay("Preparei um guia para recuperação da conta Apple:", 800, () => setShowUI("guide_email_apple")); }}    logo="apple_m" label="Apple (iCloud)" />
              <OptBtn onClick={() => { addUser("Outro provedor");      addJourney("Provedor de e-mail", "Outro");              botDelay("Preparei um guia geral para recuperação de e-mail:", 800, () => setShowUI("guide_email_other")); }}    icon="📧"      label="Outro provedor" />
            </div>
          )}

          {!isTyping && showUI === "guide_email_google" && (
            <div ref={guideRef} style={col}>
              <GuideSteps title="Recuperar conta Google (Gmail)" steps={[
                "Acesse **[accounts.google.com/signin/recovery](https://accounts.google.com/signin/recovery)** e insira seu endereço Gmail",
                "O Google mostrará opções: receber código por **SMS**, por **e-mail de recuperação** ou responder perguntas de segurança",
                "Se não tiver acesso a nenhuma opção acima, tente fazer login no **dispositivo que você costumava usar** — o Google reconhece o dispositivo",
                "Siga as instruções e crie uma nova senha segura após recuperar o acesso",
              ]} link="https://accounts.google.com/signin/recovery" linkLabel="Recuperar conta Google →" />
              <GhostBtn onClick={() => { addUser("Consegui recuperar a conta Google"); addJourney("Resultado", "Recuperou e-mail"); botDelay("Ótimo! 🎉 Não esqueça de configurar métodos de recuperação alternativos para evitar esse problema no futuro.", 1000, () => setShowUI(null)); }} label="✅ Consegui recuperar" />
              <GhostBtn onClick={() => { addUser("Não consegui recuperar a conta Google — pode ser invasão"); escalate(); }} label="⚖️ Não consegui recuperar — quero ajuda jurídica →" />
            </div>
          )}

          {!isTyping && showUI === "guide_email_microsoft" && (
            <div ref={guideRef} style={col}>
              <GuideSteps title="Recuperar conta Microsoft (Outlook / Hotmail)" steps={[
                "Acesse **[account.live.com/password/reset](https://account.live.com/password/reset)** e informe seu endereço Outlook ou Hotmail",
                "Escolha receber o código de recuperação por **telefone**, **e-mail alternativo** ou **aplicativo autenticador**",
                "Se não tiver acesso a nenhuma opção, clique em **«Não tenho essas informações»** para recuperação por identidade",
                "Preencha o formulário de recuperação de conta descrevendo detalhes como contatos, assuntos de e-mails recentes",
              ]} link="https://account.live.com/password/reset" linkLabel="Recuperar conta Microsoft →" />
              <GhostBtn onClick={() => { addUser("Consegui recuperar a conta Microsoft"); addJourney("Resultado", "Recuperou e-mail"); botDelay("Ótimo! 🎉 Configure métodos de recuperação alternativos enquanto está dentro da conta.", 1000, () => setShowUI(null)); }} label="✅ Consegui recuperar" />
              <GhostBtn onClick={() => { addUser("Não consegui recuperar a conta Microsoft — pode ser invasão"); escalate(); }} label="⚖️ Não consegui recuperar — quero ajuda jurídica →" />
            </div>
          )}

          {!isTyping && showUI === "guide_email_apple" && (
            <div ref={guideRef} style={col}>
              <GuideSteps title="Recuperar conta Apple (ID Apple / iCloud)" steps={[
                "Acesse **[iforgot.apple.com](https://iforgot.apple.com)** e insira seu Apple ID (endereço de e-mail cadastrado)",
                "Escolha receber o código por **número de telefone** ou por um **dispositivo Apple** confiável (iPhone, iPad, Mac)",
                "Se não tiver acesso a nenhum dispositivo confiável, a Apple iniciará um processo de recuperação de conta que pode levar **alguns dias**",
                "Siga as instruções enviadas por e-mail ou SMS pela Apple para concluir a verificação",
              ]} link="https://iforgot.apple.com" linkLabel="Recuperar Apple ID →" />
              <GhostBtn onClick={() => { addUser("Consegui recuperar o Apple ID"); addJourney("Resultado", "Recuperou e-mail"); botDelay("Ótimo! 🎉 Configure a verificação em duas etapas enquanto está na conta.", 1000, () => setShowUI(null)); }} label="✅ Consegui recuperar" />
              <GhostBtn onClick={() => { addUser("Não consegui recuperar o Apple ID — pode ser invasão"); escalate(); }} label="⚖️ Não consegui recuperar — quero ajuda jurídica →" />
            </div>
          )}

          {!isTyping && showUI === "guide_email_other" && (
            <div ref={guideRef} style={col}>
              <GuideSteps title="Recuperar acesso ao e-mail" steps={[
                "Acesse o site do seu provedor de e-mail e clique em **«Esqueci a senha»** ou **«Recuperar conta»**",
                "Informe o endereço de e-mail e siga as opções: código por SMS, e-mail alternativo ou perguntas de segurança",
                "Se os dados de recuperação foram alterados, contate o **suporte oficial** do provedor relatando a situação",
              ]} link={null} linkLabel={null} />
              <GhostBtn onClick={() => { addUser("Consegui recuperar o e-mail"); addJourney("Resultado", "Recuperou e-mail"); botDelay("Ótimo! 🎉 Configure métodos de recuperação alternativos enquanto está dentro da conta.", 1000, () => setShowUI(null)); }} label="✅ Consegui recuperar" />
              <GhostBtn onClick={() => { addUser("Não consegui recuperar — pode ser invasão"); escalate(); }} label="⚖️ Não consegui recuperar — quero ajuda jurídica →" />
            </div>
          )}

          {/* CSAM: outro conteúdo — descrição livre */}
          {!isTyping && showUI === "csam_other_desc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <textarea autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
                placeholder="Ex: foto de biquíni, imagem artística, vídeo de dança, foto de bebê..."
                style={{ padding: "10px 14px", border: "2px solid #e8e0d0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#15253f", resize: "none", height: "80px", lineHeight: "1.5" }}
                onFocus={e => e.target.style.borderColor = "#b79f6f"}
                onBlur={e => e.target.style.borderColor = "#e8e0d0"}
              />
              <button onClick={() => { if (!inputVal.trim()) return; const desc = inputVal.trim(); addJourney("Conteúdo sinalizado — descrição", desc); addUser(desc); setDescription(desc); setInputVal(""); addJourney("Tipo do caso", "Acusação indevida de nudez ou sexualização infantil"); setForcedProb("muito_alta"); botDelay("Entendido. Antes de te conectar com nosso especialista, preciso de mais algumas informações.", 900, () => askEconomic()); }} style={{ padding: "11px", background: "linear-gradient(135deg, #15253f, #1d3357)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px", color: "#f3e0a8", fontFamily: "inherit", fontWeight: "700" }}>Continuar →</button>
            </div>
          )}

          {/* WA: triagem de clonagem */}
          {!isTyping && showUI === "wa_hacked_type" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Perdeu acesso — o número está no celular do hacker"); addJourney("WA Clonagem — tipo", "Número no aparelho do hacker"); botDelay("Entendido. Veja o passo mais urgente: ao inserir seu número no WhatsApp no seu aparelho, o código é enviado por SMS — e isso desconecta o hacker automaticamente.", 1300, () => setShowUI("guide_wa")); }} icon="📵" label="Perdi o acesso — o número está no celular de outra pessoa" sub="Clonagem, SIM swap ou roubo de celular" />
              <OptBtn onClick={() => { addUser("Ainda tenho o celular, mas alguém acessou de outro dispositivo"); addJourney("WA Clonagem — tipo", "Acesso remoto / WhatsApp Web"); botDelay("Se o acesso foi pelo WhatsApp Web ou outro dispositivo, você pode revogar na hora.", 900, () => setShowUI("guide_wa")); }} icon="💻" label="Ainda tenho meu celular, mas alguém acessou remotamente" sub="WhatsApp Web, QR Code escaneado por terceiros" />
            </div>
          )}

          {/* 2FA: celular perdido — número ainda ativo? */}
          {!isTyping && showUI === "twofa_phone_active" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Sim, o número ainda está ativo em outro aparelho"); addJourney("2FA — Número ainda ativo", "Sim"); botDelay("Ótimo — com o número ativo, você tem acesso ao SMS e provavelmente a outros recursos também.", 900, () => setShowUI("twofa_resources")); }} icon="✅" label="Sim, o número ainda está ativo em outro aparelho" sub="Chip no novo celular ou em outro aparelho" />
              <OptBtn onClick={() => { addUser("Não, perdi o número junto com o celular"); addJourney("2FA — Número ainda ativo", "Não"); botDelay("Entendido — sem o número, vamos verificar o que mais você tem disponível.", 900, () => setShowUI("twofa_resources")); }} icon="❌" label="Não, perdi o número junto com o celular" sub="Não tenho mais acesso a esse número" />
            </div>
          )}

          {/* E-mail bloqueado: motivo */}
          {!isTyping && showUI === "email_block_reason" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Bloqueio por segurança — tentativas de login suspeitas"); addJourney("E-mail — Motivo do bloqueio", "Bloqueio por segurança"); botDelay("Bloqueio por segurança é o mais comum e costuma ser revertido pelo próprio sistema de recuperação. Qual é o seu provedor?", 900, () => setShowUI("email_provider")); }} icon="🔐" label="Bloqueio por segurança" sub="Muitas tentativas de login, acesso de outro país, atividade suspeita" />
              <OptBtn onClick={() => { addUser("Conta suspensa ou desativada pela plataforma"); addJourney("E-mail — Motivo do bloqueio", "Suspensão pela plataforma"); botDelay("Suspensão de e-mail pela própria plataforma tem respaldo jurídico se causou danos. Qual é o seu provedor?", 900, () => setShowUI("email_provider")); }} icon="⛔" label="Conta suspensa ou desativada pela plataforma" sub="E-mail com mensagem de suspensão de conta" />
              <OptBtn onClick={() => { addUser("Alguém invadiu e alterou os dados de recuperação"); addJourney("E-mail — Motivo do bloqueio", "Invasão"); botDelay("Invasão com alteração de dados é o cenário mais grave — e com potencial jurídico real. Qual é o seu provedor?", 1000, () => setShowUI("email_provider")); }} icon="🔓" label="Alguém invadiu e alterou os dados de recuperação" sub="Senha, telefone ou e-mail alternativo foram trocados" />
              <OptBtn onClick={() => { addUser("Não sei o motivo do bloqueio"); addJourney("E-mail — Motivo do bloqueio", "Desconhecido"); botDelay("Tudo bem. Qual é o seu provedor de e-mail?", 800, () => setShowUI("email_provider")); }} icon="❓" label="Não sei o motivo" />
            </div>
          )}

          {/* Outro app: nome */}
          {!isTyping && showUI === "other_app_name" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", gap: "7px" }}>
                <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && inputVal.trim()) { const app = inputVal.trim(); setSubApp(app); addJourney("Aplicativo", app); setInputVal(""); botDelay(`Entendido — conta no **${app}**. O que exatamente aconteceu?`, 800, () => setShowUI("other_app_issue")); }}}
                  placeholder="Ex: Pinterest, LinkedIn, Kwai..."
                  style={{ flex: 1, padding: "10px 14px", border: "2px solid #e8e0d0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", outline: "none", color: "#15253f" }}
                  onFocus={e => e.target.style.borderColor = "#b79f6f"}
                  onBlur={e => e.target.style.borderColor = "#e8e0d0"}
                />
                <button onClick={() => { if (!inputVal.trim()) return; const app = inputVal.trim(); setSubApp(app); addJourney("Aplicativo", app); setInputVal(""); botDelay(`Entendido — conta no **${app}**. O que exatamente aconteceu?`, 800, () => setShowUI("other_app_issue")); }} style={{ padding: "10px 16px", background: "linear-gradient(135deg, #b79f6f, #e8c97a)", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", color: "#15253f", fontWeight: "700" }}>→</button>
              </div>
            </div>
          )}

          {/* Outro app: problema */}
          {!isTyping && showUI === "other_app_issue" && (
            <div style={col}>
              <OptBtn onClick={() => { addUser("Alguém invadiu ou acessou minha conta"); addJourney("Problema relatado", "Invasão"); botDelay("Entendido. Veja os passos gerais para recuperar:", 800, () => setShowUI("guide_other")); }} icon="🔓" label="Alguém invadiu ou acessou minha conta" />
              <OptBtn onClick={() => { addUser("Minha conta foi suspensa ou desativada"); addJourney("Problema relatado", "Suspensão / desativação"); botDelay("Entendido. Veja como tentar reverter:", 800, () => setShowUI("guide_suspended")); }} icon="⛔" label="Minha conta foi suspensa ou desativada" />
              <OptBtn onClick={() => { addUser("Não consigo acessar / esqueci a senha"); addJourney("Problema relatado", "Sem acesso / senha"); botDelay("Entendido. Veja o guia de recuperação:", 800, () => setShowUI("guide_password")); }} icon="🔑" label="Não consigo acessar / esqueci a senha" />
              <OptBtn onClick={() => { addUser("Outro problema"); addJourney("Problema relatado", "Outro"); escalate("Lead com problema em outro aplicativo — sem fluxo específico. Encaminhado para especialista."); }} icon="❓" label="Outro problema" />
            </div>
          )}

          {/* WhatsApp final */}
          {!isTyping && showUI === "whatsapp" && (
            <div style={{ marginTop: "4px", padding: "18px", background: "linear-gradient(135deg, #0f1e34, #15253f)", borderRadius: "14px", boxShadow: "0 4px 20px rgba(21,37,63,0.2)" }}>
              <div style={{ fontFamily: "'Palatino Linotype', Georgia, serif", fontSize: "14.5px", fontWeight: "700", color: "#f3e0a8", marginBottom: "8px" }}>Fale com um advogado especialista</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.55", marginBottom: "14px" }}>Seu caso será analisado com prioridade. Todas as informações que você compartilhou serão enviadas automaticamente para agilizar o atendimento.</div>
              <button onClick={openWhatsApp}
                style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #20b954, #25D366)", border: "none", borderRadius: "11px", cursor: "pointer", fontSize: "14px", color: "#fff", fontFamily: "inherit", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              ><span style={{ fontSize: "17px" }}>💬</span>Falar pelo WhatsApp agora</button>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textAlign: "center", marginTop: "10px" }}>Atendimento em horário comercial · Resposta em até 2h úteis</div>
            </div>
          )}

          <div ref={bottomRef} />
    </ChatShell>
  );
}
