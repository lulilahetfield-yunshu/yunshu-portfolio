"use client";

import { useEffect, useRef, useState } from "react";

type PipelineItem = [string, string, string];
type LightboxItem = { label: string; tone: string; src?: string };
type ProjectFilm = { projectSlug: string; src: string; autoPlay?: boolean; loop?: boolean; muted?: boolean };
type View =
  | { type: "home" }
  | { type: "works" }
  | { type: "category"; category: string }
  | { type: "project"; category: string; project: string }
  | { type: "about" }
  | { type: "contact" };

const assetPath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const categories = [
  { id: "aigc", number: "01", title: "AIGC 动画", english: "AIGC Animation", count: "2 Projects", tone: "slate" },
  { id: "handdrawn", number: "02", title: "手绘动画", english: "Hand-drawn Animation", count: "1 Project", tone: "pearl" },
  { id: "maya", number: "03", title: "Maya 三维建模", english: "Maya 3D Modeling", count: "4 Works", tone: "silver" },
  { id: "maya-animation", number: "04", title: "Maya 三维动画", english: "Maya 3D Animation", count: "1 Film", tone: "mist" },
  { id: "blender", number: "05", title: "Blender 三维建模", english: "Blender 3D Modeling", count: "3 Works", tone: "ice" },
  { id: "commercial", number: "06", title: "商业宣传片", english: "Commercial Film", count: "1 Project", tone: "dusk" },
];

const projects: Record<string, { id: string; title: string; english: string; year: string; tone: string }[]> = {
  aigc: [
    { id: "gunian", title: "故念", english: "Lingering Memory", year: "2025", tone: "slate" },
    { id: "mirror", title: "我看见我", english: "I See Me", year: "2025", tone: "mist" },
  ],
  handdrawn: [{ id: "bloom", title: "昙花一现", english: "A Moment in Bloom", year: "2024", tone: "pearl" }],
  maya: [
    { id: "maya-1", title: "咖啡磨豆机静物建模", english: "Coffee Grinder Still Life", year: "2024—2026", tone: "silver" },
    { id: "maya-2", title: "室内书桌场景建模", english: "Interior Desk Scene", year: "2024—2026", tone: "slate" },
    { id: "maya-3", title: "中世纪攻城器械建模", english: "Medieval Siege Engine", year: "2024—2026", tone: "mist" },
    { id: "maya-4", title: "羊头雕塑建模", english: "Ram Head Sculpture", year: "2024—2026", tone: "ice" },
  ],
  "maya-animation": [
    { id: "maya-fight", title: "Maya 三维动画", english: "Maya 3D Animation", year: "2025", tone: "mist" },
  ],
  blender: [
    { id: "blender-1", title: "低多边形房屋场景", english: "Low-poly House Scene", year: "2024—2026", tone: "ice" },
    { id: "blender-2", title: "厨房场景", english: "Kitchen Scene", year: "2024—2026", tone: "dusk" },
    { id: "blender-3", title: "客厅静物场景", english: "Living Room Still Life", year: "2024—2026", tone: "silver" },
  ],
  commercial: [{ id: "xinghui", title: "幸汇", english: "Xinghui Shopping Mall Film", year: "2025", tone: "dusk" }],
};

const projectFilms: Record<string, ProjectFilm> = {
  gunian: {
    projectSlug: "gunian",
    src: "/works/gunian/final-film.mp4",
  },
  mirror: {
    projectSlug: "mirror",
    src: "/works/mirror/i-see-me-final-film.mp4",
  },
  bloom: {
    projectSlug: "bloom",
    src: "/works/bloom/final-film.mp4",
  },
  "maya-fight": {
    projectSlug: "maya-fight",
    src: "/works/maya-animation/fight-animation.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
  },
};

