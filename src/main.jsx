import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, Plus, X, Check, ChevronRight, RotateCcw, Utensils, Coffee, Compass, Film, Shuffle, Clock, Trash2 } from 'lucide-react';
import { pickOption } from './pick';
import { readHistory, readDraft, HISTORY_KEY, DRAFT_KEY } from './storage';
import './style.css';
const presets = [
 { title: '오늘 뭐 먹지?', sub: '메뉴 고민은 여기까지', icon: Utensils, color: 'orange', options: ['파스타', '초밥', '쌀국수', '샐러드'] },
 { title: '커피 한 잔?', sub: '오늘의 한 잔을 골라봐요', icon: Coffee, color: 'brown', options: ['아메리카노', '카페라테', '콜드브루', '말차라테'] },
 { title: '주말에 뭐 하지?', sub: '작은 새로운 경험', icon: Compass, color: 'green', options: ['공원 산책', '전시 보러 가기', '동네 카페 탐방', '집에서 쉬기'] },
 { title: '오늘 뭐 볼까?', sub: '취향 따라, 기분 따라', icon: Film, color: 'purple', options: ['코미디', '로맨스', '스릴러', '다큐멘터리'] },
];
function App() {
 const [tab, setTab] = useState('pick');
 const [draft] = useState(() => { try { return readDraft(localStorage); } catch { return { title: '', options: ['', ''] }; } });
 const [options, setOptions] = useState(draft.options);
 const [title, setTitle] = useState(draft.title);
 const [error, setError] = useState('');
 const [result, setResult] = useState(null);
 const [history, setHistory] = useState(() => { try { return readHistory(localStorage); } catch { return []; } });
 const [storageError, setStorageError] = useState(false);
 const [accepted, setAccepted] = useState(null);
 const [draftError, setDraftError] = useState(false);
 const pickerButton = useRef(null);
 const [dataNotice, setDataNotice] = useState('');
 const topicInput = useRef(null);
 const background = useRef(null);
 const modalOpen = result !== null;
 useEffect(() => {
   try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, options })); setDraftError(false); }
   catch { setDraftError(true); }
 }, [title, options]);
 useEffect(() => {
   if (!modalOpen) return;
   const previousOverflow = document.body.style.overflow;
   document.body.style.overflow = 'hidden';
   const node = background.current;
   if (node) node.inert = true;
   return () => {
     document.body.style.overflow = previousOverflow;
     if (node) node.inert = false;
     pickerButton.current?.focus({ preventScroll: true });
   };
 }, [modalOpen]);
 const valid = options.filter(x => x.trim());
 function startNew() {
   setOptions(['', '']); setTitle(''); setError(''); setAccepted(null);
   topicInput.current?.focus();
 }
 function accept() { setAccepted(result); setResult(null); }
 function clearAllData() {
   if (!window.confirm('작성 중인 선택지와 모든 선택 기록을 지울까요?')) return;
   try {
     localStorage.removeItem(HISTORY_KEY);
     localStorage.removeItem(DRAFT_KEY);
     setHistory([]); setTitle(''); setOptions(['', '']); setAccepted(null);
     setStorageError(false); setDataNotice('이 기기에 저장된 선택지와 기록을 삭제했어요.');
   } catch { setDataNotice('저장소에 접근할 수 없어 데이터 삭제를 완료하지 못했어요.'); }
 }
 function save(next) { setHistory(next); try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); } }
 function choose() { try { const selected = pickOption(options); setResult(selected); setAccepted(null); setError(''); save([{ result: selected, title: title || '나만의 선택', date: new Date().toISOString(), id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }, ...history].slice(0, 20)); } catch(e) { setError(e.message); } }
 function usePreset(preset) { setAccepted(null); setTitle(preset.title); setOptions(preset.options); setError(''); setTab('pick'); document.getElementById('picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
 return <div className="app-shell">
  <div ref={background}><header className="header"><a className="brand" href="#" onClick={e => { e.preventDefault(); setTab('pick'); }}><span className="brand-mark"><Shuffle size={20}/></span>골라줘<span className="brand-dot">.</span></a><nav aria-label="주 메뉴"><button aria-current={tab === 'pick' ? 'page' : undefined} className={tab === 'pick' ? 'active' : ''} onClick={() => setTab('pick')}>선택하기</button><button aria-current={tab === 'history' ? 'page' : undefined} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>내 선택 기록</button></nav><span className="header-note">작은 선택, 가벼운 하루</span></header>
  <main>{tab === 'pick' ? <>
   <section className="intro"><span className="eyebrow"><span/> A LITTLE LESS OVERTHINKING</span><h1>고민은 줄이고,<br/>하루는 <span>가볍게.</span></h1><p>점심 메뉴부터 주말 계획까지.<br/>선택이 어려운 순간, 우리가 하나 골라드릴게요.</p></section>
   <section className="workspace">
    <div className="picker card" id="picker"><div className="section-label"><span className="small-icon"><Shuffle size={17}/></span>나만의 선택<span className="step">01 — PICK</span></div><h2>무엇을 골라드릴까요?</h2><p className="muted">마음에 떠오르는 선택지를 적어주세요.</p><label className="topic-label" htmlFor="topic">고민의 제목 <span>선택</span></label><input className="topic" id="topic" ref={topicInput} placeholder="예: 오늘 점심은 뭘 먹을까?" value={title} maxLength={60} onChange={e => setTitle(e.target.value)}/><div className="options-label"><span>선택지</span><span>{valid.length} / 8</span></div><div className="options">{options.map((option, index) => <div className="option" key={index}><span className="number">{String(index + 1).padStart(2, '0')}</span><input aria-label={`선택지 ${index + 1}`} placeholder={index === 0 ? '첫 번째 선택지' : index === 1 ? '두 번째 선택지' : '다른 선택지'} value={option} maxLength={80} onChange={e => setOptions(options.map((v, i) => i === index ? e.target.value : v))}/>{options.length > 2 && <button aria-label={`선택지 ${index + 1} 삭제`} onClick={() => setOptions(options.filter((_, i) => i !== index))}><X size={16}/></button>}</div>)}</div><button className="add-option" disabled={options.length >= 8} onClick={() => setOptions([...options, ''])}><Plus size={16}/>선택지 추가하기</button>{error && <p className="error" role="alert">{error}</p>}<button ref={pickerButton} className="pick-button" onClick={choose}>하나 골라줘<ArrowRight size={19}/></button><p className="privacy">모든 선택지는 같은 확률로 골라져요.</p>{accepted && <div className="accepted" role="status"><span className="accepted-label"><Check size={15}/>이번 선택</span><strong>{accepted}</strong><button onClick={startNew}>새로운 고민 시작하기<ArrowRight size={16}/></button></div>}{!accepted && <button className="reset-draft" onClick={startNew}>새로 시작하기</button>}</div>
    <aside className="side"><div className="quote-card"><div className="quote-top">LESS THINKING, MORE LIVING<ArrowUpRight size={19}/></div><div className="note-scene" aria-hidden="true"><div className="paper paper-back"/><div className="paper paper-front"><span>NOTE TO SELF</span><strong>가볍게 골라도<br/>괜찮아.</strong><span className="paper-check">✓</span></div></div><h2>완벽한 선택보다,<br/>기분 좋은 시작.</h2><p>때로는 가볍게 고른 하나가<br/>생각보다 좋은 하루를 만들어줘요.</p><div className="quote-bottom"><span>조금 더 가볍게 살아가기</span><span>↗</span></div></div><div className="mini-note"><span className="note-icon"><Check size={18}/></span><div><strong>고민은 여기 두고 가세요.</strong><p>선택 기록은 이 기기에만 저장돼요.</p></div></div></aside>
   </section>
   <section className="presets"><div className="preset-heading"><div><span className="eyebrow">EVERYDAY PICKS</span><h2>이런 고민, 자주 하잖아요.</h2></div><span className="preset-hint">가볍게 눌러 시작해 보세요<ArrowUpRight size={16}/></span></div><div className="preset-grid">{presets.map(preset => <button className="preset card" key={preset.title} onClick={() => usePreset(preset)}><span className={`preset-icon ${preset.color}`}><preset.icon size={22} strokeWidth={1.6}/></span><h3>{preset.title}</h3><p>{preset.sub}</p><ChevronRight className="preset-arrow" size={18}/></button>)}</div></section>
  </> : tab === 'history' ? <section className="history-view"><span className="eyebrow">YOUR LITTLE DECISIONS</span><h1>지나온 선택들.</h1><p className="muted">가볍게 고른 순간을 모아봤어요. 최근 20개까지 보관해요.</p>{history.length ? <><button className="clear" onClick={() => { if (window.confirm('저장된 선택 기록을 모두 지울까요?')) save([]); }}><Trash2 size={15}/>기록 모두 지우기</button><div className="history-list">{history.map((item, index) => <article className="card history-item" key={item.id || index}><span className="history-icon"><Clock size={20}/></span><div><p>{item.title}</p><h2>{item.result}</h2></div><time>{new Date(item.date).toLocaleDateString('ko-KR')}</time></article>)}</div></> : <div className="empty card"><Clock size={32}/><h2>아직 선택 기록이 없어요.</h2><p>첫 번째 고민을 가볍게 내려놓아 볼까요?</p><button className="pick-button" onClick={() => setTab('pick')}>첫 선택 하러 가기<ArrowRight size={18}/></button></div>}</section> : <section className="about-view"><span className="eyebrow">ABOUT YOUR PICKS</span><h1>가볍게 고르고,<br/>안심하고 쓰세요.</h1><article className="card about-card"><h2>어떻게 골라주나요?</h2><p>입력한 선택지 중 하나를 같은 확률로 무작위 선택해요. 취향 분석이나 AI 추천은 사용하지 않아요. 다시 고르면 같은 결과가 나올 수도 있어요.</p><h2>무엇을 저장하나요?</h2><p>작성 중인 고민의 제목과 선택지, 최근 20개 선택 결과와 선택 시각을 이 기기의 브라우저 저장소에 저장해요. 앱을 다시 열면 작성 중인 내용을 이어서 쓸 수 있어요.</p><h2>다른 곳으로 보내나요?</h2><p>선택 내용과 기록을 별도 서버로 전송하지 않아요. 로그인, 광고, 분석 기능은 현재 사용하지 않으며, 기록을 다른 기기와 동기화하지 않아요.</p><h2>언제까지 남아 있나요?</h2><p>직접 삭제하거나 브라우저·앱의 저장소가 초기화될 때까지 남아 있어요. 토스 앱 또는 기기 환경에 따라 기록이 유지되지 않을 수 있어요.</p><h2>어떻게 지우나요?</h2><p>입력 화면의 ‘새로 시작하기’는 작성 중인 선택지를, ‘내 선택 기록’의 ‘기록 모두 지우기’는 결과 기록을 지워요. 아래 버튼으로 둘 다 지울 수도 있어요.</p><button className="delete-all" onClick={clearAllData}><Trash2 size={17}/>선택지와 기록 모두 지우기</button>{dataNotice && <p className="data-notice" role="status">{dataNotice}</p>}<p className="about-version">골라줘 · 버전 0.1.0</p></article></section>}
  {draftError && <p role="status" className="error">입력 내용을 저장할 수 없어 앱을 닫으면 작성 중인 선택지가 사라져요.</p>}
  {storageError && <p role="status" className="error">브라우저 저장 공간을 사용할 수 없어 이번 기록은 앱을 닫으면 사라져요.</p>}
  <footer><span className="footer-brand">골라줘.</span><span>당신의 하루에, 조금의 여유를.</span><button className="about-link" aria-current={tab === 'about' ? 'page' : undefined} onClick={() => { setTab('about'); setDataNotice(''); window.scrollTo({ top: 0, behavior: 'instant' }); }}>앱·개인정보 안내</button><span className="footer-end">MADE FOR YOUR EVERYDAY</span></footer></main></div>
  {result && <div className="modal-backdrop" onClick={() => setResult(null)}><section className="result-modal card" role="dialog" aria-modal="true" aria-labelledby="result-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if(e.key === 'Escape') setResult(null); if(e.key === 'Tab') { const buttons = e.currentTarget.querySelectorAll('button'); const first = buttons[0]; const last = buttons[buttons.length - 1]; if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}><button autoFocus className="close-modal" aria-label="결과 닫기" onClick={() => setResult(null)}><X size={22}/></button><span className="result-check"><Check size={30}/></span><span className="eyebrow">YOUR PICK</span><p>{title || '오늘의 선택은'}</p><h2 id="result-title">{result}</h2><p className="muted">오늘은 이걸로 가볍게 시작해 봐요.</p><button className="pick-button" onClick={accept}>좋아, 이걸로 할래<Check size={18}/></button><button className="retry" onClick={choose}><RotateCcw size={16}/>한 번 더 골라보기</button></section></div>}
 </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
