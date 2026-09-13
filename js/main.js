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
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -1000, y: -1000, radius: 170 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Shockwave ripples on click
  const shockwaves = [];
  window.addEventListener('click', (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 4,
      maxRadius: 180,
      opacity: 0.85,
      speed: 6.5
    });
  });

  const particleCount = Math.min(Math.floor((width * height) / 17000), 80);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 1.8 + 1.2,
      baseAlpha: Math.random() * 0.4 + 0.3
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += sw.speed;
      sw.opacity *= 0.94;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${sw.opacity})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (sw.opacity < 0.02 || sw.radius > sw.maxRadius) {
        shockwaves.splice(s, 1);
      }
    }

    // Update particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 2.8;
        p.y -= (dy / dist) * force * 2.8;
      }

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.baseAlpha})`;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw proximity lines between particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 125) {
          const alpha = (1 - dist2 / 125) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Draw line to mouse
      if (dist < mouse.radius) {
        const alpha = (1 - dist / mouse.radius) * 0.45;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. CUSTOM DUAL MAGNETIC CYBER CURSOR
   ========================================================================== */
function initMagneticCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isVisible = true;
    }
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Interactive target triggers
  const interactiveTargets = document.querySelectorAll('a, button, input, textarea, .tilt-element, .tech-card-vertical, .hero-tech-card');
  interactiveTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-active'));
  });
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
   7. AMBIENT MOUSE SPOTLIGHT
   ========================================================================== */
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderSpotlight() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderSpotlight);
  }

  requestAnimationFrame(renderSpotlight);
}

/* ==========================================================================
   8. 3D PERSPECTIVE CARD TILT
   ========================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');
  if (tiltElements.length === 0) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  tiltElements.forEach((el) => {
    const maxTilt = 7.5;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      const rotX = -(normY * maxTilt).toFixed(2);
      const rotY = (normX * maxTilt).toFixed(2);

      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
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
  const tabs = document.querySelectorAll('.dsa-tab-btn');
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
  const nodeCards = document.querySelectorAll('.arch-node-card');
  const panel = document.getElementById('archInspectorPanel');
  const panelTitle = document.getElementById('archPanelTitle');
  const panelDesc = document.getElementById('archPanelDesc');
  const panelTech = document.getElementById('archPanelTech');
  const panelRole = document.getElementById('archPanelRole');

  if (!panel || nodeCards.length === 0) return;

  const nodeDetails = {
    user: {
      title: "Client & Web Applications",
      role: "Traffic Origin & Interface Layer",
      desc: "Web visitors, mobile clients, and external consumer apps initiating authenticated HTTP/REST, WebSocket, and SSE connections.",
      tech: "React 19, Next.js, WebSockets, Tailwind, HTML5"
    },
    frontend: {
      title: "Next.js / React Edge Frontend",
      role: "Client Presentation & SSR Delivery",
      desc: "Server-side rendered (SSR) React frontends deployed on edge networks with client-side state hydration and optimistic UI updates.",
      tech: "Next.js App Router, React Context, TailwindCSS, Zod validation"
    },
    gateway: {
      title: "Unified API Gateway",
      role: "Traffic Ingestion, Reverse Proxy & Rate Limiting",
      desc: "Single entry point terminating SSL, validating JWT tokens, managing burst rate limits via Redis token buckets, and proxying downstream to microservices.",
      tech: "Nginx / FastAPI Gateway, Redis Token Bucket, CORS, SSL termination"
    },
    services: {
      title: "Domain Microservices Cluster",
      role: "Business Logic, Auth, & GenAI Pipelines",
      desc: "Decoupled microservice containers running independently. Includes Auth service, Real-Time Chat WebSocket worker, Rental Booking engine, and Gemini RAG pipeline.",
      tech: "FastAPI, Node.js, Express, Python 3.12, Docker, Pydantic"
    },
    db: {
      title: "Distributed Data Stores",
      role: "Persistent Storage, Vector Indexes, & High-Speed Cache",
      desc: "Hybrid database architecture: PostgreSQL for ACID transactions, MongoDB for unstructured chats, ChromaDB for vector cosine similarities, and Redis for 1ms caching.",
      tech: "PostgreSQL, MongoDB Atlas, ChromaDB Vector DB, Redis Cluster"
    }
  };

  nodeCards.forEach((card) => {
    card.addEventListener('click', () => {
      nodeCards.forEach((c) => c.classList.remove('active-node'));
      card.classList.add('active-node');

      const nodeKey = card.dataset.node;
      const data = nodeDetails[nodeKey];

      if (data) {
        panel.style.opacity = '0';
        setTimeout(() => {
          if (panelTitle) panelTitle.textContent = data.title;
          if (panelRole) panelRole.textContent = data.role;
          if (panelDesc) panelDesc.textContent = data.desc;
          if (panelTech) panelTech.textContent = data.tech;
          panel.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   12. HEADER SCROLL & BACK TO TOP
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. SCROLL SPY NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length === 0 || navLinks.length === 0) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.nav === currentId);
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   14. PROJECT DETAIL MODAL
   ========================================================================== */
const PROJECT_MODAL_DATA = {
  fluxchat: {
    title: "FluxChat — Real-Time Chat & Collaboration Platform",
    category: "Distributed Full-Stack Application",
    metrics: "Sub-50ms latency • 10k concurrent connections • WebSockets",
    overview: "Production-ready real-time communication platform architected as a set of distributed microservices. Features instant text messaging, live audio/video rooms using WebRTC, channels, thread replies, and JWT authenticated private rooms.",
    architecture: [
      "Client Layer: Next.js 16 with React 19 optimistic state updates and WebSocket subscriptions",
      "API Gateway: Reverse proxy terminating TLS and enforcing IP token-bucket rate limits",
      "WebSocket Worker: Async FastAPI service broadcasting room events to subscribed clients",
      "Data Layer: MongoDB for conversation logs and Redis pub/sub for cross-node socket broadcasting"
    ],
    tech: ["Next.js", "React 19", "FastAPI", "MongoDB", "Redis", "WebSockets", "Docker"],
    github: "https://github.com/Jyoti-jitu",
    live: "https://github.com/Jyoti-jitu"
  },
  renthub: {
    title: "RentHub — Multi-Tenant Vehicle Rental Platform",
    category: "Full-Stack Web & Booking System",
    metrics: "100% ACID booking concurrency • Razorpay Webhooks • Multi-tier RBAC",
    overview: "Enterprise-grade vehicle rental and fleet management platform. Allows customers to browse, filter, reserve, and pay for vehicles, while providing agency owners with fleet metrics, pricing rules, and rental approvals.",
    architecture: [
      "Frontend: React with responsive dashboard layout, search filters, and vehicle detail views",
      "Backend: Node.js / Express REST API implementing strict schema validation with Zod",
      "Database: PostgreSQL with row-level locks preventing double-booking of vehicles",
      "Payments: Integrated Razorpay webhook handlers with automated idempotency keys"
    ],
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Razorpay", "JWT", "Docker"],
    github: "https://github.com/Jyoti-jitu",
    live: "https://github.com/Jyoti-jitu"
  },
  rag: {
    title: "Gemini RAG Studio — Production RAG Engine",
    category: "Generative AI & Semantic Vector Search",
    metrics: "Cosine similarity search • Multi-format parsing • 98% factual precision",
    overview: "End-to-end Retrieval-Augmented Generation application. Ingests PDFs, markdown files, and technical documentation, computes high-dimensional vector embeddings, and performs semantic query matching with grounded responses via Google Gemini.",
    architecture: [
      "Ingestion Pipeline: Document chunker with recursive character overlap and token counting",
      "Embedding Engine: Google Gemini text-embedding models with batch vector generation",
      "Vector Storage: ChromaDB vector store running local cosine similarity queries",
      "Generation Service: FastAPI orchestration layer injecting retrieved context into prompts"
    ],
    tech: ["Python", "FastAPI", "Google Gemini", "ChromaDB", "LangChain", "Docker"],
    github: "https://github.com/Jyoti-jitu",
    live: "https://github.com/Jyoti-jitu"
  },
  vault: {
    title: "Personal Vault — Secure Digital Asset Management",
    category: "Security & Cloud Storage Architecture",
    metrics: "Client-side AES-256-GCM • Zero-knowledge auth • Supabase Row Security",
    overview: "Security-hardened cloud storage solution for sensitive personal assets, documents, and credentials. Implements client-side client cryptographic key derivation so zero plaintext data ever reaches the storage backend.",
    architecture: [
      "Encryption Layer: Web Crypto API client-side AES-GCM encryption before payload upload",
      "Auth: Supabase authentication with Argon2 password hashing and 2FA support",
      "Storage: Encrypted blob storage with presigned URLs and granular row-level policies",
      "Access Control: Automated session revocation upon suspicious IP or user-agent change"
    ],
    tech: ["React", "Node.js", "Supabase", "PostgreSQL", "Web Crypto API", "TailwindCSS"],
    github: "https://github.com/Jyoti-jitu",
    live: "https://github.com/Jyoti-jitu"
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalBody = document.getElementById('modalBody');
  const cards = document.querySelectorAll('.project-hologram-card');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = PROJECT_MODAL_DATA[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="modal-category">${data.category}</span>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-metrics-pill">${data.metrics}</div>
      </div>

      <div class="modal-section">
        <h3>System Overview</h3>
        <p>${data.overview}</p>
      </div>

      <div class="modal-section">
        <h3>Architecture & Engineering Decisions</h3>
        <ul class="modal-arch-list">
          ${data.architecture.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h3>Technologies Used</h3>
        <div class="modal-tech-chips">
          ${data.tech.map((t) => `<span class="tech-cyber-chip">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions-row">
        <a href="${data.github}" target="_blank" rel="noopener" class="btn-cyber-primary">
          <span>Inspect Source Code</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked direct github anchor, let it pass
      if (e.target.closest('a')) return;
      const pid = card.dataset.project;
      if (pid) openModal(pid);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

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
   15. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contactName')?.value.trim();
    const email = form.querySelector('#contactEmail')?.value.trim();
    const message = form.querySelector('#contactMessage')?.value.trim();

    if (!name || !email || !message) {
      if (alertBox) {
        alertBox.textContent = 'Please populate all fields before dispatching transmission.';
        alertBox.className = 'contact-alert error';
        alertBox.style.display = 'block';
      }
      return;
    }

    // Compose mailto
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:parhijyotiswarup@gmail.com?subject=${subject}&body=${body}`;

    if (alertBox) {
      alertBox.textContent = 'Opening default email client... Thank you for reaching out!';
      alertBox.className = 'contact-alert success';
      alertBox.style.display = 'block';
    }

    window.location.href = mailtoUrl;
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