const gunianProcess: PipelineItem[] = [
  ["创意讨论", "ChatGPT", "共同讨论故事方向、世界观设定、人物关系及创意构思。"],
  ["剧本创作", "原创创作 × ChatGPT", "独立完成剧本，并完善剧情结构与细节表达。"],
  ["AIGC 工作流", "TapNow", "构建多模型协同创作流程。"],
  ["角色设计", "Midjourney（MJ）", "完成角色探索、定稿及整体风格统一。"],
  ["场景与道具设计", "GPT Image × Gemini Banana", "完成场景、道具与关键画面的视觉开发。"],
  ["分镜设计", "GPT Image × Gemini Banana", "统一镜头语言、构图及视觉节奏。"],
  ["AI 视频生成", "Seedance", "完成动画镜头生成及镜头衔接。"],
  ["后期剪辑", "剪映（CapCut）", "完成剪辑、字幕、音乐与最终成片。"],
];
const mirrorProcess: PipelineItem[] = [
  ["创意讨论", "ChatGPT", "共同讨论故事方向、主题表达及整体创意构思。"],
  ["剧本创作", "原创创作 × ChatGPT", "独立完成剧本，并完善剧情结构与细节表达。"],
  ["角色设计", "Gemini", "原创角色设计，并完成三视图及视觉优化。"],
  ["场景与道具设计", "Gemini", "完成场景、道具及关键画面的视觉设计。"],
  ["分镜设计", "手绘 × Gemini", "完成手绘镜头设计，并完善关键分镜画面。"],
  ["AI 视频生成", "海螺AI", "完成动画镜头生成及动态画面制作。"],
  ["AI 配音与配乐", "海绵AI", "完成角色配音、对白处理、背景音乐及声音素材生成。"],
  ["后期剪辑", "剪映（CapCut）", "完成剪辑、字幕、调色及最终成片。"],
];
const handProcess: PipelineItem[] = [
  ["角色设计", "Procreate", "原创完成角色设计与角色绘制。"],
  ["场景设计", "Procreate", "原创完成场景设计与画面绘制。"],
  ["分镜制作", "Procreate", "完成镜头设计、画面编排及分镜绘制。"],
  ["动画制作", "Procreate Dreams", "完成二维动画制作及镜头动画表现。"],
  ["后期剪辑", "剪映（CapCut）", "完成剪辑、字幕、音乐及最终成片。"],
];

const gunianVisuals: { src: string; label: string; tone: string; portrait?: boolean; kind?: string }[] = [
  { src: "/works/gunian/character-grandmother.png", label: "《故念》· 老奶奶角色三视图", tone: "pearl", portrait: true, kind: "character" },
  { src: "/works/gunian/character-lineup.png", label: "《故念》· 角色身高比例图", tone: "silver", kind: "character" },
  { src: "/works/gunian/character-girl.png", label: "《故念》· 小女孩三视图", tone: "ice", kind: "character" },
  { src: "/works/gunian/character-father.jpg", label: "《故念》· 男主角三视图", tone: "mist", kind: "character" },
  { src: "/works/gunian/character-boy.png", label: "《故念》· 小男孩三视图", tone: "pearl", kind: "character" },
  { src: "/works/gunian/scene-autumn.png", label: "《故念》· 秋日场景设计", tone: "dusk" },
  { src: "/works/gunian/scene-winter.png", label: "《故念》· 冬日场景设计", tone: "slate" },
  { src: "/works/gunian/prop-pocket-watch.jpg", label: "《故念》· 关键道具展示", tone: "silver", portrait: true },
  { src: "/works/gunian/keyframe-girl.png", label: "《故念》· 关键画面 01", tone: "ice" },
  { src: "/works/gunian/keyframe-dog.png", label: "《故念》· 关键画面 02", tone: "dusk" },
];

const mirrorVisuals: { src: string; label: string; tone: string; kind?: string }[] = [
  { src: "/works/mirror/character-01.jpg", label: "《我看见我》· 女主一角色三视图", tone: "pearl", kind: "character" },
  { src: "/works/mirror/character-02.jpg", label: "《我看见我》· 女主二角色三视图", tone: "pearl", kind: "character" },
  { src: "/works/mirror/scene-mirror.jpg", label: "《我看见我》· 镜子场景设计图", tone: "slate" },
  { src: "/works/mirror/keyframe-01.jpg", label: "《我看见我》· 关键画面 01", tone: "dusk" },
  { src: "/works/mirror/keyframe-02.jpg", label: "《我看见我》· 关键画面 02", tone: "mist" },
  { src: "/works/mirror/keyframe-03.jpg", label: "《我看见我》· 关键画面 03", tone: "ice" },
  { src: "/works/mirror/storyboard.png", label: "《我看见我》· 手绘分镜草图", tone: "slate" },
];

