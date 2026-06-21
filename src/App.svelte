<script lang="ts">
  import Header from "./components/Header.svelte";
  import ArchiveSection from "./components/ArchiveSection.svelte";
  import AnimePage from "./pages/AnimePage.svelte";
  import MangaPage from "./pages/MangaPage.svelte";
  import GamesPage from "./pages/GamesPage.svelte";
  import Footer from "./components/Footer.svelte";
  import HeroSection from "./components/HeroSection.svelte";
  import { afterUpdate, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { loadData } from "./lib/store";
  import Lenis from "lenis";

  let current = "";
  let ready = false;
  let scrolling = false;
  // Key used to force transition to re-run on every navigation
  let transitionKey = 0;

  let lenisInstance: Lenis | null = null;

  const navigate = (page: string) => {
    current = page;
    transitionKey += 1;
    const url = page ? `/${page}` : "/";
    window.history.pushState({}, "", url);
    scrolling = true;
  };

  const handleRoute = () => {
    const path = window.location.pathname.replace(/^\//, "");
    if (path === "anime") current = "anime";
    else if (path === "manga") current = "manga";
    else if (path === "games") current = "games";
    else current = "";
  };

  afterUpdate(() => {
    if (scrolling) {
      scrolling = false;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  });

  onMount(() => {
    loadData();

    // Initialize Lenis smooth scroll
    lenisInstance = new Lenis({
      duration: 1.1, // fast and responsive
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ultra smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenisInstance?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  });

  if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {
      handleRoute();
      transitionKey += 1;
    });
    handleRoute();
    ready = true;
  }
</script>

{#if ready}
  <main class="min-h-screen flex flex-col bg-background overflow-x-hidden">
    <Header {navigate} />

    {#key transitionKey}
      <div in:fade={{ duration: 200, delay: 50 }} out:fade={{ duration: 150 }}>
        {#if current === "anime"}
          <AnimePage {navigate} />
        {:else if current === "manga"}
          <MangaPage {navigate} />
        {:else if current === "games"}
          <GamesPage {navigate} />
        {:else}
          <HeroSection />
          <ArchiveSection {navigate} />
        {/if}
      </div>
    {/key}

    <Footer {navigate} />
  </main>
{/if}

<style global>
  :global(html) {
    background-color: #ffffff;
  }
</style>
