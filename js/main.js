/**
 * JYOTI SWARUP PARHI — CYBER-NEURAL OPERATING SYSTEM ENGINE
 * 
 * Features:
 * 1. Interactive Neural Constellation Canvas (#neuralCanvas) with Shockwaves & Proximity Lines
 * 2. Custom Dual Magnetic Cyber Cursor (#cursorDot, #cursorRing) with Snap Target Physics
 * 3. Cyber Text Scramble / Decoder Engine for Dynamic Typography
 * 4. Native Web Audio SFX Synthesizer with Header Toggle ([AUDIO: OFF / ON])
 * 5. Interactive Terminal Shell with Real Command Parsing (help, skills, projects, about, etc.)
 * 6. Live Telemetry FPS Monitor
 * 7. 3D Perspective Card Tilt with Eased Physics
 * 8. Dynamic Ambient Mouse Spotlight (#mouseSpotlight)
 * 9. Scroll Reveal Animations with Staggered Delays
 * 10. Interactive DSA Code Switcher (LRU Cache, Rotated Binary Search, Two Pointers)
 * 11. Interactive Microservices Architecture Inspector with Signal Pulse Packet
 * 12. Project Detail Modal, Contact Mailer, and Nav Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initMagneticCursor();
  initTextScramble();
  initWebAudio();
  initInteractiveTerminal();
  initFpsMeter();
  initMouseSpotlight();
  init3DTilt();
  initScrollReveal();
  initDSACodeTabs();
  initHeaderScroll();
  initBackToTop();
  initScrollSpy();
  initArchitectureInspector();
  initProjectModal();
  initContactForm();
  initResumeButtons();
  initDynamicYear();
});

/* ==========================================================================
   1. INTERACTIVE NEURAL CONSTELLATION CANVAS
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let isScrolling = false;
  let scrollTimeout = null;
  let isTabHidden = false;
  let rafId = null;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  // Pause canvas rendering during active scroll so user gets buttery 60-120fps scrolling
  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      if (!rafId && !isTabHidden) {
        rafId = requestAnimationFrame(render);
      }
    }, 70);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isTabHidden = document.hidden;
    if (!isTabHidden && !rafId) {
      rafId = requestAnimationFrame(render);
    }
  });

  const mouse = { x: -1000, y: -1000, radiusSq: 160 * 160 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Shockwave ripples on click (capped at 2 max)
  const shockwaves = [];
  window.addEventListener('click', (e) => {
    if (shockwaves.length < 2) {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 160,
        opacity: 0.8,
        speed: 7
      });
    }
  });

  // Optimal particle count: 32 on desktop, 16 on mobile for silky 60+ FPS
  const particleCount = width < 768 ? 16 : 32;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      radius: Math.random() * 1.5 + 1.2,
      baseAlpha: Math.random() * 0.35 + 0.25
    });
  }

  const maxDist = 115;
  const maxDistSq = maxDist * maxDist;

  function render() {
    rafId = null;
    if (isTabHidden || isScrolling) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += sw.speed;
      sw.opacity *= 0.94;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${sw.opacity.toFixed(2)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (sw.opacity < 0.03 || sw.radius > sw.maxRadius) {
        shockwaves.splice(s, 1);
      }
    }

    // Update particle physics
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion (squared distance)
      if (mouse.x > 0) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouse.radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (160 - dist) / 160;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    // BATCH DRAW ALL PROXIMITY LINES IN A SINGLE GPU CALL
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 0.75;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
    }
    ctx.stroke();

    // BATCH DRAW ALL PARTICLES IN A SINGLE GPU CALL (Zero shadowBlur overhead!)
    ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.moveTo(p.x + p.radius, p.y);
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    }
    ctx.fill();

    rafId = requestAnimationFrame(render);
  }

  rafId = requestAnimationFrame(render);
}

/* ==========================================================================
   2. CUSTOM DUAL MAGNETIC CYBER CURSOR (GPU Accelerated & Sleep-Capable)
   ========================================================================== */
function initMagneticCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      ringX = mouseX;
      ringY = mouseY;
      isVisible = true;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!rafId) {
      rafId = requestAnimationFrame(renderRing);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;

    // Only continue loop if ring is still catching up (Sleeps when idle!)
    if (Math.abs(mouseX - ringX) > 0.3 || Math.abs(mouseY - ringY) > 0.3) {
      rafId = requestAnimationFrame(renderRing);
    } else {
      rafId = null;
    }
  }

  // Efficient event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, textarea, .tilt-element, .tech-card-vertical, .hero-tech-card, .diag-node, .diag-sub-card, .dsa-tab-btn')) {
      ring.classList.add('cursor-active');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, textarea, .tilt-element, .tech-card-vertical, .hero-tech-card, .diag-node, .diag-sub-card, .dsa-tab-btn')) {
      ring.classList.remove('cursor-active');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. CYBER TEXT SCRAMBLE / DECODER ENGINE
   ========================================================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________01';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 15);
      const end = start + Math.floor(Math.random() * 15);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.el.classList.add('scrambling');
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.el.classList.remove('scrambling');
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initTextScramble() {
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  scrambleElements.forEach((el) => {
    const originalText = el.innerText.trim();
    const scrambler = new TextScramble(el);

    el.addEventListener('mouseenter', () => {
      if (!el.classList.contains('scrambling')) {
        scrambler.setText(originalText);
      }
    });
  });
}

/* ==========================================================================
   4. NATIVE WEB AUDIO SFX SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let audioEnabled = false;

function initWebAudio() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  const statusText = document.getElementById('audioStatusText');
  if (!toggleBtn) return;

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(startFreq, endFreq, duration, type = 'sine') {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  toggleBtn.addEventListener('click', () => {
    ensureAudioContext();
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      toggleBtn.classList.add('audio-active');
      statusText.textContent = 'AUDIO: ON';
      playTone(600, 1200, 0.08);
    } else {
      toggleBtn.classList.remove('audio-active');
      statusText.textContent = 'AUDIO: OFF';
    }
  });

  // Attach micro sound to clicks and hovers
  const clickables = document.querySelectorAll('a, button, .nav-link, .tech-card-vertical, .hero-tech-card, .dsa-tab-btn');
  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (audioEnabled) playTone(900, 1400, 0.035, 'sine');
    });
    el.addEventListener('click', () => {
      if (audioEnabled) playTone(1400, 700, 0.05, 'triangle');
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE TERMINAL SHELL (CLI & AUTOMATED HYBRID)
   ========================================================================== */
