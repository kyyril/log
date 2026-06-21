<script lang="ts">
  import { itemsStore, isLoadingStore } from "../lib/store";
  import ArchiveCard from "../components/ArchiveCard.svelte";
  import ArchiveCardSkeleton from "../components/ArchiveCardSkeleton.svelte";
  import { reveal } from "../lib/reveal";
  import type { Status } from "../types";

  export let navigate: (page: string) => void = () => {};

  const title = "GAMES";
  let searchQuery = "";
  let selectedStatus: Status | "all" = "all";

  $: rawItems = $itemsStore.filter((item) => item.category === "games");

  $: filteredItems = rawItems
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => a.title.localeCompare(b.title))
</script>

<section class="py-10 md:py-24 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto">
  <div class="relative w-full h-40 md:h-56 mb-8 overflow-hidden rounded-lg">
    <img
      src="/section/gameSection.png"
      alt="Games Section"
      class="absolute inset-0 w-full h-full object-contain object-right"
    />
    <div
      class="absolute inset-0 flex pointer-events-none justify-end pr-8 items-center"
    >
      <span
        class="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent"
        style="-webkit-text-stroke: 2px black; paint-order: stroke fill;"
        >{title}</span
      >
    </div>
  </div>

  <div class="mb-5">
    <button
      type="button"
      on:click={() => navigate("")}
      class="text-xs text-text-secondary hover:text-foreground transition flex items-center gap-1 mb-4"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        /></svg
      >
      Back to Home
    </button>

    <div class="flex gap-2">
      <!-- Search Input -->
      <div class="relative flex-grow">
        <input
          type="text"
          placeholder="Search games..."
          bind:value={searchQuery}
          class="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:bg-white transition-all"
        />
        <svg
          class="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Status Dropdown (Select) -->
      <select
        bind:value={selectedStatus}
        class="px-2.5 py-2 rounded-lg bg-gray-50/50 text-xs font-semibold text-text-secondary uppercase focus:outline-none focus:bg-white transition-all cursor-pointer"
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="in-progress">In Progress</option>
        <option value="dropped">Dropped</option>
        <option value="planned">Planned</option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    {#if $isLoadingStore && rawItems.length === 0}
      {#each Array(8) as _}
        <ArchiveCardSkeleton />
      {/each}
    {:else if filteredItems.length === 0}
      <div class="col-span-full py-16 text-center text-text-secondary text-sm">
        No games match your criteria.
      </div>
    {:else}
      {#each filteredItems as item, i (item.id)}
        <div use:reveal={{ delay: (i % 4) * 60 }}>
          <ArchiveCard {item} />
        </div>
      {/each}
    {/if}
  </div>
</section>
