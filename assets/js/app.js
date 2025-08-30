    // ------------------------------
    // Utilities & interactions
    // ------------------------------
    const $ = (s, root=document) => root.querySelector(s);
    const $$ = (s, root=document) => [...root.querySelectorAll(s)];

    // Top progress bar
    const bar = $("#scrollbar");
    const onScroll = () => {
      const st = document.documentElement.scrollTop || document.body.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = `${(st / h) * 100}%`;
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Typing effect
    const phrases = [
      "Power Platform Expert",
      "Microsoft 365 Specialist",
      "Cloud Infrastructure Architect",
      "Digital Transformation Leader",
      "Process Automation Champion"
    ];
    (function typing(el, i=0, j=0, del=false){
      const p = phrases[i % phrases.length];
      el.textContent = del ? p.slice(0, j--) : p.slice(0, j++);
      let speed = del ? 40 : 80;
      if (!del && j === p.length) { speed = 1500; del = true; }
      if (del && j === 0) { del = false; i++; speed = 400; }
      setTimeout(() => typing(el, i, j, del), speed);
    })($("#typing"));

    // Counters
    const kpiEls = $$(".kpi strong");
    const animateCounters = () => {
      kpiEls.forEach(el => {
        const target = Number(el.dataset.count || 0);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const from = el.dataset.from ? Number(el.dataset.from) : 0;
        const to = el.dataset.to ? Number(el.dataset.to) : null;

        let v = 0; const step = Math.max(1, Math.round(target/60));
        const tick = () => {
          if (to) { el.textContent = `${from}→${to}`; return; }
          v = Math.min(target, v + step);
          el.textContent = `${prefix}${v}${suffix}`;
          if (v < target) requestAnimationFrame(tick);
        };
        tick();
      });
    };

    // Reveal on scroll + trigger counters in Hero once visible
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          if (e.target.id === "home") animateCounters();
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    // mark reveal targets
    $$(".reveal, #home").forEach(el => io.observe(el));

    // ScrollSpy
    const sections = ["about","skills","projects","experience","contact"].map(id => ({ id, el: document.getElementById(id) }));
    const setActive = () => {
      const y = window.scrollY + 84;
      let current = null;
      for (const s of sections) {
        if (s.el && s.el.offsetTop <= y) current = s.id;
      }
      $$("#nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
      $$("#drawer a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
    };
    document.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("load", setActive);

    // Mobile drawer
    const hamburger = $(".hamburger");
    const drawer = $("#drawer");
    const closeDrawer = () => { drawer.setAttribute("aria-hidden", "true"); hamburger.setAttribute("aria-expanded","false"); };
    hamburger.addEventListener("click", () => {
      const open = drawer.getAttribute("aria-hidden") === "true";
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    $$("#drawer a").forEach(a => a.addEventListener("click", closeDrawer));

    // Contact form (client-side validation + friendly status)
    const form = $("#contactForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("#formStatus");
      const btn = form.querySelector("button[type=submit]");
      const data = Object.fromEntries(new FormData(form).entries());

      // basic client validation
      if (!data.name || data.name.trim().length < 2) return status.textContent = "Please enter your name.";
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return status.textContent = "Enter a valid email.";
      if (!data.message || data.message.trim().length < 10) return status.textContent = "Please include a short message (10+ chars).";

        btn.disabled = true; btn.textContent = "Sending…"; status.textContent = "";

        try {
          const res = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error("Request failed");
          btn.textContent = "Message sent!";
          status.textContent = "Thanks! I’ll get back to you shortly.";
          setTimeout(() => { btn.disabled = false; btn.textContent = "Send Message"; form.reset(); }, 1800);
        } catch (err) {
          status.textContent = "Failed to send message. Please try again later.";
          btn.disabled = false;
          btn.textContent = "Send Message";
        }
    });

    // Year
    $("#year").textContent = new Date().getFullYear();
