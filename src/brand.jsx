import { useState } from "react";

// =============================================
// ⚠️  CONFIGURAÇÃO — ALTERE ANTES DE PUBLICAR
// =============================================
export const WHATSAPP_NUMBER = "5513991791053";
// =============================================

// ═══════════════════════════════════════════════════════════
// IDENTIDADE VISUAL ÚNICA — Lex · Marques & Cunha
// Todos os fluxos (Hub e recuperação de conta) usam este módulo.
// ═══════════════════════════════════════════════════════════

// Paleta institucional
export const AZUL       = "#15253f";
export const AZUL_CLARO = "#1d3357";
export const DOURADO    = "#b79f6f";
export const AREIA      = "#f3e0a8";
export const SERIF      = "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif";

// Logos das plataformas
export const LOGOS = {
  threads: "data:image/png;base64,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",
  ig: "data:image/jpeg;base64," +
    "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",
  wa: "data:image/jpeg;base64," +
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAd" +
    "Hx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3" +
    "Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIA" +
    "AhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAABgAFBwQBAwL/xAA7EAABAgQBBwsDAgYDAAAAAAAB" +
    "AgMABAURBhIhMUFRgbEHExY1YXFzkZOh0SIjwRRSFTJCQ2LwgpLh/8QAGQEAAwEBAQAAAAAAAAAA" +
    "AAAAAAQFAgMB/8QAKREAAAUCBQQBBQAAAAAAAAAAAAECAwQRIRMUM1JxEjFC8EFRYZGx0f/aAAwD" +
    "AQACEQMRAD8Aw9tC3VpQ2kqWo2SkC5JhjS8DqW2HKm+psnPzTViR3nR5ROT6nIWt6ouJBLZ5tq+o" +
    "2uT5WG+G8SZs1aV4bdqCRNmrSvDbtQG+hVJ2zPqD4j3oVSdsz6g+IRxIn5p/cYn5p/cYOdCqTtmf" +
    "UHxE6FUnbM+oPiEcSDNPbjBmn9xg50KpO2Z9QfEToVSdsz6g+IRxIM09uMGaf3GDnQqk7Zn1B8R5" +
    "0KpO2Z9QfEJIkGaf3GDNP7jAiqYHUhsuUx9ThGfmnbAnuOjzgc4hba1IcSUrSbKSRYgxtECOUGnI" +
    "QtmotpALh5t22s2zHyuN0UIU1al4bl6ihCmrUvDcvUWeAeoj46+AhJBzAPUJ8dfAQjifK1lcifK1" +
    "1ciRIkL8H4WTPJTP1JJ/TaWmj/c7T/jxjDLKnVdKRhllTyulIoqTQqjVs8nLkt3sXVnJQN+vdCWX" +
    "5PllIM1UUpOxpq/uT+Itq9iuTo5MpKNpfmEDJyEmyG+wkcBA+bxdWplRIm+YT+1lATbfnMOmiIxZ" +
    "dVGHjREYsuqjF85yfN5P2akvK/zZFvYxSVPCFVkElxLaZpoZypjOR3p08Y52cUVtlWUmouq7HAFD" +
    "3EI6NjsLWlqrtJRfNz7QNh3p/IgLJu2oaT95HhZJ21DSfvICRI0vEmGZassGdp3NpmynKSpB+l8d" +
    "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" +
    "/9k=",
  fb: "data:image/jpeg;base64," +
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAd" +
    "Hx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3" +
    "Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIA" +
    "AhEBAxEB/8QAHAAAAwADAQEBAAAAAAAAAAAAAAIGAwQHBQEI/8QAPhAAAQMBAwgFCQYHAAAAAAAA" +
    "AQACAwQFERMGBxIzU3KSsSExUWF0FBciNTZBk7LCMlWBkdHSFUJUZHFzlP/EABkBAAMBAQEAAAAA" +
    "AAAAAAAAAAABBAUCA//EACIRAAMAAgIBBAMAAAAAAAAAAAABAgMRBDEyEjNBcRMhUf/aAAwDAQAC" +
    "EQMRAD8Aj7OoKekpI2Rxsv0QXOLelxWzhs2bOEIi1TN0ck63JlJaRA22xMNmzZwhGGzZs4QnQnoQ" +
    "mGzZs4QjDZs2cIToRoBMNmzZwhGGzZs4QnX1rXPcGsaXOPU0C8n8EaQGPDZs2cIRhs2bOEL14sm7" +
    "clYHx2RXFp6jgkc0PyctyMXvseuA/wBDjyXPqj+j0zyMNmzZwha1o0FPV0kjJI2X6JLXBvS0rdex" +
    "0b3Me0tc03Oa4XEHsKxy6p+6eSbSa0wTaYRapm6OSdJFqmbo5J010IEIQmAIQhAG7Ytl1Fs2nBQU" +
    "gGJKelx6mNHW49wC7fk9k1Z1gU7WUcIdNd6dQ8Xvef8APuHcFGZnaJhNo17h6Y0YWHsH2j9P5Lpi" +
    "zeXlbr0LpFWGFrYIUzlVlnQ5OSsp3xSVNU9unhRkANb7iSepTvnWj+5n/wDSP2rwnBkpbSO3klPT" +
    "ZA5Q+v7T8XL85Xmy6p+6eS27RqfLbQqaoM0MeZ8mjffo6RJuv/FakuqfunktdLUkfyEWqZujknSR" +
    "apm6OSdNdCBCEJgCFs2XRm0bSpaJrxG6olbGHkXht5uvuV15qqr72h+Af1XneWIeqZ1MVXR6mZ/1" +
    "LXeK+hqvlO5FZOSZN0NRTS1LKgyy4gc1hbd6IF3X3KiWVmpVkbRXCalJnEs5ZJyyrb/cyIDgCl11" +
    "nKnIGe3LcqLRjtCKFsoYAx0RcRc0Drv7l5JzV1QF5taH4B/VX4+RjUJNk9Y6dN6OeJJdU/dPJZHg" +
    "Ne4A3gEgHtWOXVP3TyVJ5BFqmbo5J0kWqZujknQugBCEJgerkn7UWT4uPmv0AvzjQVctBWwVcGji" +
    "wSCRmkLxeOq9VXnKyg/s/gn9yj5OCsjTk9sWRSv2dkQpXN9b1blBZ1TPaGFpxz6DcNmiLtEHtPaq" +
    "pZ9y4r0spT2toFp2zP5NZNbPfdhU73/k0qByyy2tex8oqmho/JsGMMLdOIk9LQT0396nLRy9tu0a" +
    "GejqDSiKdhY/QiINx67jeqI4tvT+DzrLK2iWHUL+xLLqn7p5J0kuqfunktNkgRapm6OSdJFqmbo5" +
    "J0LoAQhCYAhCEAdXzP8AqWu8V9DVfKBzP+pa7xX0NV8sfke6y3H4I4jnK9sq7di+QKYVPnK9sq7d" +
    "i+QKYWpi9ufokvyYJJdU/dPJOkl1T908l2zkItUzdHJOtKzrQpquljeyVgdogOYXAFpWzjRbWPiC" +
    "U0mtpjaaZkQseNFtY+IIxotrHxBPaEZELHjRbWPiCMaLax8QRtAdbzP+pa7xX0NV8udZpK2khsat" +
    "EtVAwmq6A6Vo/kb3q6/idB/W03xm/qsjke6y3H4I45nK9sq7di+QKYVFnHqaeTLCtfHPE5pbHcWv" +
    "BH2ApnGi2sfEFp4mvxz9El+TMiSXVP3TyXzGi2sfEFrWjaFNSUsj3ysLtEhrA4EuK7qkltsSTbP/" +
    "2Q==",
  gmail: "data:image/jpeg;base64," +
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAd" +
    "Hx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3" +
    "Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABgAGADASIA" +
    "AhEBAxEB/8QAGwAAAwEAAwEAAAAAAAAAAAAAAAUHBgEDBAL/xAAyEAABAwIDBQYFBQEAAAAAAAAB" +
    "AAIEAxEFBmEhMVFysRMjNkFxshIiNEJDMjVSgeEH/8QAGgEAAwEBAQEAAAAAAAAAAAAABAUGAAcD" +
    "Av/EAC0RAAEEAAMHAwQDAQAAAAAAAAEAAgMEBRExEiEyQVFxsRMzwSJh0eEjgZHw/9oADAMBAAIR" +
    "AxEAPwCc5ewmlTjslSGB9WoLtDhcNHl/abyotCXSNORTa9p47x6HyXa1oa0NG4CwXKVueXO2lcw1" +
    "o4ohGBu5/dYXFsMq4dWsbuou/Q/jodV4FS2RaM0mPJYH0nggj+t41WKzBglfB5NnXfHee7q236Hg" +
    "UZDOH/SdVOYjhprn1I+Hx+kpQhCISlCEIWWQtFkzKkvM874GXpQ6RHbyLfp0HFx/1eLAMEr4xJs2" +
    "7I7D3lW27QcSrxlKJQhYDHjxaYZTYXWA89u88SlOLX3VYf4+I7uyYVqLpG+q7h8r14ThEDB4jYuH" +
    "RqdGmBY2HzO1cd5KxX/S8mxJWG18Xw2gyjLjj46zabbCqzzNv5DffzF1Q18VabatJ9J4u17S1w4g" +
    "iyja9yWGYTAnPn9+6YSRNezYyUlQmGIwezvVoj5Pub/H/EvVzZrSVpDHIN/lN6dyK5EJYju8fYr0" +
    "QPqm+h6L3zItCbGfHk0w+k8bQeo4FeCB9U30PRNUITkcwi8g4ZHRS7MGCV8Hk2dd8d57urbfoeBS" +
    "pWCZFoTYz48mmH0njaD1HAqaZgwSvg8mzrvjvPd1bb9DwKYwT7f0u1UpiWGmufUj4fH6SpNcv4JX" +
    "xiTZt2R2HvKtt2g4lGAYJXxiTZt2R2HvKtt2g4lUuHFoQozI8amGUmDYB1PErTz7H0t1Ww3DTYPq" +
    "ScPn9IhxaEKMyPGphlJg2AdTxK2mXv2qlzO6rIrXZe/aqXM7qpnFznACevwVQ2wGxADRMkISjF8U" +
    "7G8eM7vNznj7dBqkVeu+w8MYEktWo60ZkkO7ykCUYjB7K9WiPk+5o+3/ABN0Lu12lHbj2H68j0Uf" +
    "h+IS0ZfUj05jr/3IpBA+qb6Homq6KsRkeSys0tbTcfhIJtYndb1XeoK3WkrSmOQb10ylciuQiWI7" +
    "vB6FC6ZkWjNjPjyWB9N42g9RwK7kIYHLeEUQHDI6LphxaMKMyPGYGU2DYB1PEruQhYnPeVgA0ZDR" +
    "C12Xv2qlzO6rIpvFxUUsJZQiuBqfE8PePs27vXogr1d9iNrGdfyluLWY61f1JDuz/wBTLF8U7G8e" +
    "M7vNznj7dPVZ9C4RtWqyszZb/Z6rmN27Jbk236ch0X0hCF1JeSRZ4JGWpJBsQ+n7glOVMyCYGQp7" +
    "7SBsp1D+TQ69U1zz4Zlc1P3BS4Eggg2IUxjcQkmAPT5KoMGtyVRtN0z3jqrKhZbKmZBMDIU99pA2" +
    "U6h/Jodeq1Kl3sLDkVf17EdiMPYUIQstmvMghh8KA+8g7KlQfj0GvRZjC85BaxYjrxl7yjNeZBDD" +
    "4UB95B2VKg/HoNeiaZIJOW4xJuS6p7ipeSSSSbkqoZH8NRuZ/uKOfEI48gue45bktN2naZ7h0T1C" +
    "ELwU2vpCELpC90hzz4Zlc1P3BS1VLPPhmVzU/cFLVO4t747fJTWj7Z7rkEggg2IW8ypmQTAyFPfa" +
    "QNlOofyaHXqsEuQSCCDYjzCTyxCQZFN6luSrJtN05jqt5mvMghh8KA+8g7KlQfj0GvRYMkkkk3JQ" +
    "SSSSbk+ZXC0UQjGQWt25LUm07TkOiFUcj+Go3M/3FS5VHI/hqNzP9xXxY4UmxH2h3/KeoQhCJKvp" +
    "CV5exihi2H0qjKje3a0CrTvta7jbgU0XRWPa9oc3QohzS05FIc8+GZXNT9wUtVSzz4Zlc1P3BS1I" +
    "MW98dvkppR9s90IQhK0ahCELLIVRyP4ajcz/AHFS5VHI/hqNzP8AcV4WOFAYj7Q7/lPUISvMOL0M" +
    "JgVKj6je3c0ilTvtc7jbgEIAScgk7Wl7g0L/2Q==",
  outlook: "data:image/jpeg;base64," +
    "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" +
    "bgZW/UfLwFI52SlSa33KXpmM9tm9fb5n/9k=",
  apple_m: "data:image/svg+xml;base64," +
    "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0" +
    "MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOSIgZmlsbD0iIzFDOEVGOSIvPjxy" +
    "ZWN0IHg9IjUiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMjIiIHJ4PSIzIiBmaWxsPSJub25l" +
    "IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNSAxMmwxNSAxMiAx" +
    "NS0xMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+",
};

