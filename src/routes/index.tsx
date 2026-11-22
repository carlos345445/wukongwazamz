import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { formatOfferCountdown, OFFER_DURATION_SECONDS } from "@/lib/offer-countdown";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://yourimageshare.com" },
      { rel: "dns-prefetch", href: "//yourimageshare.com" },
    ],
    meta: [
      { title: "WukongWaza | Hack Free Fire" },
      {
        name: "description",
        content: "O HACK DE FREE FIRE QUE OS PRINCIPAIS INFLUENCERS DO MOMENTO USAM EM SEGREDO ACABA DE SER VAZADO.",
      },
      { property: "og:title", content: "WukongWaza | Hack Free Fire" },
      {
        property: "og:description",
        content: "O HACK DE FREE FIRE QUE OS PRINCIPAIS INFLUENCERS DO MOMENTO USAM EM SEGREDO ACABA DE SER VAZADO.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPauseGif, setShowPauseGif] = useState(false);
  const [showReloadNotice, setShowReloadNotice] = useState(false);
  const [showEndedNotice, setShowEndedNotice] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showPurchaseButton, setShowPurchaseButton] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(false);
  const savedVideoTimeKey = "wukongwaza-vsl-current-time";
  const soundPromptSeenKey = "wukongwaza-sound-prompt-seen";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (openFaq === null) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (faqRef.current && !faqRef.current.contains(event.target as Node)) {
        setOpenFaq(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [openFaq]);
  const [secondsLeft, setSecondsLeft] = useState(OFFER_DURATION_SECONDS);

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    // Pause immediately when playing; unmute only when the user resumes playback.
    if (!video.paused) {
      video.pause();
      return;
    }

    if (video.muted) video.muted = false;
    void video.play();
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = Number(localStorage.getItem(savedVideoTimeKey) || 0);
    const hasSavedProgress = Number.isFinite(savedTime) && savedTime > 1;

    if (!hasSavedProgress && !localStorage.getItem(soundPromptSeenKey)) {
      setShowSoundPrompt(true);
    }

    // If the visitor has already started this VSL, offer to resume or restart
    // whenever they return, regardless of whether the page was reloaded or reopened.
    if (hasSavedProgress) {
      video.pause();
      setShowPauseGif(false);
      setShowReloadNotice(true);
      return;
    }

    // First visit (or no saved progress): try muted autoplay.
    video.muted = true;
    const attemptAutoplay = () => {
      if (document.visibilityState === "hidden" || !video.paused) return;
      const playRequest = video.play();
      if (playRequest) {
        void playRequest.catch(() => {
          setShowPauseGif(true);
        });
      }
    };

    video.addEventListener("canplay", attemptAutoplay);
    video.addEventListener("loadeddata", attemptAutoplay);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      attemptAutoplay();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") attemptAutoplay();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("canplay", attemptAutoplay);
      video.removeEventListener("loadeddata", attemptAutoplay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(0, OFFER_DURATION_SECONDS - elapsedSeconds));
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-background pt-10 uppercase" aria-label="Wukong Waza">
      <div className="fixed inset-x-0 top-0 z-[1000] flex flex-col gap-0 border-0 bg-header p-0 shadow-none">
        <header
          className="relative m-0 flex h-5 items-center justify-center border-0 p-0 overflow-hidden whitespace-nowrap bg-header px-2 font-headline text-[11px] font-bold leading-none text-header-foreground shadow-none outline-none sm:text-[13px]"
          aria-label="Oferta especial"
        >
          HACK LIBERADO&nbsp;|&nbsp;DE:&nbsp;<s>647 MT</s>&nbsp;POR:&nbsp;
          <strong className="text-offer-highlight">347 MT</strong>
        </header>
        <header
          className="relative m-0 flex h-5 items-center justify-center border-0 p-0 overflow-hidden whitespace-nowrap bg-header px-2 font-headline text-[9px] font-bold leading-none text-header-foreground shadow-none outline-none sm:text-[11px]"
          aria-label="Tempo restante da oferta"
        >
          - OFERTA ACABA HOJE - TEMPO RESTANTE: {formatOfferCountdown(secondsLeft)} -
        </header>
      </div>
      <img
        src="/wukongwaza_logo.png"
        alt="Wukong Waza"
        className="mx-auto mt-4 h-auto w-full max-w-24"
      />
      <h1 className="mx-auto mt-4 w-full max-w-[1200px] px-2 text-center font-display font-black tracking-tight leading-[1.15] text-foreground">
        <span className="grid gap-0.5 text-[clamp(10px,3.2vw,18px)] lg:hidden">
          <span className="block whitespace-nowrap">
            O <strong className="text-header">HACK DE FREE FIRE</strong> QUE OS
          </span>
          <span className="block whitespace-nowrap">
            <strong>PRINCIPAIS INFLUENCERS</strong> DO MOMENTO <strong>USAM</strong>
          </span>
          <span className="block whitespace-nowrap">
            <strong>EM SEGREDO</strong> <strong className="text-header">ACABA DE SER VAZADO.</strong>
          </span>
        </span>
        <span className="hidden text-[clamp(12px,1.9vw,22px)] lg:block">
          <span className="block whitespace-nowrap">
            O <strong className="text-header">HACK DE FREE FIRE</strong> QUE OS <strong>PRINCIPAIS INFLUENCERS</strong>
          </span>
          <span className="block whitespace-nowrap">
            DO MOMENTO USAM <strong>EM SEGREDO</strong> <strong className="text-header">ACABA DE SER VAZADO.</strong>
          </span>
        </span>
      </h1>
      <p className="mx-auto mt-2 w-full max-w-[720px] px-3 text-center text-[11px] font-bold leading-[1.5] text-[#858585] [text-wrap:balance] sm:px-4 sm:text-[13px]">
        Um método oficial da Garena que não dá ban, que um influenciador acabou de vazar e muitas pessoas ainda não sabem, por isso veja agora antes que seja retirado do ar.
      </p>
      <div
        className="relative mx-auto mt-5 aspect-[9/16] w-[min(88vw,360px)] overflow-hidden rounded-lg border border-[#333333] bg-black"
        aria-label="Vídeo VSL"
        onContextMenu={(event) => event.preventDefault()}
      >
        <video
          ref={videoRef}
          src="https://yourimageshare.com/ib/pzc214sqhh.mp4"
          className="absolute inset-0 h-full w-full cursor-pointer object-contain"
          autoPlay
          muted
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          onClick={toggleVideoPlayback}
          onPlay={() => {
            setShowPauseGif(false);
            setShowReloadNotice(false);
            setShowEndedNotice(false);
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (Number.isFinite(video.duration) && video.duration > 0) {
              setVideoProgress((video.currentTime / video.duration) * 100);
            }
            setShowPurchaseButton(video.currentTime >= 63);
            if (!showReloadNotice && video.currentTime > 1) {
              localStorage.setItem(savedVideoTimeKey, String(video.currentTime));
            }
          }}
          onPause={(event) => {
            setShowPauseGif(true);
            const video = event.currentTarget;
            if (!showReloadNotice && video.currentTime > 1 && !video.ended) {
              localStorage.setItem(savedVideoTimeKey, String(video.currentTime));
            }
          }}
          onEnded={() => {
            localStorage.removeItem(savedVideoTimeKey);
            setVideoProgress(100);
            setShowPauseGif(false);
            setShowEndedNotice(true);
          }}
        />
        {showSoundPrompt && !showReloadNotice && !showEndedNotice && (
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              localStorage.setItem(soundPromptSeenKey, "true");
              setShowSoundPrompt(false);
              if (video) {
                video.currentTime = 0;
                video.muted = false;
                setVideoProgress(0);
                setShowPurchaseButton(false);
                localStorage.removeItem(savedVideoTimeKey);
                void video.play().catch(() => {
                  setShowPauseGif(true);
                });
              }
            }}
            aria-label="CLIQUE PARA ATIVAR O SOM DO VÍDEO"
            className="absolute inset-0 z-40 flex cursor-pointer items-center justify-center bg-transparent px-5 text-center opacity-[0.98]"
          >
            <span className="flex w-fit max-w-full flex-row items-center gap-2 rounded-md border border-white/90 bg-[#B30000]/[0.98] px-3 py-2 text-left text-white">
              <span className="flex min-w-0 flex-col items-start justify-center gap-0.5 opacity-[0.98]">
                <span className="whitespace-nowrap font-inter text-[11px] font-extrabold leading-tight tracking-[0.01em] text-white sm:text-xs">
                  O SEU VÍDEO JÁ COMEÇOU
                </span>
                <span className="whitespace-nowrap font-inter text-[10px] font-extrabold leading-tight tracking-[0.01em] text-white sm:text-[11px]">
                  CLIQUE PARA ATIVAR O SOM
                </span>
              </span>
              <svg viewBox="0 0 24 24" className="h-10 w-10 shrink-0 self-center fill-none stroke-current opacity-[0.98]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            </span>
          </button>
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[8px]">
          <div className="h-full bg-[#B30000] transition-[width] duration-200 ease-linear" style={{ width: `${videoProgress}%` }} />
        </div>
        {showEndedNotice && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-1 bg-[#5A0000]/75 px-2 text-center">
            <p className="whitespace-nowrap normal-case font-display text-[10px] font-bold leading-none text-white sm:text-sm">
              VOCÊ JÁ COMEÇOU A ASSISTIR ESTE VÍDEO
            </p>
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                const restart = () => {
                  video.currentTime = 0;
                  video.muted = false;
                  localStorage.removeItem(savedVideoTimeKey);
                  setVideoProgress(0);
                  setShowEndedNotice(false);
                  setShowPauseGif(false);
                  void video.play();
                };
                if (video.readyState >= HTMLMediaElement.HAVE_METADATA) restart();
                else video.addEventListener("loadedmetadata", restart, { once: true });
              }}
              className="inline-flex flex-none items-center justify-center gap-1 whitespace-nowrap bg-transparent px-1 py-1 font-display text-[10px] font-bold text-white transition-opacity hover:opacity-75 sm:text-xs"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.2 8.2A8.5 8.5 0 1 1 4 13" /><path d="M4.2 3.5v4.8H9" /><path d="M12 7.5v4.8l3 1.8" /></svg>
              ASSISTIR DO INÍCIO
            </button>
          </div>
        )}
        {showReloadNotice && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-[#5A0000]/75 px-2 text-center">
            <p className="whitespace-nowrap normal-case font-display text-[10px] font-bold leading-none text-white sm:text-sm">
              VOCÊ JÁ COMEÇOU A ASSISTIR ESTE VÍDEO
            </p>
            <div className="flex w-fit max-w-full flex-col flex-nowrap items-center justify-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  const restart = () => {
                    video.currentTime = 0;
                    localStorage.setItem(savedVideoTimeKey, "0");
                    video.muted = false;
                    setShowReloadNotice(false);
                    setShowPauseGif(false);
                    void video.play();
                  };
                  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) restart();
                  else video.addEventListener("loadedmetadata", restart, { once: true });
                }}
                className="inline-flex flex-none items-center justify-center gap-0.5 whitespace-nowrap bg-transparent px-0.5 py-1 font-display text-[10px] font-bold leading-none text-white transition-opacity hover:opacity-75 sm:gap-1 sm:text-xs"
              >