const bloomVisuals: { src: string; label: string; tone: string }[] = [
  { src: "/works/bloom/keyframe-01.jpg", label: "《昙花一现》 · 关键画面 01", tone: "mist" },
  { src: "/works/bloom/keyframe-02.jpg", label: "《昙花一现》 · 关键画面 02", tone: "silver" },
  { src: "/works/bloom/keyframe-03.jpg", label: "《昙花一现》 · 关键画面 03", tone: "ice" },
  { src: "/works/bloom/keyframe-04.jpg", label: "《昙花一现》 · 关键画面 04", tone: "dusk" },
  { src: "/works/bloom/storyboard.jpg", label: "《昙花一现》 · Storyboard 手绘分镜图", tone: "slate" },
];

const mayaVisuals: Record<string, string> = {
  "maya-1": "/works/maya/coffee-grinder.jpg",
  "maya-2": "/works/maya/interior-desk.jpg",
  "maya-3": "/works/maya/siege-engine.jpg",
  "maya-4": "/works/maya/ram-sculpture.jpg",
};

const blenderVisuals: Record<string, string> = {
  "blender-1": "/works/blender/low-poly-house.jpg",
  "blender-2": "/works/blender/kitchen-scene.jpg",
  "blender-3": "/works/blender/living-room-still-life.jpg",
};

function parseHash(): View {
  if (typeof window === "undefined") return { type: "home" };
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length || parts[0] === "home") return { type: "home" };
  if (parts[0] === "works" && parts.length === 1) return { type: "works" };
  if (parts[0] === "works" && parts.length === 2) {
    const firstProject = projects[parts[1]]?.[0];
    return firstProject ? { type: "project", category: parts[1], project: firstProject.id } : { type: "works" };
  }
  if (parts[0] === "works" && parts.length >= 3) return { type: "project", category: parts[1], project: parts[2] };
  if (parts[0] === "about") return { type: "about" };
  if (parts[0] === "contact") return { type: "contact" };
  return { type: "home" };
}

function viewHash(view: View) {
  if (view.type === "home") return "#/";
  if (view.type === "works") return "#/works";
  if (view.type === "category") return `#/works/${view.category}`;
  if (view.type === "project") return `#/works/${view.category}/${view.project}`;
  return `#/${view.type}`;
}

export default function Home() {
  const [view, setView] = useState<View>({ type: "home" });
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    window.history.replaceState(null, "", "#/");
    window.scrollTo(0, 0);
    const pendingTimers = timers.current;
    const onPop = () => {
      setView(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onPop);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("hashchange", onPop);
      window.removeEventListener("popstate", onPop);
      pendingTimers.forEach(clearTimeout);
    };
  }, []);

  const navigate = (next: View) => {
    if (phase !== "idle") return;
    setPhase("out");
    timers.current.push(setTimeout(() => {
      window.history.pushState(null, "", viewHash(next));
      setView(next);
      window.scrollTo(0, 0);
      setPhase("in");
    }, 360));
    timers.current.push(setTimeout(() => setPhase("idle"), 980));
  };

  return (
    <main className="cinematic-site">
      <TopNav view={view} navigate={navigate} />
      <div className={`page-stage ${phase}`}>
        {view.type === "home" && <Hero navigate={navigate} />}
        {view.type === "works" && <WorksIndex navigate={navigate} />}
        {view.type === "category" && <ProjectPage categoryId={view.category} projectId={projects[view.category]?.[0]?.id ?? ""} navigate={navigate} onOpen={setLightbox} />}
        {view.type === "project" && <ProjectPage categoryId={view.category} projectId={view.project} navigate={navigate} onOpen={setLightbox} />}
        {view.type === "about" && <AboutPage />}
        {view.type === "contact" && <ContactPage />}
      </div>
      {lightbox && (
        <div className="cinema-lightbox" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}>Close ×</button>
          <div className={`art-frame tone-${lightbox.tone}`} onClick={(event) => event.stopPropagation()}>
            {lightbox.src && <img src={assetPath(lightbox.src)} alt={lightbox.label} />}
            <span>{lightbox.label}</span>
          </div>
        </div>
      )}
    </main>
  );
}

