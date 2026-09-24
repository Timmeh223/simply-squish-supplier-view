const video=document.querySelector('[data-hero-video]');
if(video){const motion=matchMedia('(prefers-reduced-motion: reduce)');const apply=()=>{if(motion.matches){video.pause();video.removeAttribute('src');video.load();return}video.muted=true;video.autoplay=true;if(!video.getAttribute('src'))video.src=video.dataset.src;video.play().catch(()=>{});};motion.addEventListener('change',apply);apply();}