function initInteractiveTerminal() {
  const cliInput = document.getElementById('terminalCliInput');
  const typingTarget = document.getElementById('terminalLiveText');
  const historyLog = document.getElementById('termHistoryLog');
  const modeTag = document.getElementById('termModeTag');
  if (!historyLog) return;

  const automatedCommands = [
    { cmd: "sys --check-stack", out: "[READY] Python • React • FastAPI • Docker • Next.js" },
    { cmd: "docker ps --format '{{.Names}}'", out: "fluxchat-api • auth-service • rag-engine • redis" },
    { cmd: "curl -s https://api.rag.studio/metrics", out: "status: 200 OK • Vector embeddings: Gemini + ChromaDB" },
    { cmd: "git log -1 --pretty='%h %s'", out: "7b4c91a feat: production-grade distributed microservices" },
    { cmd: "leetcode --stats", out: "Solved: LRU Cache (O(1)) • Rotated Search • Two Pointers" }
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseCounter = 0;
  let userInteracting = false;
  let timeoutId = null;

  function appendLog(command, output) {
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<span class="term-sym">$</span> <span class="term-keyword">${command}</span>`;

    const outLine = document.createElement('div');
    outLine.className = 'term-output';
    outLine.innerHTML = output;

    historyLog.appendChild(cmdLine);
    historyLog.appendChild(outLine);

    while (historyLog.children.length > 10) {
      historyLog.removeChild(historyLog.firstChild);
    }
  }

  function automatedTypeLoop() {
    if (userInteracting) return;

    const current = automatedCommands[cmdIndex];
    const fullCmd = current.cmd;

    if (!isDeleting) {
      if (typingTarget) typingTarget.textContent = fullCmd.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === fullCmd.length) {
        pauseCounter++;
        if (pauseCounter > 26) {
          appendLog(fullCmd, current.out);
          isDeleting = true;
          pauseCounter = 0;
          timeoutId = setTimeout(automatedTypeLoop, 900);
          return;
        }
      }
    } else {
      if (typingTarget) typingTarget.textContent = fullCmd.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        cmdIndex = (cmdIndex + 1) % automatedCommands.length;
        timeoutId = setTimeout(automatedTypeLoop, 450);
        return;
      }
    }

    const speed = isDeleting ? 28 : Math.random() * 40 + 35;
    timeoutId = setTimeout(automatedTypeLoop, speed);
  }

  timeoutId = setTimeout(automatedTypeLoop, 1200);

  if (cliInput) {
    cliInput.addEventListener('focus', () => {
      userInteracting = true;
      clearTimeout(timeoutId);
      if (typingTarget) typingTarget.textContent = '';
      if (modeTag) modeTag.textContent = '[USER INTERACTIVE]';
    });

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!val) return;

        let response = '';
        if (val === 'help') {
          response = 'Available commands: <span style="color:#00f0ff;">skills</span>, <span style="color:#00f0ff;">projects</span>, <span style="color:#00f0ff;">about</span>, <span style="color:#00f0ff;">contact</span>, <span style="color:#00f0ff;">matrix</span>, <span style="color:#00f0ff;">clear</span>';
        } else if (val === 'skills') {
          response = 'Full-Stack: Python, Java, JS, React, Next.js, FastAPI, Node.js, Docker, AWS, Postgres, ChromaDB';
        } else if (val === 'projects') {
          response = 'Flagship: 1. FluxChat (Chat & Audio) 2. RentHub (Vehicle Platform) 3. Gemini RAG Studio 4. Personal Vault';
        } else if (val === 'about') {
          response = 'Jyoti Swarup Parhi • B.Tech CSE @ GITA Autonomous College (CGPA: 8.6, Grad: 2027)';
        } else if (val === 'contact') {
          response = 'Email: parhijyotiswarup@gmail.com | GitHub: Jyoti-jitu | LinkedIn: in/jyoti-swarup';
        } else if (val === 'matrix') {
          response = '<span style="color:#00ff9d;">Wake up, Neo... The Matrix has you. Follow the white rabbit.</span>';
        } else if (val === 'whoami') {
          response = 'Jyoti Swarup Parhi — Full-Stack Developer & Systems Builder';
        } else if (val === 'clear') {
          historyLog.innerHTML = '';
          return;
        } else {
          response = `Command not found: "${val}". Type <span style="color:#00f0ff;">help</span> for commands.`;
        }

        appendLog(val, response);
      }
    });

    cliInput.addEventListener('blur', () => {
      if (!cliInput.value) {
        setTimeout(() => {
          userInteracting = false;
          charIndex = 0;
          isDeleting = false;
          if (modeTag) modeTag.textContent = '[LIVE SHELL]';
          automatedTypeLoop();
        }, 4000);
      }
    });
  }
}

/* ==========================================================================
   6. LIVE TELEMETRY FPS MONITOR
   ========================================================================== */
function initFpsMeter() {
  const fpsEl = document.getElementById('navFpsMeter');
  if (!fpsEl) return;

  let lastTime = performance.now();
  let frameCount = 0;

  function loop(now) {
    frameCount++;
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      fpsEl.textContent = `${fps} FPS`;
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   7. AMBIENT MOUSE SPOTLIGHT (Sleep-Capable & GPU Accelerated)
   ========================================================================== */
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(renderSpotlight);
    }
  }, { passive: true });

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    spotlight.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;

    // Sleep when close to target
    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      rafId = requestAnimationFrame(renderSpotlight);
    } else {
      rafId = null;
    }
  }
}

/* ==========================================================================
   8. 3D PERSPECTIVE CARD TILT (Cached Rect & RAF Throttled)
   ========================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');
  if (tiltElements.length === 0) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  tiltElements.forEach((el) => {
    let rect = null;
    let rafId = null;

    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect();
    }, { passive: true });

    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const normX = (x - centerX) / centerX;
        const normY = (y - centerY) / centerY;

        const rotX = -(normY * 5.5).toFixed(1);
        const rotY = (normX * 5.5).toFixed(1);

        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
      });
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rect = null;
      el.style.transform = '';
    }, { passive: true });
  });
}

/* ==========================================================================
   9. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    observer.observe(el);
  });
}

/* ==========================================================================
   10. INTERACTIVE DSA CODE SWITCHER
   ========================================================================== */
const CODE_SNIPPETS = {
  lru: `class Node:
    def __init__(self, key: int, val: int):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    """O(1) Get and Put via Hash Map + Doubly Linked List"""
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # key -> Node
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node: Node):
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def _insert(self, node: Node):
        nxt = self.head.next
        self.head.next = node
        node.prev, node.next = self.head, nxt
        nxt.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.val
        return -1

    def put(self, key: int, val: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, val)
        self._insert(node)
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,

  bsearch: `def search_rotated_sorted(nums: list[int], target: int) -> int:
    """
    Search in Rotated Sorted Array — O(log N) Time, O(1) Space
    Determines which half is strictly sorted and discards the other.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
      mid = (left + right) // 2
      if nums[mid] == target:
        return mid

      # Left half is sorted
      if nums[left] <= nums[mid]:
        if nums[left] <= target < nums[mid]:
          right = mid - 1
        else:
          left = mid + 1
      # Right half is sorted
      else:
        if nums[mid] < target <= nums[right]:
          left = mid + 1
        else:
          right = mid - 1

    return -1`,

  twopointers: `def container_with_most_water(height: list[int]) -> int:
    """
    Container With Most Water — O(N) Time, O(1) Space
    Greedy Two-Pointer inward contraction from both boundaries.
    """
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
      width = right - left
      current_water = width * min(height[left], height[right])
      max_water = max(max_water, current_water)

      # Inward move pointer with smaller boundary
      if height[left] < height[right]:
        left += 1
      else:
        right -= 1

    return max_water`
};

function initDSACodeTabs() {
  const tabs = document.querySelectorAll('.dsa-code-tab-btn, .dsa-tab-btn, .swiss-tab-btn');
  const codeDisplay = document.getElementById('dsaCodeDisplay');
  const codeTitle = document.getElementById('dsaCodeTitle');
  const codeComplexity = document.getElementById('dsaCodeComplexity');

  if (!codeDisplay || tabs.length === 0) return;

  const metadata = {
    lru: {
      title: "LRUCache.py — Hash Map + Doubly Linked List",
      complexity: "O(1) Time • O(Capacity) Space"
    },
    bsearch: {
      title: "RotatedBinarySearch.py — Logarithmic Partition",
      complexity: "O(log N) Time • O(1) Space"
    },
    twopointers: {
      title: "ContainerWithMostWater.py — Optimal Inward Convergence",
      complexity: "O(N) Time • O(1) Space"
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const snippetKey = tab.dataset.snippet;
      if (CODE_SNIPPETS[snippetKey]) {
        codeDisplay.style.opacity = '0';
        setTimeout(() => {
          codeDisplay.textContent = CODE_SNIPPETS[snippetKey];
          if (codeTitle && metadata[snippetKey]) codeTitle.textContent = metadata[snippetKey].title;
          if (codeComplexity && metadata[snippetKey]) codeComplexity.textContent = metadata[snippetKey].complexity;
          codeDisplay.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   11. INTERACTIVE MICROSERVICES ARCHITECTURE INSPECTOR
   ========================================================================== */
function initArchitectureInspector() {
  const nodes = document.querySelectorAll('.diag-flow-node, .diag-node, .diag-sub-card, .swiss-node, .swiss-sub-card');
  if (nodes.length === 0) return;

  const nodeSpecs = {
    user: "Traffic Origin: Client browsers and native mobile applications initiating HTTPS/WSS connections.",
    frontend: "Edge SSR Layer: Next.js 16 with optimistic client state updates, streaming SSR, and edge hydration.",
    gateway: "Unified Gateway: Ingestion proxy, SSL termination, JWT bearer verification, and Redis token bucket rate limiting.",
    services: "Domain Microservices: FastAPI and Node.js decoupled event-driven services communicating over async channels.",
    database: "Distributed Persistence: PostgreSQL for ACID relational data, MongoDB for chats, and ChromaDB for vector embeddings.",
    auth: "Authentication Subsystem: Stateless cryptographic JWT verification with RBAC permission scopes.",
    cache: "In-Memory Caching Sublayer: Redis cluster delivering sub-millisecond query caches and atomic token buckets.",
    apis: "External Ecosystem Integrations: Fault-tolerant outbound HTTP adapters with circuit breakers and fallback retry queues."
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      nodes.forEach((n) => n.classList.remove('active-node'));
      node.classList.add('active-node');
      const key = node.dataset.node;
      if (key && nodeSpecs[key]) {
        showToast(nodeSpecs[key]);
        const titleEl = document.getElementById('archInspectTitle');
        const descEl = document.getElementById('archInspectDesc');
        if (titleEl) titleEl.textContent = `System Layer: ${key.toUpperCase()}`;
        if (descEl) descEl.textContent = nodeSpecs[key];
      }
    });
  });
}

function showToast(message) {
  const outlet = document.getElementById('toastOutlet');
  if (!outlet) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span style="color:var(--cyber-cyan);font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">SYSTEM //</span> <span>${message}</span>`;
  outlet.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ==========================================================================
   12. UNIFIED SCROLL ENGINE & OBSERVER (Zero Layout Thrashing)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const btn = document.getElementById('backToTopBtn');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (header) {
          if (scrollY > 40) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
        if (btn) {
          if (scrollY > 500) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.nav === id);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   14. PROJECT DETAIL MODAL
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('modalCloseTrigger');
  const closeBtnBottom = document.getElementById('modalCloseBtnBottom');
  const modalImg = document.getElementById('modalImg');
  const modalYear = document.getElementById('modalYear');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeaturesList = document.getElementById('modalFeaturesList');
  const modalGithubBtn = document.getElementById('modalGithubBtn');
  const cards = document.querySelectorAll('.project-hologram-card');

  if (!modal) return;

  function openModalFromCard(card) {
    if (modalImg && card.dataset.image) modalImg.src = card.dataset.image;
    if (modalYear && card.dataset.year) modalYear.textContent = card.dataset.year;
    if (modalCategory && card.dataset.category) modalCategory.textContent = card.dataset.category;
    if (modalTitle && card.dataset.title) modalTitle.textContent = card.dataset.title;
    if (modalSubtitle && card.dataset.subtitle) modalSubtitle.textContent = card.dataset.subtitle;
    if (modalDesc && card.dataset.desc) modalDesc.textContent = card.dataset.desc;
    if (modalGithubBtn && card.dataset.github) modalGithubBtn.href = card.dataset.github;

    if (modalFeaturesList && card.dataset.features) {
      const feats = card.dataset.features.split('|');
      modalFeaturesList.innerHTML = feats.map((f) => `<li>${f.trim()}</li>`).join('');
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked direct external github link inside card actions, let it open
      if (e.target.closest('.action-trigger-gh')) return;
      openModalFromCard(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}


/* ==========================================================================
   15. CONTACT FORM (Web3Forms AJAX with Mail Client Relay Fallback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('#contactName');
    const emailInput = form.querySelector('#contactEmail');
    const msgInput = form.querySelector('#contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !email || !message) {
      if (alertBox) {
        alertBox.textContent = 'SYSTEM NOTICE: Please complete all transmission fields before dispatching.';
        alertBox.className = 'contact-form-alert error';
        alertBox.style.display = 'block';
      }
      return;
    }

    const accessKeyInput = form.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

    // If Web3Forms access key is still the placeholder, fallback gracefully
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      const subject = encodeURIComponent(`Portfolio Transmission from ${name}`);
      const body = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:parhijyotiswarup@gmail.com?subject=${subject}&body=${body}`;

      if (alertBox) {
        alertBox.innerHTML = `Relaying to local mail client... You can also email directly at <a href="mailto:parhijyotiswarup@gmail.com">parhijyotiswarup@gmail.com</a>`;
        alertBox.className = 'contact-form-alert success';
        alertBox.style.display = 'block';
      }

      window.location.href = mailtoUrl;
      return;
    }

    // Modern async transmission via Web3Forms API
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="submit-spinner"></span>
        <span>DISPATCHING TRANSMISSION...</span>
      `;
    }

    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }

    try {
      const formData = new FormData(form);
      const jsonObject = Object.fromEntries(formData.entries());

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(jsonObject)
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        const safeName = name.replace(/[<>&"']/g, '');
        if (alertBox) {
          alertBox.innerHTML = `&check; TRANSMISSION DISPATCHED // Thank you <strong>${safeName}</strong>, your message has been transmitted directly to Jyoti's primary inbox!`;
          alertBox.className = 'contact-form-alert success';
          alertBox.style.display = 'block';
        }
        form.reset();
        if (typeof showToast === 'function') {
          showToast('TRANSMISSION SENT // Inbox delivery confirmed');
        }
      } else {
        throw new Error(result.message || 'Dispatch relay failed');
      }
    } catch (err) {
      console.error('Contact transmission error:', err);
      if (alertBox) {
        alertBox.innerHTML = `Transmission could not be dispatched via cloud relay. <a href="mailto:parhijyotiswarup@gmail.com?subject=Portfolio Transmission from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}">Click here to dispatch directly via Gmail</a>.`;
        alertBox.className = 'contact-form-alert error';
        alertBox.style.display = 'block';
      }
      if (typeof showToast === 'function') {
        showToast('RELAY NOTICE // Opening mail client backup');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

/* ==========================================================================
   16. RESUME DOWNLOAD HANDLERS
   ========================================================================== */
function initResumeButtons() {
  const resumeButtons = [
    document.getElementById('navResumeBtn'),
    document.getElementById('heroResumeBtn'),
    document.getElementById('contactResumeBtn')
  ].filter(Boolean);

  resumeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // If href is #contact, smooth scroll there
      if (btn.getAttribute('href') === '#contact') {
        e.preventDefault();
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   17. DYNAMIC YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