function TopNav({ view, navigate }: { view: View; navigate: (view: View) => void }) {
  const overHero = view.type === "home";
  const overArtwork = ["works", "category", "project"].includes(view.type);
  return (
    <nav className={`floating-nav ${overHero ? "over-hero" : ""} ${overArtwork ? "over-artwork" : ""}`}>
      <button className="brand" onClick={() => navigate({ type: "home" })}><span>蓝飞然</span><i>LAN FEIRAN</i></button>
      <div className="nav-links">
        <button className={["works", "category", "project"].includes(view.type) ? "active" : ""} onClick={() => navigate({ type: "works" })}>作品</button>
        <button className={view.type === "about" ? "active" : ""} onClick={() => navigate({ type: "about" })}>关于我</button>
        <button className={view.type === "contact" ? "active" : ""} onClick={() => navigate({ type: "contact" })}>联系我</button>
      </div>
      <span className="nav-index">{view.type === "home" ? "00" : view.type === "works" ? "01" : view.type === "about" ? "02" : view.type === "contact" ? "03" : "—"}</span>
    </nav>
  );
}

function Hero({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="hero">
      <video autoPlay muted loop playsInline preload="metadata"><source src={assetPath("/hero-background.mp4")} type="video/mp4" /></video>
      <div className="hero-veil" />
      <div className="hero-grid">
        <p className="hero-kicker">Animation Portfolio · 2024—2026</p>
        <div className="hero-title"><span>蓝飞然</span><h1>个人作品集</h1><p className="hero-subtitle">Animation Portfolio</p><button className="hero-enter" onClick={() => navigate({ type: "works" })}>进入作品集　→</button></div>
        <p className="hero-fields">AIGC 动画　/　手绘动画　/　三维视觉制作</p>
        <div className="hero-meta"><span>Shenzhen, China</span><button onClick={() => navigate({ type: "works" })}>Enter Works　→</button></div>
      </div>
    </section>
  );
}

