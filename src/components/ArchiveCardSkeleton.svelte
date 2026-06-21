<div class="animate-pulse w-full">
  <!-- Poster image skeleton -->
  <div class="aspect-[2/3] rounded-lg bg-gray-200/80"></div>

  <!-- Title & Meta skeleton -->
  <div class="p-3">
    <!-- Title skeleton -->
    <div class="h-4 bg-gray-200/80 rounded w-3/4 mb-3"></div>
    
    <div class="flex items-center justify-between">
      <!-- Year/duration skeleton -->
      <div class="h-3 bg-gray-200/80 rounded w-1/4"></div>
      
      <!-- Stars skeleton -->
      <div class="flex gap-0.5">
        {#each Array(5) as _}
          <div class="w-3 h-3 bg-gray-200/80 rounded-full"></div>
        {/each}
      </div>
    </div>
  </div>
</div>
