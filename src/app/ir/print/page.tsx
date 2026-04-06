// @ts-nocheck
"use client";

import { useEffect } from "react";

const LIME = "#A3DF46";
const LIME_DIM = "rgba(163,223,70,.12)";
const LIME_BDR = "rgba(163,223,70,.3)";
const BG = "#0D0D14";
const BG2 = "#12121E";
const BG3 = "#1E1E2A";
const TEXT = "#F5F5F7";
const MUTED = "#8888A0";

const Tag = ({ ch }) => (
  <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:99, border:`1px solid ${LIME_BDR}`, background:LIME_DIM, color:LIME, fontSize:11, marginRight:6, marginBottom:4 }}>{ch}</span>
);
const Label = ({ n, text }) => (
  <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:LIME, fontWeight:700, marginBottom:8 }}>{n} / {text}</div>
);
const H1 = ({ children, style }) => (
  <div style={{ fontSize:36, fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.05, color:TEXT, ...style }}>{children}</div>
);
const Row = ({ label, v1, v2, v3, dim, profit }) => {
  const col = (v) => profit ? (v?.startsWith("▼") ? "#ff7070" : LIME) : (dim ? MUTED : TEXT);
  return (
    <tr style={{ borderBottom:`1px solid rgba(255,255,255,.06)` }}>
      <td style={{ padding:"6px 10px", color:dim?MUTED:TEXT, fontSize:11 }}>{label}</td>
      {[v1,v2,v3].map((v,i)=>(
        <td key={i} style={{ padding:"6px 10px", textAlign:"right", color:col(v), fontSize:11, fontWeight: profit?700:400 }}>{v}</td>
      ))}
    </tr>
  );
};

const Page = ({ children, bg = BG, pageNum, total }) => (
  <div className="poon-page" style={{
    width:1122, minHeight:794, background:bg, position:"relative",
    display:"flex", flexDirection:"column", overflow:"hidden",
    boxSizing:"border-box", pageBreakAfter:"always", breakAfter:"page",
  }}>
    <div style={{ position:"absolute", top:28, left:40, fontSize:16, fontWeight:900, letterSpacing:"-0.5px", zIndex:10 }}>
      <span style={{ color:TEXT }}>Po-</span><span style={{ color:LIME }}>On</span>
    </div>
    <div style={{ position:"absolute", top:30, right:40, fontSize:10, color:MUTED, zIndex:10 }}>
      {pageNum} / {total}
    </div>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${LIME}, #BEF16E)` }} />
    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:"rgba(255,255,255,.06)" }} />
    <div style={{ padding:"60px 40px 30px", flex:1 }}>{children}</div>
    <div style={{ padding:"0 40px 14px", display:"flex", justifyContent:"flex-end" }}>
      <span style={{ fontSize:9, color:"rgba(255,255,255,.2)" }}>© 2026 Po-On — 내부 검토용 투자 제안서</span>
    </div>
  </div>
);

const TOTAL = 14;

