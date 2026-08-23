import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [mousePosition, setMousePosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [chatStep, setChatStep] = useState(0);

  // =========================================================
  // SITE CREATOR
  // =========================================================

  const [creatorOpen, setCreatorOpen] = useState(false);
  const [creatorStep, setCreatorStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    project: "",
    type: "",
    description: "",
    email: "",
  });

  const [sent, setSent] = useState(false);

  const primaryButtonRef = useRef(null);
  const navButtonRef = useRef(null);

  const [sendError, setSendError] = useState(false);
  const [sending, setSending] = useState(false);

  // =========================================================
  // MOUSE
  // =========================================================

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // =========================================================
  // CHAT / SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".journey-section");

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const progress =
        (viewportHeight - rect.top) /
        (viewportHeight + rect.height);

      const clamped = Math.max(0, Math.min(1, progress));

      if (clamped < 0.25) {
        setChatStep(0);
      } else if (clamped < 0.40) {
        setChatStep(1);
      } else if (clamped < 0.55) {
        setChatStep(2);
      } else if (clamped < 0.70) {
        setChatStep(3);
      } else if (clamped < 0.85) {
        setChatStep(4);
      } else {
        setChatStep(5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // OPEN CREATOR
  // =========================================================

  const openCreator = () => {
    setCreatorOpen(true);
    setCreatorStep(1);
    setSent(false);

    document.body.style.overflow = "hidden";
  };

  const closeCreator = () => {
    setCreatorOpen(false);
    document.body.style.overflow = "";
  };

  // =========================================================
  // FORM
  // =========================================================

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (creatorStep < 5) {
      setCreatorStep((step) => step + 1);
    }
  };

  const previousStep = () => {
    if (creatorStep > 1) {
      setCreatorStep((step) => step - 1);
    }
  };

  const submitRequest = async () => {
  setSending(true);
  setSendError(false);

  try {
    const response = await fetch("http://localhost:3001/api/site-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar solicitação");
    }

    setSent(true);
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    setSendError(true);
  } finally {
    setSending(false);
  }
};

  // =========================================================
  // MAGNETIC BUTTONS
  // =========================================================

  const getMagneticStyle = (element) => {
    if (!element) {
      return {
        transform: "translate(0px, 0px)",
      };
    }

    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = mousePosition.x - centerX;
    const distanceY = mousePosition.y - centerY;

    const distance = Math.sqrt(
      distanceX * distanceX +
        distanceY * distanceY
    );

    const radius = 180;

    if (distance > radius) {
      return {
        transform: "translate(0px, 0px)",
      };
    }

    const strength = 1 - distance / radius;

    return {
      transform: `
        translate(
          ${distanceX * strength * 0.08}px,
          ${distanceY * strength * 0.08}px
        )
      `,
    };
  };

  return (
    <main className="site">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="ambient-background">

        <div
          className="cursor-glow"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />

        <div className="liquid liquid-one" />
        <div className="liquid liquid-two" />
        <div className="liquid liquid-three" />

        <div className="glow glow-one" />
        <div className="glow glow-two" />

        <div className="stars" />

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar-wrapper">

        <nav className="navbar">

          <div className="brand">

            <img
              src={`${import.meta.env.BASE_URL}evorian-icon.png`}
              alt="EVORIAN"
              className="brand-symbol"
            />

            <span>EVORIAN</span>

          </div>

          <div className="nav-links">

            <a href="#home">
              Início
            </a>

            <a href="#about">
              Quem somos
            </a>

            <a href="#solutions">
              Soluções
            </a>

            <a href="#projects">
              Projetos
            </a>

            <a href="#contact">
              Contato
            </a>

          </div>

          <button
            ref={navButtonRef}
            className="nav-button"
            style={getMagneticStyle(navButtonRef.current)}
            onClick={openCreator}
          >
            Solicitar site
            <span>↗</span>
          </button>

        </nav>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <div className="eyebrow">

            <span className="status-dot" />

            TECNOLOGIA · DESIGN · INTELIGÊNCIA

          </div>

          <h1>

            Construímos

            <br />

            <span>
              o que vem depois.
            </span>

          </h1>

          <p>
            Criamos experiências digitais extraordinárias para empresas
            que querem transformar sua presença na internet.
          </p>

          <div className="hero-actions">

            <button
              ref={primaryButtonRef}
              className="primary-button"
              style={getMagneticStyle(primaryButtonRef.current)}
              onClick={openCreator}
            >

              Quero um site

              <span>
                →
              </span>

            </button>

            <a
              href="#projects"
              className="secondary-button"
            >
              Explorar projetos
            </a>

          </div>

        </div>

        <div className="scroll-indicator">

          <span />

          ROLE PARA EXPLORAR

        </div>

      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section
        className="process-section"
        id="about"
      >

        <div className="section-heading">

          <span className="section-eyebrow">
            COMO FUNCIONA
          </span>

          <h2>
            Do conceito à experiência.
          </h2>

          <p>
            Transformamos ideias em experiências digitais pensadas
            para pessoas e negócios que querem ir além.
          </p>

        </div>

        <div className="process-grid">

          <article className="process-card">

            <span className="process-number">
              01
            </span>

            <div className="process-icon">
              ✦
            </div>

            <h3>
              Ideia
            </h3>

            <p>
              Você conta o que precisa e onde quer chegar.
            </p>

          </article>

          <article className="process-card">

            <span className="process-number">
              02
            </span>

            <div className="process-icon">
              ◈
            </div>

            <h3>
              Criação
            </h3>

            <p>
              Transformamos sua ideia em uma experiência visual.
            </p>

          </article>

          <article className="process-card">

            <span className="process-number">
              03
            </span>

            <div className="process-icon">
              ⌁
            </div>

            <h3>
              Desenvolvimento
            </h3>

            <p>
              Design, código, responsividade e interação.
            </p>

          </article>

          <article className="process-card">

            <span className="process-number">
              04
            </span>

            <div className="process-icon">
              ↗
            </div>

            <h3>
              Entrega
            </h3>

            <p>
              Uma experiência pronta para chegar ao mundo.
            </p>

          </article>

        </div>

      </section>

      {/* =====================================================
          PROJECTS
      ===================================================== */}

      <section
        className="projects-section"
        id="projects"
      >

        <div className="section-heading">

          <span className="section-eyebrow">
            PROJETOS
          </span>

          <h2>
            Feito para ser lembrado.
          </h2>

          <p>
            Cada projeto nasce com uma identidade própria.
          </p>

        </div>

        <div className="project-showcase">

          <div className="project-preview project-main">

            <div className="preview-glow" />

            <div className="preview-window">

              <div className="preview-topbar">

                <span />
                <span />
                <span />

              </div>

              <div className="preview-content">

                <div className="preview-line large" />
                <div className="preview-line" />
                <div className="preview-line short" />

                <div className="preview-cards">

                  <div />
                  <div />
                  <div />

                </div>

              </div>

            </div>

            <div className="project-info">

              <span>
                WEBSITE
              </span>

              <h3>
                Experiências digitais.
              </h3>

            </div>

          </div>

          <div className="project-side">

            <div className="mini-project">

              <span>
                01
              </span>

              <div>

                <strong>
                  Institucional
                </strong>

                <p>
                  Presença digital profissional.
                </p>

              </div>

              <b>
                ↗
              </b>

            </div>

            <div className="mini-project">

              <span>
                02
              </span>

              <div>

                <strong>
                  Portfólio
                </strong>

                <p>
                  Seu trabalho em destaque.
                </p>

              </div>

              <b>
                ↗
              </b>

            </div>

            <div className="mini-project">

              <span>
                03
              </span>

              <div>

                <strong>
                  Experiência
                </strong>

                <p>
                  Interfaces que envolvem.
                </p>

              </div>

              <b>
                ↗
              </b>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          JOURNEY
      ===================================================== */}

      <section
        className="journey-section"
        id="contact"
      >

        <div className="journey-content">

          <div className="journey-copy">

            <span className="section-eyebrow">
              O PRIMEIRO PASSO
            </span>

            <h2>

              Seu próximo site

              <span>
                começa com uma conversa.
              </span>

            </h2>

            <p>
              Conte para a EVORIAN o que você imagina.
              A partir daí, transformamos sua ideia em realidade.
            </p>

            <button
              className="journey-button"
              onClick={openCreator}
            >
              Solicitar meu site

              <span>
                ↗
              </span>
            </button>

          </div>

          <div className="phone-stage">

            <div className="phone-glow" />

            <div className="phone">

              <div className="phone-notch" />

              <div className="phone-header">

                <div className="phone-avatar">
                  E
                </div>

                <div>

                  <strong>
                    EVORIAN
                  </strong>

                  <span>
                    online
                  </span>

                </div>

              </div>

              <div className="chat-area">

                {chatStep >= 0 && (
                  <div className="chat-message received">
                    Olá! 👋
                  </div>
                )}

                {chatStep >= 1 && (
                  <div className="chat-message received">
                    Vamos criar algo incrível?
                  </div>
                )}

                {chatStep >= 2 && (
                  <div className="chat-message sent">
                    Olá! Quero um site.
                  </div>
                )}

                {chatStep >= 3 && (
                  <div className="chat-message received">
                    Perfeito. 🚀
                  </div>
                )}

                {chatStep >= 4 && (
                  <div className="chat-message received">
                    Qual é o nome da sua empresa?
                  </div>
                )}

                {chatStep >= 5 && (
                  <div className="chat-message sent">
                    Quero transformar minha ideia em realidade.
                  </div>
                )}

              </div>

              <div className="chat-input">

                <span>
                  Digite uma mensagem...
                </span>

                <b>
                  ➤
                </b>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="final-section">

        <span className="section-eyebrow">
          EVORIAN
        </span>

        <h2>
          Vamos construir{" "}
          <span>
            o que vem depois.
          </span>
        </h2>

        <button
          className="final-button"
          onClick={openCreator}
        >

          Começar um projeto

          <span>
            ↗
          </span>

        </button>

      </section>

      {/* =====================================================
          SITE CREATOR
      ===================================================== */}

      {creatorOpen && (

        <div className="creator-overlay">

          <div className="creator-background">

            <div className="creator-orb creator-orb-one" />
            <div className="creator-orb creator-orb-two" />
            <div className="creator-grid" />

          </div>

          <div className="creator-header">

            <button
              className="creator-brand"
              onClick={closeCreator}
            >

              <img
                src={`${import.meta.env.BASE_URL}evorian-icon.png`}
                alt="EVORIAN"
              />

              <span>
                EVORIAN
              </span>

            </button>

            {!sent && (

              <button
                className="creator-close"
                onClick={closeCreator}
              >
                Esc
                <span>×</span>
              </button>

            )}

          </div>

          {!sent ? (

            <div className="creator-container">

              <div className="creator-progress">

                <div className="progress-info">

                  <span>
                    SITE CREATOR
                  </span>

                  <strong>
                    0{creatorStep} / 05
                  </strong>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${creatorStep * 20}%`,
                    }}
                  />

                </div>

              </div>

              <div className="creator-content">

                {/* STEP 01 */}

                {creatorStep === 1 && (

                  <div className="creator-step">

                    <span className="creator-step-label">
                      01 — IDENTIDADE
                    </span>

                    <h2>
                      Como podemos
                      <span> te chamar?</span>
                    </h2>

                    <p>
                      Vamos começar pelo básico.
                    </p>

                    <input
                      autoFocus
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          formData.name.trim()
                        ) {
                          nextStep();
                        }
                      }}
                    />

                  </div>

                )}

                {/* STEP 02 */}

                {creatorStep === 2 && (

                  <div className="creator-step">

                    <span className="creator-step-label">
                      02 — PROJETO
                    </span>

                    <h2>
                      O que você
                      <span> quer criar?</span>
                    </h2>

                    <p>
                      Escolha a opção que mais se aproxima da sua ideia.
                    </p>

                    <div className="creator-options">

                      {[
                        "Site para empresa",
                        "Landing page",
                        "Portfólio",
                        "Loja virtual",
                        "Outro",
                      ].map((option) => (

                        <button
                          key={option}
                          className={
                            formData.type === option
                              ? "creator-option active"
                              : "creator-option"
                          }
                          onClick={() =>
                            updateField("type", option)
                          }
                        >

                          <span>
                            {option}
                          </span>

                          <b>
                            ↗
                          </b>

                        </button>

                      ))}

                    </div>

                  </div>

                )}

                {/* STEP 03 */}

                {creatorStep === 3 && (

                  <div className="creator-step">

                    <span className="creator-step-label">
                      03 — NOME DO PROJETO
                    </span>

                    <h2>
                      Qual é o nome da
                      <span> empresa ou projeto?</span>
                    </h2>

                    <p>
                      Se ainda não tiver um nome definido, tudo bem.
                    </p>

                    <input
                      autoFocus
                      type="text"
                      placeholder="Nome da empresa ou projeto"
                      value={formData.project}
                      onChange={(e) =>
                        updateField("project", e.target.value)
                      }
                    />

                  </div>

                )}

                {/* STEP 04 */}

                {creatorStep === 4 && (

                  <div className="creator-step">

                    <span className="creator-step-label">
                      04 — SUA IDEIA
                    </span>

                    <h2>
                      Conte como você
                      <span> imagina o site.</span>
                    </h2>

                    <p>
                      Pode escrever do seu jeito. Quanto mais detalhes,
                      melhor conseguiremos entender sua visão.
                    </p>

                    <textarea
                      autoFocus
                      placeholder="Ex.: Quero um site moderno, com uma aparência elegante..."
                      value={formData.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                    />

                  </div>

                )}

                {/* STEP 05 */}

                {creatorStep === 5 && (

                  <div className="creator-step">

                    <span className="creator-step-label">
                      05 — CONTATO
                    </span>

                    <h2>
                      Onde podemos
                      <span> falar com você?</span>
                    </h2>

                    <p>
                      Sua solicitação será enviada diretamente
                      para a EVORIAN.
                    </p>

                    <input
                      autoFocus
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                    />

                    <div className="creator-summary">

                      <div>
                        <span>PROJETO</span>
                        <strong>
                          {formData.project || "Não informado"}
                        </strong>
                      </div>

                      <div>
                        <span>TIPO</span>
                        <strong>
                          {formData.type || "Não informado"}
                        </strong>
                      </div>

                    </div>

                  </div>

                )}

              </div>

              <div className="creator-footer">

                <button
                  className="creator-back"
                  onClick={
                    creatorStep === 1
                      ? closeCreator
                      : previousStep
                  }
                >
                  {creatorStep === 1 ? "Cancelar" : "← Voltar"}
                </button>

                {creatorStep < 5 ? (

                  <button
                    className="creator-next"
                    disabled={
                      (creatorStep === 1 &&
                        !formData.name.trim()) ||
                      (creatorStep === 2 &&
                        !formData.type) ||
                      (creatorStep === 3 &&
                        !formData.project.trim()) ||
                      (creatorStep === 4 &&
                        !formData.description.trim())
                    }
                    onClick={nextStep}
                  >
                    Continuar
                    <span>→</span>
                  </button>

                ) : (

                  <button
                    className="creator-next creator-send"
                    disabled={
                      !formData.email.trim() ||
                      !formData.email.includes("@")
                    }
                    onClick={submitRequest}
                  >
                    {sending ? "Enviando..." : "Enviar solicitação"}
                         <span>{sending ? "…" : "↗"}</span>
                  </button>

                )}

              </div>

            </div>

          ) : (

            <div className="creator-success">

              <div className="success-orb">

                <span>
                  ✓
                </span>

              </div>

              <span className="creator-step-label">
                SOLICITAÇÃO RECEBIDA
              </span>

              <h2>
                Sua ideia chegou
                <span> até nós.</span>
              </h2>

              <p>
                Obrigado, {formData.name || "por confiar na EVORIAN"}.
                Sua solicitação foi registrada e nossa equipe poderá
                entrar em contato pelo e-mail informado.
              </p>

              <button
                className="creator-success-button"
                onClick={closeCreator}
              >
                Voltar para a EVORIAN
                <span>↗</span>
              </button>

               {sendError && (
  <div
    className="creator-error-backdrop"
    onClick={() => setSendError(false)}
  >
    <div
      className="creator-error"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="creator-error-icon">
        !
      </div>

      <div className="creator-error-content">
        <strong>
          Não foi possível enviar sua solicitação
        </strong>

        <p>
          Ocorreu um problema ao tentar enviar seus dados.
          Verifique sua conexão e tente novamente.
        </p>
      </div>

      <button
        className="creator-error-close"
        onClick={() => setSendError(false)}
      >
        Entendi
      </button>
    </div>
  </div>
)}

            </div>

          )}

        </div>

      )}

    </main>
  );
}

export default App;