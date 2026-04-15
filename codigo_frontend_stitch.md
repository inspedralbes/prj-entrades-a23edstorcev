<html><head>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/></head><body class="dark bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">```html
<meta charset="utf-8"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&amp;family=Inter:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "on-tertiary-fixed-variant": "#4600a8",
                "error-container": "#a70138",
                "surface-tint": "#f382ff",
                "outline-variant": "#40485d",
                "inverse-on-surface": "#4d556b",
                "surface-container": "#0f1930",
                "surface": "#060e20",
                "on-tertiary-container": "#000000",
                "on-surface": "#dee5ff",
                "tertiary-fixed-dim": "#b091ff",
                "on-secondary": "#004b58",
                "on-secondary-fixed-variant": "#005969",
                "surface-container-low": "#091328",
                "on-tertiary-fixed": "#1f0052",
                "error-dim": "#d73357",
                "surface-container-high": "#141f38",
                "on-error": "#490013",
                "surface-dim": "#060e20",
                "background": "#060e20",
                "on-tertiary": "#280067",
                "primary-fixed": "#ed69ff",
                "on-surface-variant": "#a3aac4",
                "surface-container-highest": "#192540",
                "secondary-dim": "#40ceed",
                "on-primary-fixed-variant": "#51005d",
                "on-error-container": "#ffb2b9",
                "on-primary-container": "#41004c",
                "on-secondary-fixed": "#003a45",
                "primary": "#f382ff",
                "secondary": "#53ddfc",
                "primary-container": "#ed69ff",
                "on-primary-fixed": "#000000",
                "primary-dim": "#ec63ff",
                "tertiary-container": "#8f60fa",
                "primary-fixed-dim": "#e451f9",
                "tertiary": "#ac8aff",
                "inverse-primary": "#a300bb",
                "on-primary": "#540061",
                "tertiary-fixed": "#bda2ff",
                "secondary-container": "#00687a",
                "on-background": "#dee5ff",
                "secondary-fixed": "#65e1ff",
                "secondary-fixed-dim": "#48d4f3",
                "surface-container-lowest": "#000000",
                "error": "#ff6e84",
                "inverse-surface": "#faf8ff",
                "tertiary-dim": "#8455ef",
                "on-secondary-container": "#ecfaff",
                "outline": "#6d758c",
                "surface-bright": "#1f2b49",
                "surface-variant": "#192540"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "fontFamily": {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
        }
      },
    },
  }
</script>
<style>
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  .neon-glow-primary {
    box-shadow: 0 0 20px rgba(243, 130, 255, 0.4);
  }
  .neon-glow-secondary {
    box-shadow: 0 0 20px rgba(83, 221, 252, 0.4);
  }
</style>
<!-- Shared Component: TopNavBar -->
<nav class="fixed top-0 w-full z-50 bg-[#060e20]/70 backdrop-blur-2xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-8 font-['Plus_Jakarta_Sans'] tracking-tight">
<div class="text-2xl font-black italic tracking-tighter text-[#f382ff]">THE NEON CURATOR</div>
<div class="hidden md:flex items-center gap-8">
<a class="text-[#dee5ff] hover:text-[#53ddfc] transition-colors hover:opacity-80 transition-all duration-300" href="#">Events</a>
<a class="text-[#dee5ff] hover:text-[#53ddfc] transition-colors hover:opacity-80 transition-all duration-300" href="#">Venues</a>
<a class="text-[#dee5ff] hover:text-[#53ddfc] transition-colors hover:opacity-80 transition-all duration-300" href="#">Genres</a>
</div>
<div class="flex items-center gap-6">
<button class="scale-95 active:scale-90 transition-transform hover:opacity-80">
<span class="material-symbols-outlined text-[#f382ff] text-2xl">account_circle</span>
</button>
<button class="scale-95 active:scale-90 transition-transform hover:opacity-80">
<span class="material-symbols-outlined text-[#f382ff] text-2xl">shopping_bag</span>
</button>
</div>
</nav>
<!-- Main Content Canvas -->
<main class="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden">
<!-- Atmospheric Background Elements -->
<div class="absolute inset-0 pointer-events-none">
<div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full"></div>
</div>
<!-- Content Container -->
<div class="relative z-10 w-full max-w-4xl px-6 py-12 md:py-24 text-center">
<!-- Editorial Headline Area -->
<div class="mb-12">
<span class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high text-secondary font-label text-xs tracking-widest uppercase mb-6 border border-outline-variant/20">
<span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          Live Queue Active
        </span>
<h1 class="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
          You are in line for <br/>
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">CYBERPUNK RHYTHMS 2024</span>
</h1>
<p class="text-on-surface-variant font-body text-lg max-w-xl mx-auto">
          We’re experiencing high demand. Hang tight while we secure your spot in the digital front row.
        </p>
</div>
<!-- Bento-style Queue Info -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
<!-- Spot Card -->
<div class="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-primary">group</span>
</div>
<p class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2">Your current spot</p>
<p class="text-5xl font-headline font-black text-primary tracking-tighter">1,420</p>
<div class="mt-4 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(243,130,255,0.6)]"></div>
</div>
</div>
<!-- Wait Time Card -->
<div class="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-secondary">schedule</span>
</div>
<p class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2">Estimated wait</p>
<p class="text-5xl font-headline font-black text-secondary tracking-tighter">8 minutes</p>
<p class="mt-4 text-on-surface-variant text-sm font-body italic">Stay on this page to keep your place</p>
</div>
</div>
<!-- Progressive Loader Section -->
<div class="bg-surface-container p-12 rounded-xl relative overflow-hidden shadow-2xl">
<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x"></div>
<div class="flex flex-col items-center gap-8">
<!-- Circular Neon Loader Concept -->
<div class="relative w-32 h-32 flex items-center justify-center">
<div class="absolute inset-0 rounded-full border-4 border-surface-container-highest"></div>
<div class="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-transparent border-l-transparent animate-spin"></div>
<span class="material-symbols-outlined text-4xl text-primary-fixed-dim" data-weight="fill">confirmation_number</span>
</div>
<div class="space-y-2">
<div class="flex items-center justify-center gap-2 text-error font-label font-semibold text-sm uppercase tracking-widest">
<span class="material-symbols-outlined text-lg">warning</span>
              Do not refresh this page
            </div>
<p class="text-on-surface-variant text-sm max-w-sm mx-auto">
              Refreshing or leaving this page will result in losing your position in the queue.
            </p>
</div>
</div>
</div>
<!-- Visual Context Imagery -->
<div class="mt-16 relative h-64 rounded-xl overflow-hidden group">
<img alt="Concert stage with laser lights" class="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" data-alt="dramatic wide shot of a music concert stage with high-intensity pink and cyan laser beams piercing through artificial fog in a dark arena" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIGNV6vwsddIe_37E_ODlyjdT7RWMpvRPfBTcpQtG6eRyz9xUrIca4sQvyn9a86vCGoO9pVbxhS47ONZOcvEQ029y7qJVBz9tWx0Dkc6ALnYHoV6xzFXjELz865RAzu7iC5cXs1-7bdzm6wNRYXo0V1TRNTdMTnJD3SbN7-4tVPveTJJn_0f1nSUxr0wFtg26-0_lN8w9mVTZ2I4Hi-1Eu5z2zeWvYWpshViH_n7w1kl7fP1MyB1-h0LiAUNFgr9UagWrqG2raFGY"/>
<div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
<div class="absolute bottom-6 left-6 right-6 flex justify-between items-end">
<div class="text-left">
<p class="text-primary font-label text-[10px] uppercase tracking-[0.3em] font-bold">Featured Event</p>
<h3 class="text-2xl font-headline font-bold text-on-surface">Experience the Electric</h3>
</div>
<div class="flex -space-x-3">
<div class="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
<img alt="fan" class="w-full h-full object-cover" data-alt="portrait of a young woman with stylish neon makeup and glowing accessories" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQA4CCQ4b0TRpT1NIS4S57n079gQIYVdIkQcou4POJzsyXmxsntVXqVfbk2_Fv0Bnpuph7FWuxSuNkJjRlGGbreVEno2SQXPwgut9KGyczX1Iau0vpAtLxXQ_UvqJVVtWHong6ZiMyKREpuDTEU5M_WlzneBD7iLErkX3Cww5Hh6a8zeo_xkYeT87hj9bvL28jZPYZAxBiNhblY3mjmHosI5XcCi-AcU08oe_9MouxZhsR7Gl9zPsZ2KzeZ5A0GOn-CY8-k-Iaj1o"/>
</div>
<div class="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
<img alt="fan" class="w-full h-full object-cover" data-alt="close up profile of a man with intense gaze wearing high-fashion streetwear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvjFh3WzDcfwynC4AHuRxadIffkVF3iBYohB69fG8cVKdiR37A98KDPufa62dj9N6FB2Gph34M6fXHFraLton5Z8J7fD03vyjDKLgn0kndcP6SeN8BQs9rPMP9d5l9I7K67bjDfWgeakAPNrXQb6VJUYX5UfvLieLKhSd632oFhUuOz38aVyeI8FksUt_4_2Yem1h0TcW9OOvZuOJ1eGSwMPlTV_6kNc7KJkg5TNk6vS2sWmGBLccboP6-eYp2aK-n96IDSZrMBpA"/>
</div>
<div class="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-secondary">
                +2k
            </div>
</div>
</div>
</div>
</div>
</main>
<!-- Shared Component: Footer -->
<div class="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
<div class="text-lg font-bold text-[#f382ff]">THE NEON CURATOR</div>
<div class="flex flex-wrap justify-center gap-6">
<a class="text-[#a3aac4] hover:text-[#53ddfc] transition-colors font-['Inter'] text-xs tracking-widest uppercase opacity-100 hover:opacity-70" href="#">Terms of Service</a>
<a class="text-[#a3aac4] hover:text-[#53ddfc] transition-colors font-['Inter'] text-xs tracking-widest uppercase opacity-100 hover:opacity-70" href="#">Privacy Policy</a>
<a class="text-[#a3aac4] hover:text-[#53ddfc] transition-colors font-['Inter'] text-xs tracking-widest uppercase opacity-100 hover:opacity-70" href="#">Help Center</a>
<a class="text-[#a3aac4] hover:text-[#53ddfc] transition-colors font-['Inter'] text-xs tracking-widest uppercase opacity-100 hover:opacity-70" href="#">Accessibility</a>
</div>
<div class="text-[#a3aac4] font-['Inter'] text-xs tracking-widest uppercase">
        © 2024 THE NEON CURATOR. ALL RIGHTS RESERVED.
      </div>
</div>
</footer>

```</body></html>