// Logo do escritório — usada como avatar do Lex
export const ESCRITORIO_LOGO = "data:image/png;base64," +
  "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";

export const META_VERIFIED_BADGE = "data:image/png;base64,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";

// ─── Formatação de texto das mensagens ───
export const fmt = (text) => text
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#15253f;font-weight:700;">$1</a>')
  .replace(/::mv::/g, `<img src="${META_VERIFIED_BADGE}" alt="Meta Verified" style="width:16px;height:16px;vertical-align:middle;display:inline-block;margin-left:3px;margin-right:0;position:relative;top:-1px;" />`);

// ─── Avatar do Lex — logo do escritório sobre o círculo institucional ───
export function LexAvatar({ size = 26, glow = false }) {
  const inner = Math.round(size * 0.62);
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: "50%",
      background: `linear-gradient(135deg, ${AZUL}, ${AZUL_CLARO})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
      boxShadow: glow ? "0 2px 12px rgba(183,159,111,0.4)" : "none",
    }}>
      <img src={ESCRITORIO_LOGO} alt="Marques & Cunha"
        style={{ width: `${inner}px`, height: `${inner}px`, objectFit: "contain", display: "block" }} />
    </div>
  );
}

// ─── Botão de opção ───
export function OptBtn({ onClick, icon, logo, logos, logo_custom, label, sub, selected }) {
  const [hov, setHov] = useState(false);
  const active = selected || hov;
  return (
    <button onClick={onClick}
      style={{ padding: "11px 14px", border: `2px solid ${active ? DOURADO : "#e8e0d0"}`, borderRadius: "11px", background: active ? "#fdf8ef" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "11px", width: "100%", transition: "all 0.18s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {logos
        ? <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {logos.map(l => <img key={l} src={LOGOS[l]} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover" }} />)}
          </div>
        : logo_custom
          ? <img src={logo_custom} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
          : logo
            ? <img src={LOGOS[logo]} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
            : icon
              ? <span style={{ fontSize: "19px", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
              : null
      }
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: AZUL }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{sub}</div>}
      </div>
    </button>
  );
}

// ─── Botão secundário (contorno) ───
export function GhostBtn({ onClick, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ padding: "11px", background: hov ? AZUL : "transparent", border: `2px solid ${AZUL}`, borderRadius: "11px", cursor: "pointer", fontSize: "13px", color: hov ? AREIA : AZUL, fontFamily: "inherit", fontWeight: "700", transition: "all 0.2s", width: "100%", textAlign: "center" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{label}</button>
  );
}

// ─── Botão primário (avançar/confirmar) ───
export function PrimaryBtn({ onClick, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ padding: "12px", background: `linear-gradient(135deg, ${AZUL}, ${AZUL_CLARO})`, border: "none", borderRadius: "11px", cursor: "pointer", fontSize: "13px", color: AREIA, fontFamily: "inherit", fontWeight: "700", width: "100%", textAlign: "center", transition: "transform 0.18s, box-shadow 0.18s", boxShadow: hov ? "0 4px 14px rgba(21,37,63,0.3)" : "0 2px 8px rgba(21,37,63,0.2)", transform: hov ? "translateY(-1px)" : "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{label}</button>
  );
}

// ─── Balões de conversa ───
export const BotBubble = ({ text }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
    <LexAvatar size={26} />
    <div style={{ maxWidth: "75%", padding: "9px 13px", borderRadius: "14px 14px 14px 3px", background: "#f2f0eb", color: "#1a1a1a", fontSize: "13.5px", lineHeight: "1.55" }}
      dangerouslySetInnerHTML={{ __html: fmt(text) }} />
  </div>
);

export const UserBubble = ({ text }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ maxWidth: "75%", padding: "9px 13px", borderRadius: "14px 14px 3px 14px", background: `linear-gradient(135deg, ${AZUL}, ${AZUL_CLARO})`, color: AREIA, fontSize: "13.5px", lineHeight: "1.55", boxShadow: "0 2px 8px rgba(21,37,63,0.25)" }}>
      {text}
    </div>
  </div>
);

export const TypingRow = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
    <LexAvatar size={26} />
    <div style={{ padding: "9px 14px", borderRadius: "14px 14px 14px 3px", background: "#f2f0eb" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: DOURADO, animation: `lexBounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />)}
      </div>
    </div>
  </div>
);