const Slide1 = () => (
  <Page pageNum={1} total={TOTAL}>
    <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(163,223,70,.07) 0%,transparent 70%)", top:"-20%", left:"-8%", filter:"blur(80px)", pointerEvents:"none" }} />
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:680, textAlign:"center", position:"relative" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", borderRadius:99, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.05)", fontSize:10, color:MUTED, marginBottom:24 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:LIME }} />
        2026년 Seed 투자 유치 — 서울·경기 관내
      </div>
      <div style={{ fontSize:72, fontWeight:900, letterSpacing:"-3px", lineHeight:1.05, marginBottom:16 }}>
        <div style={{ color:TEXT }}>마지막까지</div>
        <div style={{ color:TEXT }}>품다</div>
        <div><span style={{ color:TEXT }}>Po-</span><span style={{ color:LIME }}>ON</span></div>
      </div>
      <div style={{ fontSize:14, color:MUTED, lineHeight:1.7, marginBottom:36 }}>
        포온 (Po-On) — 반려동물 장례 전문 에이전시 플랫폼<br />
        슬픔의 순간, 투명하고 신뢰할 수 있는 장례 서비스를 연결합니다
      </div>
      <div style={{ display:"flex", gap:24 }}>
        {[["Seed 라운드","7,000만원"],["서비스 지역","서울·경기"],["목표 BEP","18~24개월"]].map(([k,v])=>(
          <div key={k} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:MUTED, marginBottom:4 }}>{k}</div>
            <div style={{ fontSize:18, fontWeight:900, color:LIME }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  </Page>
);

const Slide2 = () => (
  <Page pageNum={2} total={TOTAL} bg={BG2}>
    <Label n="01" text="Brand Identity" />
    <H1 style={{ marginBottom:28 }}>브랜드 아이덴티티</H1>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
      <div>
        <p style={{ fontSize:12, color:MUTED, lineHeight:1.7, marginBottom:16 }}>
          <strong style={{ color:TEXT }}>"품다(抱)"</strong>와 <strong style={{ color:TEXT }}>"온기(溫)"</strong>의 합성어.<br />
          반려동물의 마지막 순간을 따뜻하게 안아준다는 의미를 담았습니다.
        </p>
        <div style={{ marginBottom:20 }}>
          {["신뢰","투명","전문","따뜻함","존엄"].map(kw=><Tag key={kw} ch={kw}/>)}
        </div>
        <div style={{ padding:"28px 0", background:BG3, borderRadius:20, border:"1px solid rgba(255,255,255,.06)", textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:40, fontWeight:900, letterSpacing:"-2px" }}>
            <span style={{ color:TEXT }}>Po-</span><span style={{ color:LIME }}>On</span>
          </div>
          <div style={{ fontSize:18, color:MUTED, marginTop:10 }}>포온</div>
          <div style={{ fontSize:11, color:MUTED, letterSpacing:"0.15em", marginTop:8 }}>마지막까지, 품어드립니다</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize:11, color:MUTED, fontWeight:600, marginBottom:12 }}>컬러 시스템</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          {[["Deep Navy","#0D0D14"],["Warm Beige","#E8DED1"],["Poon Lime","#A3DF46"],["Soft White","#F5F5F7"]].map(([n,c])=>(
            <div key={n}>
              <div style={{ height:48, borderRadius:12, border:"1px solid rgba(255,255,255,.1)", background:c }} />
              <div style={{ fontSize:11, color:MUTED, marginTop:4 }}>{n}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", fontFamily:"monospace" }}>{c}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:"14px 18px", background:BG3, borderRadius:14, border:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize:10, color:MUTED, fontWeight:600, marginBottom:8 }}>타이포그래피</div>
          <div style={{ fontSize:18, fontWeight:900, color:TEXT, letterSpacing:"-0.5px" }}>Po-On 포온</div>
          <div style={{ fontSize:11, color:MUTED }}>Noto Sans KR</div>
        </div>
      </div>
    </div>
  </Page>
);

const Slide3 = () => (
  <Page pageNum={3} total={TOTAL}>
    <Label n="02" text="Problem & Solution" />
    <H1 style={{ marginBottom:20 }}>시장 문제와 포온의 해결책</H1>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ width:22, height:22, borderRadius:8, background:"rgba(255,80,80,.15)", color:"#ff7070", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>✕</div>
          <span style={{ fontWeight:700, fontSize:12, color:TEXT }}>보호자가 겪는 5가지 고통</span>
        </div>
        {[["01","정보 불투명","업체마다 가격이 천차만별, 슬픔이 극심한 순간 여러 곳에 전화해 견적 비교"],
          ["02","불편한 예약","전화 중심, 영업시간 외 연락 불가. 새벽 임종 시 아침까지 기다려야"],
          ["03","품질 불균일","업체 수준 사전 파악 방법 없음, 신뢰할 수 있는 후기 시스템 부재"],
          ["04","장례 후 공백","서비스가 끊기고 펫로스 증후군에 대한 심리 지원 전무"],
          ["05","절차 이해 부족","화장·매장·수목장 차이를 모르고 결정, 이후 후회하는 경우 다수"]].map(([n,t,d])=>(
          <div key={n} style={{ padding:"10px 12px", borderRadius:12, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.03)", marginBottom:6 }}>
            <div style={{ fontSize:9, fontWeight:700, color:MUTED }}>{n}</div>
            <div style={{ fontSize:11, fontWeight:700, color:TEXT }}>{t}</div>
            <div style={{ fontSize:10, color:MUTED, lineHeight:1.5 }}>{d}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ width:22, height:22, borderRadius:8, background:LIME_DIM, color:LIME, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>✓</div>
          <span style={{ fontWeight:700, fontSize:12, color:TEXT }}>포온의 5가지 해결책</span>
        </div>
        {[["01","투명 가격 비교","항목별 가격 상세 표시, 숨은 비용 제로. 파트너 장례식장 실시간 견적"],
          ["02","24시간 즉시 예약","전화 없이 앱/웹에서 3분 완료. 심야·새벽 예약도 즉시 처리"],
          ["03","파트너 품질 인증","100항목 현장 실사 후 포온 인증 마크 부여. 분기별 품질 점검"],
          ["04","AI 펫로스 케어","24시간 AI 챗봇 심리 케어 + 전문 상담사 연결. 디지털 추모관 운영"],
          ["05","실시간 진행 알림","화장 시작→진행→완료→유골 인도까지 단계별 SMS·앱 푸시 알림"]].map(([n,t,d])=>(
          <div key={n} style={{ padding:"10px 12px", borderRadius:12, border:`1px solid ${LIME_BDR}`, background:"rgba(163,223,70,.03)", marginBottom:6 }}>
            <div style={{ fontSize:9, fontWeight:700, color:LIME }}>{n}</div>
            <div style={{ fontSize:11, fontWeight:700, color:TEXT }}>{t}</div>
            <div style={{ fontSize:10, color:MUTED, lineHeight:1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </Page>
);

const Slide4 = () => (
  <Page pageNum={4} total={TOTAL} bg={BG2}>
    <Label n="03" text="Market Analysis" />
    <H1 style={{ marginBottom:20 }}>시장 분석</H1>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
      {[["328만마리","등록 반려동물 (2024)","지속적 증가세"],
        ["12만건","연간 사체 처리 규모","2년 만에 2배 증가"],
        ["13%","시장 연평균 성장률","2025~2030년 예상"]].map(([v,l,s])=>(
        <div key={v} style={{ padding:"20px 16px", borderRadius:20, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", textAlign:"center" }}>
          <div style={{ fontSize:26, fontWeight:900, color:LIME, letterSpacing:"-1px", marginBottom:4 }}>{v}</div>
          <div style={{ fontSize:11, color:MUTED }}>{l}</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.2)", marginTop:2 }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
      {[["76.8%","반려견 보호자가 향후 별도 장례 서비스 이용 의향 있음"],
        ["71.5%","반려묘 보호자가 향후 별도 장례 서비스 이용 의향 있음"],
        ["2배","동물장묘업 사체 처리량 2년 만에 증가"],
        ["13%","국내 반려동물 장례 시장 연평균 성장률 (2025~2030)"]].map(([p,t])=>(
        <div key={p} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:14, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ fontSize:18, fontWeight:900, color:LIME, whiteSpace:"nowrap", minWidth:52 }}>{p}</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.5 }}>{t}</div>
        </div>
      ))}
    </div>
    <div style={{ padding:"16px 20px", background:BG3, borderRadius:18, border:"1px solid rgba(255,255,255,.06)" }}>
      <div style={{ fontSize:11, fontWeight:700, color:TEXT, marginBottom:12 }}>📈 시장 성장 동인</div>
      {[["1인 가구·고령화 증가 → 반려동물 가족화", 92],
        ["디지털 네이티브 반려인 증가", 80],
        ["펫로스 증후군 인식 확산", 74],
        ["불법 매립 단속 강화 → 합법 장례 수요", 62]].map(([l,w])=>(
        <div key={l} style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:MUTED, marginBottom:3 }}>
            <span>{l}</span><span style={{ color:LIME }}>{w >= 85 ? "매우 높음" : w >= 75 ? "높음" : "중간"}</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,.06)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg,${LIME},#BEF16E)`, borderRadius:99 }} />
          </div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide5 = () => (
  <Page pageNum={5} total={TOTAL}>
    <Label n="04" text="Competition & Moat" />
    <H1 style={{ marginBottom:20 }}>경쟁사 분석 & 경쟁 우위</H1>
    <div style={{ overflowX:"auto", marginBottom:24 }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            {["브랜드","유형","온라인 예약","가격 투명성","AI 케어","수도권"].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"8px 10px", fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:MUTED }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { brand:"🟢 포온 (신규)", type:"에이전시 플랫폼", online:["24시간",LIME], price:["완전 공시",LIME], ai:["AI 챗봇",LIME], cov:["파트너 15+",LIME], hi:true },
            { brand:"포포즈 (펫닥)", type:"직영 장례식장", online:["앱 예약",LIME], price:["부분 공시","#ffcc44"], ai:["AI 추모","#ffcc44"], cov:["9개 직영점","#ffcc44"], hi:false },
            { brand:"펫포레스트", type:"장례식장", online:["전화 중심","#ff8080"], price:["불투명","#ff8080"], ai:["없음","#ff8080"], cov:["일부","#ffcc44"], hi:false },
          ].map((r,i)=>(
            <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,.05)", background: r.hi ? "rgba(163,223,70,.03)" : "transparent" }}>
              <td style={{ padding:"8px 10px", fontSize:11, color: r.hi ? LIME : MUTED, fontWeight: r.hi?700:400 }}>{r.brand}</td>
              <td style={{ padding:"8px 10px", fontSize:11, color:MUTED }}>{r.type}</td>
              {[r.online,r.price,r.ai,r.cov].map(([t,c],j)=>(
                <td key={j} style={{ padding:"8px 10px" }}>
                  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:99, background:`${c}1A`, color:c, fontSize:10, fontWeight:600 }}>{t}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
      {[["🏅","100항목 현장 실사 인증","실사 항목: 시설 위생, 인력 자격, 서비스 품질, 가격 투명성 등 100항목. 분기별 현장 감사 실시"],
        ["📊","예약 데이터 네트워크 효과","반복 예약 고객 비율 40% 목표. 데이터 기반 개인화 추천으로 재방문율 극대화"],
        ["🔒","전환 비용 (Switching Cost)","디지털 추모관 + 예약 이력 저장 → 재방문율 40% 목표. 한번 사용하면 벗어날 수 없는 생태계"]].map(([ic,t,d])=>(
        <div key={t} style={{ padding:"18px 16px", borderRadius:18, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:10 }}>{ic}</div>
          <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:8 }}>{t}</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.55 }}>{d}</div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide6 = () => (
  <Page pageNum={6} total={TOTAL} bg={BG2}>
    <Label n="05" text="Business Model" />
    <H1 style={{ marginBottom:20 }}>비즈니스 모델</H1>
    <div style={{ display:"flex", alignItems:"center", gap:0, padding:"18px 24px", background:BG3, borderRadius:18, border:"1px solid rgba(255,255,255,.06)", marginBottom:18 }}>
      {[["🐾","반려인 보호자","슬픔 속에서 신뢰할 수 있는\n장례 서비스 탐색",false],
        ["📱","포온 플랫폼","비교·예약·알림·케어\n수수료 수취",true],
        ["🏛️","파트너 장례식장","인증된 합법 장묘업체\n서비스 직접 제공",false]].map(([ic,t,d,hi],i)=>(
        <>
          <div key={t} style={{ flex:1, textAlign:"center", padding:"10px 12px", background: hi ? LIME_DIM : "transparent", border: hi ? `1px solid ${LIME_BDR}` : "none", borderRadius: hi ? 14 : 0 }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{ic}</div>
            <div style={{ fontSize:12, fontWeight:700, color: hi ? LIME : TEXT, marginBottom:2 }}>{t}</div>
            <div style={{ fontSize:10, color:MUTED, lineHeight:1.45, whiteSpace:"pre-line" }}>{d}</div>
          </div>
          {i < 2 && <div style={{ color:LIME, opacity:0.5, fontSize:18, padding:"0 8px" }}>→</div>}
        </>
      ))}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:18 }}>
      {[["65%","중개 수수료","예약 1건당 거래액의 30%",LIME],
        ["10%","프리미엄 노출","월 5~15만원 파트너 구독","#6699ff"],
        ["15%","추모품 커머스","유골함·메모리얼 스톤, 35% 마진","#cc88ff"],
        ["5%","AI 구독","월 9,900원 심리 케어","#ff9944"],
        ["5%","B2B 소개료","동물병원 건당 1~3만원","#ff6699"]].map(([p,t,d,c])=>(
        <div key={t} style={{ padding:"14px 12px", borderRadius:14, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:c }} />
          <div style={{ fontSize:18, fontWeight:900, color:c, marginBottom:4 }}>{p}</div>
          <div style={{ fontSize:10, fontWeight:700, color:TEXT, marginBottom:4 }}>{t}</div>
          <div style={{ fontSize:9, color:MUTED, lineHeight:1.4 }}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{ padding:"16px 20px", background:`linear-gradient(135deg,rgba(163,223,70,.08),rgba(163,223,70,.02))`, border:`1px solid ${LIME_BDR}`, borderRadius:18 }}>
      <div style={{ fontSize:11, fontWeight:700, color:LIME, marginBottom:12 }}>💰 단위 경제 — 평균 거래 1건 기준</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center" }}>
        <div>
          {[["평균 거래금액","600,000원",TEXT],["중개 수수료 (30%)","+ 180,000원",LIME],["추모품","+ 21,000원",LIME],["B2B 소개료","+ 5,000원",LIME],["변동 비용","- 8,000원","#ff7070"]].map(([k,v,c])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,.05)", fontSize:10 }}>
              <span style={{ color:MUTED }}>{k}</span><span style={{ color:c, fontWeight:c!==TEXT?700:400 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:22, color:MUTED }}>=</div>
        <div style={{ textAlign:"center", padding:"16px", background:"rgba(0,0,0,.3)", borderRadius:14 }}>
          <div style={{ fontSize:10, color:MUTED, marginBottom:4 }}>거래당 순기여 마진</div>
          <div style={{ fontSize:28, fontWeight:900, color:LIME, letterSpacing:"-1px" }}>198,000<span style={{ fontSize:12, color:MUTED }}>원</span></div>
        </div>
      </div>
    </div>
  </Page>
);

const Slide7 = () => (
  <Page pageNum={7} total={TOTAL}>
    <Label n="05-1" text="Technology" />
    <H1 style={{ marginBottom:20 }}>기술 우위 & 개발 현황</H1>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
      {[["🌐","웹 + 앱 동시 제공","기존 에이전시는 웹 only. 포온은 Cross-Platform으로 언제 어디서나 접근 가능",LIME],
        ["⚡","3분 예약 완료","전화/방문 대비 10x 빠른 처리. 새벽 임종에도 즉시 예약 가능","#ffcc44"],
        ["🤖","24시간 AI 챗봇","업계 최초 AI 펫로스 케어. 전문 상담사 연결 + 디지털 추모관 제공","#cc88ff"]].map(([ic,t,d,c])=>(
        <div key={t} style={{ padding:"20px 16px", borderRadius:20, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", textAlign:"center" }}>
          <div style={{ fontSize:30, marginBottom:10 }}>{ic}</div>
          <div style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:8 }}>{t}</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.55 }}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div style={{ padding:"16px 18px", borderRadius:16, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize:10, color:LIME, fontWeight:700, marginBottom:12 }}>개발 현황</div>
        {[["웹 MVP","80% 완료 (2026 Q2 런칭)",80,LIME],["iOS/Android 앱","2026 Q4 출시 예정",0,"#6699ff"]].map(([l,s,w,c])=>(
          <div key={l} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:MUTED, marginBottom:4 }}>
              <span>{l}</span><span>{s}</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,.06)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${w}%`, background:c, borderRadius:99 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"16px 18px", borderRadius:16, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ fontSize:10, color:LIME, fontWeight:700, marginBottom:12 }}>Tech Stack</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {["Next.js 16 (Turbopack)","GPT-4 AI 챗봇","SMS + 앱 푸시 알림","Vercel 호스팅","React Native (앱)","AWS (인프라)"].map(t=>(
            <div key={t} style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:MUTED }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:LIME, flexShrink:0, display:"inline-block" }} />{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Page>
);

const Slide8 = () => (
  <Page pageNum={8} total={TOTAL} bg={BG2}>
    <Label n="05-2" text="Social Proof" />
    <H1 style={{ marginBottom:20 }}>사회적 증거 (NPS)</H1>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
      {[["2026","NPS 40+","초기 목표"],
        ["2027","NPS 60+","성장 목표"],
        ["2028","NPS 70+","업계 최고 수준"]].map(([y,n,d])=>(
        <div key={y} style={{ padding:"20px 16px", borderRadius:20, background:`${LIME_DIM}`, border:`1px solid ${LIME_BDR}`, textAlign:"center" }}>
          <div style={{ fontSize:11, color:MUTED, marginBottom:4 }}>{y}년</div>
          <div style={{ fontSize:32, fontWeight:900, color:LIME, letterSpacing:"-1px", marginBottom:4 }}>{n}</div>
          <div style={{ fontSize:10, color:MUTED }}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{ padding:"16px 20px", background:BG3, borderRadius:18, border:"1px solid rgba(255,255,255,.06)" }}>
      <div style={{ fontSize:11, fontWeight:700, color:TEXT, marginBottom:12 }}>NPS (순추천지수)란?</div>
      <div style={{ fontSize:10, color:MUTED, lineHeight:1.8, marginBottom:16 }}>
        NPS는 고객이 해당 서비스를 얼마나 친구나 지인에게 추천할 의향이 있는지를 나타내는 지표입니다. <span style={{ color:LIME }}>0에서 100까지</span> 점수로 표현되며, 점수가 높을수록 고객 충성도와 만족도가 높음을 의미합니다.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        <div style={{ padding:"12px", borderRadius:12, background:"rgba(255,255,255,.04)", textAlign:"center" }}>
          <div style={{ fontSize:16, fontWeight:900, color:"#ff7070" }}>0~39</div>
          <div style={{ fontSize:10, color:MUTED }}>개선 필요</div>
        </div>
        <div style={{ padding:"12px", borderRadius:12, background:"rgba(255,255,255,.04)", textAlign:"center" }}>
          <div style={{ fontSize:16, fontWeight:900, color:"#ffcc44" }}>40~69</div>
          <div style={{ fontSize:10, color:MUTED }}>양호</div>
        </div>
        <div style={{ padding:"12px", borderRadius:12, background:"rgba(255,255,255,.04)", textAlign:"center" }}>
          <div style={{ fontSize:16, fontWeight:900, color:LIME }}>70~100</div>
          <div style={{ fontSize:10, color:MUTED }}>최고 수준</div>
        </div>
      </div>
    </div>
  </Page>
);

const Slide9 = () => (
  <Page pageNum={9} total={TOTAL}>
    <Label n="06" text="Financial Plan" />
    <H1 style={{ marginBottom:20 }}>재무 계획</H1>
    <div style={{ background:BG3, borderRadius:20, border:"1px solid rgba(255,255,255,.06)", marginBottom:18, overflow:"hidden" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            {["구분","1년차","2년차","3년차"].map((h,i)=>(
              <th key={h} style={{ padding:"10px 12px", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color: i===0?MUTED:LIME, textAlign: i===0?"left":"right", background:"rgba(255,255,255,.03)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Row label="월 평균 예약 건수" v1="65건" v2="140건" v3="230건" dim={true} profit={false} />
          <Row label="평균 거래금액" v1="60만원" v2="60만원" v3="60만원" dim={true} profit={false} />
          <Row label="연간 총 거래액" v1="4.68억원" v2="10.08억원" v3="16.56억원" dim={true} profit={false} />
          <Row label="총 플랫폼 수익" v1="1.54억원" v2="3.33억원" v3="5.47억원" dim={false} profit={false} />
          <Row label="총 운영 비용" v1="2.44억원" v2="2.84억원" v3="4.0억원" dim={true} profit={false} />
          <Row label="영업이익" v1="▼ 0.90억원" v2="▲ 0.49억원" v3="▲ 1.47억원" dim={false} profit={true} />
        </tbody>
      </table>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
      <div style={{ padding:"18px 20px", borderRadius:18, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontSize:10, color:MUTED, marginBottom:6 }}>손익분기점 (BEP)</div>
        <div style={{ fontSize:20, fontWeight:900, color:TEXT }}>월 <span style={{ color:LIME }}>약 103건</span></div>
        <div style={{ fontSize:10, color:MUTED, marginTop:4 }}>구독·B2B·추모품 수익 포함 시</div>
      </div>
      <div style={{ padding:"18px 20px", borderRadius:18, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ fontSize:10, color:MUTED, marginBottom:6 }}>BEP 예상 시점</div>
        <div style={{ fontSize:18, fontWeight:900, color:TEXT }}>개시 후 <span style={{ color:LIME }}>18~24개월</span></div>
        <div style={{ fontSize:10, color:MUTED, marginTop:4 }}>2028년 상반기 목표</div>
      </div>
    </div>
    <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:12 }}>Seed 7,000만원 사용 계획</div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
      {[["2,800만원","플랫폼 개발 (MVP + 앱)","40%"],["1,500만원","초기 마케팅 (6개월)","21%"],["1,500만원","운영 준비금 (6개월)","21%"],["400만원","브랜드 디자인 (CI/BI)","6%"],["300만원","파트너십 구축","4%"],["500만원","법인 설립 + 법무 + 예비비","7%"]].map(([a,d,p])=>(
        <div key={a} style={{ display:"flex", gap:10, padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:900, color:LIME, whiteSpace:"nowrap" }}>{a}</div>
          <div>
            <div style={{ fontSize:10, color:TEXT }}>{d}</div>
            <div style={{ fontSize:9, color:MUTED }}>{p}</div>
          </div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide10 = () => (
  <Page pageNum={10} total={TOTAL} bg={BG2}>
    <Label n="06-1" text="KPI" />
    <H1 style={{ marginBottom:20 }}>핵심 성과 지표 (KPI)</H1>
    <div style={{ overflowX:"auto", marginBottom:20 }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            {["KPI","2026","2027","2028"].map((h,i)=>(
              <th key={h} style={{ padding:"8px 12px", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:i===0?MUTED:LIME, textAlign:i===0?"left":"right", background:"rgba(255,255,255,.03)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[["MAU (월간 활성 사용자)","2,000","8,000","20,000",true],
            ["예약 전환율","3%","5%","7%",false],
            ["NPS (순추천지수)","40+","60+","70+",false],
            ["파트너 장례식장 수","15+","40+","80+",false],
            ["구독자 (AI 케어)","200","800","2,000",false]].map(([l,v1,v2,v3,hi])=>(
            <tr key={l} style={{ borderBottom:"1px solid rgba(255,255,255,.04)", background:hi?"rgba(255,255,255,.02)":"transparent" }}>
              <td style={{ padding:"8px 12px", fontSize:11, color:hi?TEXT:MUTED, fontWeight:hi?500:400 }}>{l}</td>
              {[v1,v2,v3].map((v,i)=><td key={i} style={{ padding:"8px 12px", textAlign:"right", fontSize:11, color:LIME, fontWeight:700 }}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
      {[["🔄","목표 재방문율","40%+"],["⭐","고객 만족도","4.5/5"],["📱","앱 설치 목표","5만+"],["📅","월간 예약 목표","500건+"]].map(([ic,l,v])=>(
        <div key={l} style={{ padding:"14px 12px", borderRadius:14, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", textAlign:"center" }}>
          <div style={{ fontSize:20, marginBottom:6 }}>{ic}</div>
          <div style={{ fontSize:16, fontWeight:900, color:TEXT, marginBottom:4 }}>{v}</div>
          <div style={{ fontSize:10, color:MUTED }}>{l}</div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide11 = () => (
  <Page pageNum={11} total={TOTAL}>
    <Label n="07" text="Roadmap" />
    <H1 style={{ marginBottom:24 }}>실행 로드맵</H1>
    <div style={{ position:"relative", paddingLeft:40 }}>
      <div style={{ position:"absolute", left:16, top:0, bottom:0, width:2, background:`linear-gradient(180deg,${LIME},rgba(163,223,70,.1))` }} />
      {[
        ["2026 Q2~Q3","창업 및 MVP 런칭","법인 설립, 브랜드 등록 / 웹 MVP 베타 오픈 / 파트너 장례식장 15곳 계약","active"],
        ["2026 Q4","앱 출시 + 추모관","iOS/Android 앱 런칭 / 디지털 추모관 서비스 / 동물병원 제휴 30곳","planned"],
        ["2027 Q1~Q2","AI 서비스 + B2B","AI 펫로스 케어 챗봇 출시 / 동물병원 B2B 포털 / 보험사 제휴 1곳+","planned"],
        ["2027 Q3~Q4","지역 확장 + BEP 도달","인천·경기 북부 파트너 확대 / 월 180건+, BEP 근접 / 구독자 500명+","planned"],
        ["2028 이후","전국 스케일업","전국 5대 도시 확장 / 시리즈 A 15~30억원 / 일본 시장 파일럿 검토","future"],
      ].map(([q,t,d,s],i)=>(
        <div key={i} style={{ display:"flex", gap:16, marginBottom:16, position:"relative", alignItems:"flex-start" }}>
          <div style={{ position:"absolute", left:-32, top:6, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, border:"2px solid", boxSizing:"border-box", flexShrink:0,
            background: s==="active" ? LIME : BG2,
            color: s==="active" ? "#0D0D14" : MUTED,
            borderColor: s==="active" ? LIME : "rgba(255,255,255,.2)",
            boxShadow: s==="active" ? `0 0 16px rgba(163,223,70,.4)` : "none" }}>
            {i+1}
          </div>
          <div style={{ flex:1, padding:"12px 16px", borderRadius:14, background: s==="active" ? "rgba(163,223,70,.08)" : "rgba(255,255,255,.03)", border: s==="active" ? `1px solid ${LIME_BDR}` : "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ fontSize:9, fontWeight:700, color:LIME, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>{q}</div>
            <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:4 }}>{t}</div>
            <div style={{ fontSize:10, color:MUTED, lineHeight:1.55 }}>{d}</div>
          </div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide12 = () => (
  <Page pageNum={12} total={TOTAL} bg={BG2}>
    <Label n="08" text="Customer Persona" />
    <H1 style={{ marginBottom:8 }}>타겟 고객 (Persona)</H1>
    <p style={{ fontSize:11, color:MUTED, marginBottom:24 }}>창업 초기 핵심 타겟 고객 3가지 유형</p>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
      {[["💔","슬픔의 동반자","30-45세 · 중산층","정보 부재로 인한 판단 능력 상실. 여러 곳에 전화해야 하는 번거로움.","투명 가격 비교 + 실시간 예약 시스템"],
        ["✨","명예로운 이별 추구자","25-35세 · 고학력","품질 불균일로 인한 신뢰 부족. 서비스 수준 사전 파악 방법 없음.","100항목 인증 파트너 + 실시간 진행 알림"],
        ["📱","실용주의자","35-55세 · 비용 효율 중시","가격 불투명 + 전화/방문 필요. 새벽 임종 시 대응 어려움.","3분 앱 예약 + 비교 플랫폼"]].map(([ic,nm,ag,pain,sol])=>(
        <div key={nm} style={{ padding:"18px 16px", borderRadius:20, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ fontSize:28 }}>{ic}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:TEXT }}>{nm}</div>
              <div style={{ fontSize:10, color:MUTED }}>{ag}</div>
            </div>
          </div>
          <div style={{ fontSize:9, color:"#ff7070", fontWeight:700, marginBottom:4 }}>Pain Point</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.5, marginBottom:10 }}>{pain}</div>
          <div style={{ fontSize:9, color:LIME, fontWeight:700, marginBottom:4 }}>How We Solve</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.5 }}>{sol}</div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide13 = () => (
  <Page pageNum={13} total={TOTAL}>
    <Label n="09" text="Team" />
    <H1 style={{ marginBottom:8 }}>필요 팀 구성</H1>
    <p style={{ fontSize:11, color:MUTED, marginBottom:20 }}>창업 초기 핵심 6인 체제로 운영하며, 개발은 외주 에이전시와 협업합니다.</p>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:20 }}>
      {[["👤","CEO","대표","전략·파트너십·투자 유치. 반려동물 업계 또는 스타트업 경험 보유자."],
        ["💻","CTO","기술 책임","플랫폼 설계·외주 관리. 풀스택 5년+ 또는 스타트업 CTO 경험."],
        ["📣","CMO","마케팅 책임","퍼포먼스 마케팅·SNS·콘텐츠. 디지털 광고 3년+ 경험."],
        ["🤝","COO","운영·CS 리드","파트너 관리·고객 응대. 서비스업 또는 O2O 운영 경험."]].map(([ic,r,n,d])=>(
        <div key={r} style={{ padding:"18px 16px", borderRadius:20, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", textAlign:"center" }}>
          <div style={{ width:48, height:48, borderRadius:14, background:LIME_DIM, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 10px" }}>{ic}</div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:LIME, marginBottom:2 }}>{r}</div>
          <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:6 }}>{n}</div>
          <div style={{ fontSize:10, color:MUTED, lineHeight:1.5 }}>{d}</div>
        </div>
      ))}
    </div>
  </Page>
);

const Slide14 = () => (
  <Page pageNum={14} total={TOTAL} bg={BG2}>
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:680, textAlign:"center", position:"relative" }}>
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(163,223,70,.08) 0%,transparent 70%)", filter:"blur(60px)", pointerEvents:"none" }} />
      <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:LIME, fontWeight:700, marginBottom:20 }}>10 / Business Plan</div>
      <div style={{ fontSize:64, fontWeight:900, letterSpacing:"-2px", lineHeight:1.1, marginBottom:16 }}>
        <span style={{ color:TEXT }}>사업</span><span style={{ color:LIME }}>계획</span><span style={{ color:TEXT }}>서</span>
      </div>
      <p style={{ fontSize:14, color:MUTED, marginBottom:36 }}>포온과 함께 반려동물 장례 시장을 바꿉니다</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:40, width:560 }}>
        {[["📧","이메일","contact@poon.co.kr"],["🏢","회사명","포온 (Po-On)"],["📍","서비스 지역","서울·경기 관내"]].map(([ic,l,v])=>(
          <div key={l} style={{ padding:"14px 12px", borderRadius:16, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", textAlign:"center" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{ic}</div>
            <div style={{ fontSize:10, color:MUTED, marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:11, fontWeight:700, color:TEXT }}>{v}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize:9, color:"rgba(255,255,255,.2)", marginTop:28 }}>본 투자 제안서는 내부 검토 및 투자 유치용입니다. 모든 수치는 추정치이며 실제 결과와 다를 수 있습니다.</p>
    </div>
  </Page>
);

export default function PrintPage() {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#print-root) { display: none !important; }
          #print-root { display: block !important; }
          .poon-page { width: 297mm !important; min-height: 210mm !important; page-break-after: always; break-after: page; }
          @page { size: A4 landscape; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        #print-root { display: block; }
        body { margin: 0; padding: 0; background: #1a1a2e; }
      `}</style>

      <div id="print-root" style={{ background:"#1a1a2e", minHeight:"100vh", padding:"0 24px 24px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"24px", width:"100%", maxWidth:"1122px" }}>
          <Slide1 />
          <Slide2 />
          <Slide3 />
          <Slide4 />
          <Slide5 />
          <Slide6 />
          <Slide7 />
          <Slide8 />
          <Slide9 />
          <Slide10 />
          <Slide11 />
          <Slide12 />
          <Slide13 />
          <Slide14 />
        </div>
      </div>
    </>
  );
}