<svg width="16" height="16" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-none stroke-current sm:h-3.5 sm:w-3.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.2 8.2A8.5 8.5 0 1 1 4 13" /><path d="M4.2 3.5v4.8H9" /><path d="M12 7.5v4.8l3 1.8" /></svg>
                ASSISTIR DO INÍCIO
              </button>
              <button
                type="button"
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  const savedTime = Number(localStorage.getItem(savedVideoTimeKey) || 0);
                  const resume = () => {
                    video.currentTime = Number.isFinite(savedTime) ? savedTime : 0;
                    video.muted = false;
                    setShowReloadNotice(false);
                    setShowPauseGif(false);
                    void video.play();
                  };
                  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) resume();
                  else video.addEventListener("loadedmetadata", resume, { once: true });
                }}
                className="inline-flex flex-none items-center justify-center gap-0.5 whitespace-nowrap bg-transparent px-0.5 py-1 font-display text-[10px] font-bold leading-none text-white transition-opacity hover:opacity-75 sm:gap-1 sm:text-xs"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-none stroke-current sm:h-3.5 sm:w-3.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>
                CONTINUAR ASSISTINDO
              </button>
            </div>
          </div>
        )}
        {showPauseGif && !showReloadNotice && !showEndedNotice && (
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label="Reproduzir vídeo"
            className="absolute inset-0 z-10 cursor-pointer"
          >
            <img
              src="/video-pause-message.gif"
              alt="Clique para retomar o vídeo"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className="pointer-events-none h-full w-full select-none bg-black object-contain"
            />
          </button>
        )}
        {showPauseGif && !showEndedNotice && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleVideoPlayback();
            }}
            aria-label="Retomar vídeo"
            title="Retomar vídeo"
            className="absolute bottom-1 left-1 z-20 flex h-10 w-10 items-center justify-center bg-transparent text-white opacity-90 transition-opacity hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 5.5v13l10-6.5z" />
            </svg>
          </button>
        )}
      </div>
      <div className="mx-auto mt-3 h-12 w-[min(88vw,360px)]">
        <a
          href="https://pay.bicaju.com/16f3b1a9-e2fd-4194-a9e4-87cff44dfa62"
          target="_blank"
          rel="noopener noreferrer"
          aria-hidden={!showPurchaseButton}
          tabIndex={showPurchaseButton ? 0 : -1}
          className={`cta-pulse relative isolate flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-[#FF1A1A] to-[#B30000] px-4 text-center font-display text-base font-extrabold text-white transition-transform duration-150 active:scale-[0.98] ${showPurchaseButton ? "visible" : "invisible pointer-events-none"}`}
        >
          <span className="relative z-10">QUERO O HACK AGORA</span>
        </a>
      </div>
      <section ref={faqRef} className="mx-auto mt-8 w-[min(88vw,600px)] px-0 pb-2 uppercase" aria-labelledby="faq-title">
        <h2 id="faq-title" className="mb-3 w-full whitespace-nowrap text-center font-headline text-[clamp(11px,3.2vw,15px)] font-extrabold uppercase tracking-[0.02em] text-foreground sm:text-xl">
          Perguntas frequentes
        </h2>
        <div className="overflow-hidden rounded-lg border border-[#333333] bg-[#141414]">
          <div className="border-b border-[#333333]">
            <button type="button" aria-expanded={openFaq === 1} onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left font-display text-[10px] font-extrabold uppercase text-[#B8B8B8] sm:text-[12px]">
              <span>Funciona para Android e iPhone?</span>
              <span className={`shrink-0 text-lg leading-none text-[#B30000] transition-transform duration-200 ${openFaq === 1 ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {openFaq === 1 && <div className="px-3 pb-3 font-inter text-xs font-bold leading-relaxed text-[#707070]">Sim, porque funciona nos dois sistemas e o arquivo traz as instruções exatas para ativar.</div>}
          </div>
          <div className="border-b border-[#333333]">
            <button type="button" aria-expanded={openFaq === 2} onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left font-display text-[10px] font-extrabold uppercase text-[#B8B8B8] sm:text-[12px]">
              <span>Vou levar ban na minha conta principal?</span>
              <span className={`shrink-0 text-lg leading-none text-[#B30000] transition-transform duration-200 ${openFaq === 2 ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {openFaq === 2 && <div className="px-3 pb-3 font-inter text-xs font-bold leading-relaxed text-[#707070]">Não, porque usa o método de influenciadores da Garena e o arquivo ensina como jogar seguro.</div>}
          </div>
          <div className="border-b border-[#333333]">
            <button type="button" aria-expanded={openFaq === 3} onClick={() => setOpenFaq(openFaq === 3 ? null : 3)} className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left font-display text-[10px] font-extrabold uppercase text-[#B8B8B8] sm:text-[12px]">
              <span>Como recebo o acesso após a compra?</span>
              <span className={`shrink-0 text-lg leading-none text-[#B30000] transition-transform duration-200 ${openFaq === 3 ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {openFaq === 3 && <div className="px-3 pb-3 font-inter text-xs font-bold leading-relaxed text-[#707070]">Recebes na hora após o pagamento, com acesso direto e o arquivo completo para configurar.</div>}
          </div>
          <div className="border-b border-[#333333]">
            <button type="button" aria-expanded={openFaq === 4} onClick={() => setOpenFaq(openFaq === 4 ? null : 4)} className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left font-display text-[10px] font-extrabold uppercase text-[#B8B8B8] sm:text-[12px]">
              <span>É difícil de instalar no celular?</span>
              <span className={`shrink-0 text-lg leading-none text-[#B30000] transition-transform duration-200 ${openFaq === 4 ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {openFaq === 4 && <div className="px-3 pb-3 font-inter text-xs font-bold leading-relaxed text-[#707070]">Não, porque o arquivo é simples e direto, mostrando cada etapa para concluir em minutos.</div>}
          </div>
          <div>
            <button type="button" aria-expanded={openFaq === 5} onClick={() => setOpenFaq(openFaq === 5 ? null : 5)} className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-3 text-left font-display text-[10px] font-extrabold uppercase text-[#B8B8B8] sm:text-[12px]">
              <span>E se não funcionar no meu aparelho?</span>
              <span className={`shrink-0 text-lg leading-none text-[#B30000] transition-transform duration-200 ${openFaq === 5 ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {openFaq === 5 && <div className="px-3 pb-3 font-inter text-xs font-bold leading-relaxed text-[#707070]">Contas com suporte para revisar as instruções do arquivo e ajustar o teu aparelho na hora.</div>}
          </div>
        </div>
      </section>
      <footer className="mt-8 min-h-[200px] w-full shrink-0 bg-[#141414] px-0 pb-6 pt-5 sm:px-4" aria-label="Rodapé">
        <nav className="flex flex-col items-center justify-center gap-2 px-3 text-center font-inter text-[14px] font-bold uppercase text-[#858585] sm:flex-row sm:gap-x-2 sm:gap-y-0" aria-label="Links legais">
          <span className="relative inline-block transition-colors duration-300 hover:text-header after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-header after:transition-transform after:duration-300 hover:after:scale-x-100">
            TERMOS DE USO
          </span>
          <span className="hidden sm:inline" aria-hidden="true">|</span>
          <span className="relative inline-block transition-colors duration-300 hover:text-header after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-header after:transition-transform after:duration-300 hover:after:scale-x-100">
            POLÍTICA DE PRIVACIDADE
          </span>
        </nav>
        <div className="mx-auto mt-5 w-full max-w-[1250px] space-y-2 text-center font-inter text-[5px] leading-[1.5] text-[#707070] [text-wrap:balance] sm:text-[8px]">
          <p>
            <strong>Aviso Legal:</strong> Nossos produtos e conteúdos buscam representar fielmente nossas ferramentas e sua capacidade de melhorar seu desempenho no jogo.
          </p>
          <p>
            No entanto, o wukongawaza não garante que você obterá quaisquer resultados ou que o hack funcionará perfeitamente, e <strong>não nos responsabilizamos caso a ferramenta não instale com sucesso</strong> ou apresente incompatibilidade com o seu dispositivo. Nenhum conteúdo em nossos sites deve ser interpretado como uma promessa ou garantia de desempenho futuro.
          </p>
          <p>
            Os depoimentos apresentados podem ter envolvido o uso de mais de um produto de wukongawaza ou a extensão do programa para alcançar resultados máximos.
            {" "}<strong>ESTE SITE NÃO É DO FACEBOOK:</strong> Este site não faz parte do Facebook ou do Facebook Inc. e não é endossado pelo Facebook de qualquer forma. FACEBOOK é uma marca comercial independente da FACEBOOK, Inc.
          </p>
          <p>
            Utilizamos pixels/cookies de remarketing do Google neste site para nos comunicarmos novamente com visitantes e garantir que possamos compartilhar mensagens e informações relevantes no futuro.
          </p>
          <p>
            O Google exibe nossos anúncios em sites de terceiros na internet para auxiliar na comunicação com o público que demonstrou interesse prévio em nossas informações.
          </p>
        </div>
        <p className="mt-5 text-center font-inter text-[12px] font-bold leading-relaxed text-[#707070]">
          © 2026 WUKONGWAZA – Todos os direitos reservados.
        </p>
      </footer>
      </main>
    </>
  );
}