function WorksIndex({ navigate }: { navigate: (view: View) => void }) {
  return (
    <section className="screen-page works-index page-bg page-bg-works">
      <PageHeading eyebrow="Works Index / 01" english="Selected Works" chinese="作品目录" note="选择一个创作方向，进入对应章节。" />
      <div className="category-grid">
        {categories.map((category) => (
          <button key={category.id} className={`category-entry tone-${category.tone}`} onClick={() => navigate({ type: "project", category: category.id, project: projects[category.id][0].id })}>
            <small>{category.number}</small><div><i>{category.english}</i><h2>{category.title}</h2></div><span>{category.count}　↗</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CategoryPage({ categoryId, navigate }: { categoryId: string; navigate: (view: View) => void }) {
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const list = projects[category.id] ?? [];
  return (
    <section className={`screen-page category-page page-bg page-bg-${category.id}`}>
      <Breadcrumb items={["作品", category.title]} onBack={() => navigate({ type: "works" })} />
      <PageHeading eyebrow={`Category / ${category.number}`} english={category.english} chinese={category.title} note={`${list.length} 个作品条目`} />
      <div className={`project-index count-${list.length}`}>
        {list.map((project, index) => (
          <button key={project.id} className={`project-entry tone-${project.tone}`} onClick={() => navigate({ type: "project", category: category.id, project: project.id })}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <div><span>{project.year}</span><h2>{project.title}</h2><i>{project.english}</i></div>
            <b>View Project　↗</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectPage({ categoryId, projectId, navigate, onOpen }: { categoryId: string; projectId: string; navigate: (view: View) => void; onOpen: (item: LightboxItem) => void }) {
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const item = (projects[categoryId] ?? [])[0] && ((projects[categoryId] ?? []).find((project) => project.id === projectId) ?? projects[categoryId][0]);
  if (!item) return null;
  const isFilm = ["gunian", "mirror", "bloom"].includes(projectId);
  const isStandaloneFilm = projectId === "maya-fight";
  const isModel = categoryId === "maya" || categoryId === "blender";
  const isCommercial = projectId === "xinghui";
  const filmConfig = projectFilms[projectId];
  const filmData = projectId === "gunian"
    ? { concept: "以记忆为起点，以告别为终点，通过完整的角色、世界观与镜头语言，讲述关于放下与继续前行的故事。", role: "项目策划 · 剧本创作 · 角色与世界观设定 · 分镜 · AIGC 动画 · 剪辑与终片", pipeline: gunianProcess }
    : projectId === "mirror"
      ? { concept: "以照片为媒介，探讨“照片不会改变，但观看它的人会改变”。通过照片连接过去与现在，让每一次回望都成为重新理解自己的过程。", role: "概念策划 · 剧本 · 分镜 · 视觉开发 · AIGC 动画 · 视听剪辑", pipeline: mirrorProcess }
      : { concept: "以 AI 歌星与少女的相遇为起点，探讨陪伴、失去与成长，讲述每一次短暂相遇都能成为照亮生命的一束光。", role: "导演 · 手绘动画 · 场景设计 · 剪辑", pipeline: handProcess };
  const backgroundCategoryId = categoryId === "maya-animation" ? "maya" : categoryId;

  return (
    <section className={`screen-page project-detail page-bg page-bg-${backgroundCategoryId} ${isModel ? "model-detail" : ""} ${isStandaloneFilm ? "standalone-film-detail" : ""}`}>
      <Breadcrumb items={["作品", category.title, item.title]} onBack={() => navigate({ type: "works" })} />
      {!isStandaloneFilm && <ProjectSwitcher categoryId={categoryId} activeProject={projectId} navigate={navigate} />}
      {isStandaloneFilm
        ? <header className="compact-project-hero">
            <h1>{item.title}</h1>
            <i>{item.english}</i>
            <p>Maya 角色打斗关键帧动画练习。</p>
          </header>
        : <header className="project-hero">
            <div><p>Project / {item.year}</p><h1>{item.title}</h1><i>{item.english}</i></div>
            {!isCommercial && <p>{isModel ? "以最终渲染呈现模型、材质、灯光与空间氛围的完整关系。" : filmData.concept}</p>}
          </header>}

      {isStandaloneFilm && filmConfig && <MediaFilm key={filmConfig.projectSlug} label={`${item.title} · Final Film`} film={filmConfig} />}

      {isFilm && <>
        {filmConfig && <MediaFilm key={filmConfig.projectSlug} label={`${item.title} · Final Film`} film={filmConfig} />}
        <Pipeline items={filmData.pipeline} />
        <section className="detail-section">
          <SectionTitle english={projectId === "bloom" ? "Selected Frames" : "Visual Development"} chinese={projectId === "bloom" ? "精选画面" : "视觉开发"} />
          {projectId === "gunian"
            ? <div className="detail-art-grid gunian-art-grid">{gunianVisuals.map((visual) => <ArtFrame key={visual.src} tone={visual.tone} label={visual.label} src={visual.src} portrait={visual.portrait} className={visual.kind ? `visual-${visual.kind}` : undefined} onOpen={onOpen} />)}</div>
            : projectId === "mirror"
              ? <div className="detail-art-grid mirror-art-grid">{mirrorVisuals.map((visual) => <ArtFrame key={visual.src} tone={visual.tone} label={visual.label} src={visual.src} className={visual.kind ? `visual-${visual.kind}` : undefined} onOpen={onOpen} />)}</div>
              : <div className="detail-art-grid bloom-art-grid">{bloomVisuals.map((visual) => <ArtFrame key={visual.src} tone={visual.tone} label={visual.label} src={visual.src} onOpen={onOpen} />)}</div>}
        </section>
      </>}

      {isModel && <>
        <section className="model-final"><ArtFrame tone={item.tone} label={`${item.title} · Final Render`} src={categoryId === "maya" ? mayaVisuals[projectId] : blenderVisuals[projectId]} onOpen={onOpen} /></section>
        <p className="model-note">{categoryId === "maya" ? "Maya 建模 → RizomUV 拆分 UV → Substance 3D Painter 贴图 → Maya 材质、灯光与最终渲染" : "建模、材质、灯光与最终渲染均在 Blender 内完成。"}</p>
      </>}

      {isCommercial && <CommercialDetail onOpen={onOpen} />}
      <NextProject categoryId={categoryId} projectId={projectId} navigate={navigate} />
    </section>
  );
}

function CommercialDetail({ onOpen }: { onOpen: (item: LightboxItem) => void }) {
  return <div className="commercial-detail"><ArtFrame tone="dusk" label="幸汇商场宣传片" src="/works/commercial/xinghui-cover.jpg" onOpen={onOpen} /><div>
    <InfoBlock index="01" title="项目简介" text="为“幸汇”商场打造商业宣传动画，以 IP 角色为视觉线索，将品牌信息转化为适合商场大屏传播的动态内容。" />
    <InfoBlock index="02" title="个人负责" text="独立完成 IP 角色动画设计与制作，并负责分镜节奏、镜头衔接与整体视听表达，共完成 20 余个镜头。" />
    <InfoBlock index="03" title="项目成果" text="成片投放于商场 3 块大屏，日均覆盖人流超过 2 万，并支持长期商业合作落地。" />
    <a href="https://weixin.qq.com/sph/Aqzqgrr3Nm" target="_blank" rel="noreferrer">前往微信视频号观看完整视频　↗</a>
  </div></div>;
}

function ProjectSwitcher({ categoryId, activeProject, navigate }: { categoryId: string; activeProject: string; navigate: (view: View) => void }) {
  const list = projects[categoryId] ?? [];
  const category = categories.find((item) => item.id === categoryId);
  const projectTypes: Record<string, string[]> = {
    aigc: ["AIGC 三维动画", "AIGC 二维动画"],
    handdrawn: ["手绘二维动画"],
    maya: list.map(() => "Maya 三维建模"),
    "maya-animation": ["Maya 三维动画"],
    blender: list.map(() => "Blender 三维建模"),
    commercial: ["商业宣传片"],
  };
  return <div className="project-switcher-wrap">
    <header><span>{category?.title}</span><i>{list.length} Projects</i><p>选择项目继续浏览</p></header>
    <nav className="project-switcher" aria-label="切换当前分类项目">
    {list.map((project, index) => <button key={project.id} className={project.id === activeProject ? "active" : ""} onClick={() => navigate({ type: "project", category: categoryId, project: project.id })}>
      <small>{String(index + 1).padStart(2, "0")}</small><span>{project.title}</span><i>{projectTypes[categoryId]?.[index] ?? project.english}</i>{project.id === activeProject && <b>Current</b>}
    </button>)}
    </nav>
  </div>;
}

function AboutPage() {
  return <section className="screen-page about-page">
    <PageHeading eyebrow="About / 02" english="About the Artist" chinese="关于我" note="既来之，则安之。" />
    <div className="about-opening"><p>技术会不断更新，<br />但真正值得被记住的，<br />始终是作品本身。</p><span>蓝飞然，数字媒体艺术设计专业本科在读，现居深圳。创作聚焦 AIGC 动画、手绘动画与三维视觉，能够独立推进从概念、剧本与分镜，到视觉开发、动画制作、剪辑与最终输出的完整流程。</span></div>
    <div className="about-details">
      <InfoBlock index="01" title="教育经历" text="广州商学院 · 艺术设计学院｜数字媒体艺术设计本科 · 2023—2027" />
      <InfoBlock index="02" title="创作方向" text="AIGC 动画 · 手绘动画 · 动画导演 · 三维视觉制作" />
      <InfoBlock index="03" title="专业能力" text="剧本与分镜 · 视觉开发 · AI 工作流搭建 · AIGC 动画全流程" />
      <InfoBlock index="04" title="软件能力" text="Maya · Blender · Procreate · Premiere · After Effects · Photoshop" />
      <InfoBlock index="05" title="个人优势" text="具备较强的审美判断与视觉把控能力，能够快速搭建 AI 创作工作流并高效推进制作；注重效率、画面统一与项目落地，在持续学习和主动优化中提升创作能力。" />
    </div>
  </section>;
}

function ContactPage() {
  return <section className="screen-page contact-page">
    <PageHeading eyebrow="Contact / 03" english="Contact" chinese="联系我" note="期待与你一起创造新的画面。" />
    <div className="contact-layout"><div>
      <InfoBlock index="01" title="邮箱" text="3226096520@qq.com" />
    </div><div className="contact-qr"><img src={assetPath("/contact/wechat-qr-cropped.png")} alt="蓝飞然的微信二维码" /></div></div>
  </section>;
}

function PageHeading({ eyebrow, english, chinese, note }: { eyebrow: string; english: string; chinese: string; note: string }) {
  return <header className="page-heading"><span>{eyebrow}</span><div><p>{english}</p><h1>{chinese}</h1></div><i>{note}</i></header>;
}
function Breadcrumb({ items, onBack }: { items: string[]; onBack: () => void }) {
  return <div className="breadcrumb"><button onClick={onBack}>← 返回</button><p>{items.map((item, index) => <span key={item}>{index > 0 && " / "}{item}</span>)}</p></div>;
}
function MediaFilm({ label, film }: { label: string; film: ProjectFilm }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.load();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [film.projectSlug, film.src]);

  return <section className="media-film" data-project={film.projectSlug}>
    <div><span>Final Film</span><i>{label}</i></div>
    <video
      key={`${film.projectSlug}:${film.src}`}
      ref={videoRef}
      controls
      preload="metadata"
      playsInline
      src={assetPath(film.src)}
      autoPlay={film.autoPlay}
      loop={film.loop}
      muted={film.muted}
      aria-label={`${label} video`}
    />
  </section>;
}
function Pipeline({ items }: { items: PipelineItem[] }) {
  return <section className="pipeline"><SectionTitle english="Production Pipeline" chinese="制作流程" /><div className="pipeline-grid">{items.map(([title, tool, description], index) => <article key={title}><small>{String(index + 1).padStart(2, "0")}</small><h3>{title}</h3><i>{tool}</i><p>{description}</p></article>)}</div></section>;
}
function SectionTitle({ english, chinese }: { english: string; chinese: string }) {
  return <header className="section-title"><span>{english}</span><h2>{chinese}</h2></header>;
}
function ArtFrame({ tone, label, src, portrait, className, onOpen }: { tone: string; label: string; src?: string; portrait?: boolean; className?: string; onOpen: (item: LightboxItem) => void }) {
  return <button className={`art-frame tone-${tone} ${portrait ? "portrait-art" : ""} ${className ?? ""}`} onClick={() => onOpen({ label, tone, src })}>
    {src && <img src={assetPath(src)} alt={label} loading="lazy" />}
    <span>{label}</span><i>View ↗</i>
  </button>;
}
function InfoBlock({ index, title, text }: { index: string; title: string; text: string }) {
  return <article className="info-block"><small>{index}</small><h3>{title}</h3><p>{text}</p></article>;
}
function NextProject({ categoryId, projectId, navigate }: { categoryId: string; projectId: string; navigate: (view: View) => void }) {
  const list = projects[categoryId] ?? []; const index = list.findIndex((item) => item.id === projectId); const next = list[index + 1];
  return <footer className="project-footer"><button onClick={() => navigate({ type: "works" })}>返回作品目录</button>{next && <button onClick={() => navigate({ type: "project", category: categoryId, project: next.id })}>下一个项目：{next.title}　→</button>}</footer>;
}