// Empilhamento padrão dos painéis de opções
export const colStack = { display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" };

// ─── Moldura da conversa (cabeçalho + cartão + rodapé) ───
export function ChatShell({ children }) {
  return (
    <div style={{ fontFamily: "'Montserrat', 'Segoe UI', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #0f1e34 0%, #15253f 60%, #1a2f4a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>

      {/* Marca */}
      <div style={{ width: "100%", maxWidth: "480px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
        <LexAvatar size={42} glow />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SERIF, fontWeight: "700", fontSize: "19px", lineHeight: "1.1", color: AREIA }}>Lex · Assistente Jurídico</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "5px", marginTop: "0px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4CAF50", display: "inline-block" }} />
            Marques &amp; Cunha Advogados
          </div>
        </div>
      </div>

      {/* Conversa */}
      <div style={{ width: "100%", maxWidth: "480px", background: "#fff", borderRadius: "18px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", overflow: "hidden", display: "flex", flexDirection: "column", height: "clamp(520px, 72vh, 660px)" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {children}
        </div>

        <div style={{ padding: "9px 16px", borderTop: "1px solid #f0ece4", background: "#faf8f4", textAlign: "center", fontSize: "10.5px", color: "#bbb" }}>
          🔒 Informações confidenciais · Marques &amp; Cunha Advogados · OAB/SP
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes lexBounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-7px);} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d8c8; border-radius: 4px; }
      `}</style>
    </div>
  );
}
