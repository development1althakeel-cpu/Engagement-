(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var opening = document.querySelector(".opening");
  var experience = document.querySelector(".experience");

  function rememberOpen() {
    try {
      sessionStorage.setItem("invite-open", "1");
    } catch (e) {}
  }

  function showExperience() {
    document.body.classList.remove("locked");
    if (experience) experience.classList.add("visible");
    rememberOpen();
  }

  if (opening) {
    var already = document.documentElement.classList.contains("invite-open");
    if (already || reduce) {
      opening.remove();
      showExperience();
    } else {
      var seal = opening.querySelector(".seal-button");
      var busy = false;
      function openInvite() {
        if (busy) return;
        busy = true;
        opening.classList.add("opening-now");
        window.setTimeout(function () {
          opening.classList.add("exiting");
          showExperience();
        }, 720);
        window.setTimeout(function () {
          opening.remove();
        }, 1900);
      }
      if (seal) seal.addEventListener("click", openInvite);
    }
  } else {
    document.body.classList.remove("locked");
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var bar = document.querySelector(".scroll-progress");
  var storyPhoto = document.querySelector(".story-photo");
  var storySheet = document.querySelector(".story-sheet");
  var storyVeil = document.querySelector(".story-veil");
  var scrollTicking = false;

  function paintScroll() {
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    }
    if (!storyPhoto || !storySheet || reduce) return;
    var vh = window.innerHeight || 1;
    var top = storySheet.getBoundingClientRect().top;
    var start = vh * 0.92;
    var end = vh * 0.2;
    var t = (start - top) / (start - end);
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    var eased = t * t * (3 - 2 * t);
    storyPhoto.style.opacity = (1 - eased * 0.48).toFixed(3);
    storyPhoto.style.transform =
      "translate3d(0," + (-22 * eased).toFixed(1) + "px,0) scale(" + (1 - eased * 0.035).toFixed(3) + ")";
    if (storyVeil) storyVeil.style.opacity = (eased * 0.5).toFixed(3);
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      scrollTicking = false;
      paintScroll();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  paintScroll();

  function inviteUrl() {
    var url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/details\.html$/i, "");
    url.pathname = url.pathname.replace(/index\.html$/i, "");
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    url.search = "";
    url.hash = "";
    return url.href;
  }

  var shareText =
    "അരുണിന്റെയും ഐശ്വര്യയുടെയും നിശ്ചയത്തിലേക്ക് താങ്കളെ സാദരം ക്ഷണിക്കുന്നു. ഞായറാഴ്ച, 29 നവംബർ 2026, രാവിലെ 11:00 മുതൽ. ലിറ്റിൽ ബേ ഇവന്റ്സ്, യൂണിറ്റി നഗർ, കുറിയച്ചിറ.";

  function toast(message) {
    var t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add("visible");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () {
      t.classList.remove("visible");
    }, 2400);
  }

  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = inviteUrl();
      var payload = { title: "അരുൺ & ഐശ്വര്യ", text: shareText, url: url };
      if (navigator.share) {
        navigator.share(payload).catch(function (err) {
          if (err && err.name === "AbortError") return;
          copyInvite(url);
        });
      } else {
        copyInvite(url);
      }
    });
  });

  function copyInvite(url) {
    var full = shareText + "\n" + url;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(full).then(
        function () {
          toast("ക്ഷണം പകർത്തി");
        },
        function () {
          toast(url);
        }
      );
    } else {
      toast(url);
    }
  }

  var overlay = document.querySelector(".thanks-overlay");
  var petalField = document.querySelector(".petal-field");
  if (petalField && !petalField.childElementCount) {
    var colors = ["#f6e2c4", "#e7b56a", "#f3d7a4", "#fffaf1", "#e39a3c"];
    for (var i = 0; i < 16; i++) {
      var petal = document.createElement("i");
      petal.className = "petal";
      petal.style.setProperty("--x", Math.random() * 100 + "%");
      petal.style.setProperty("--size", 8 + Math.random() * 10 + "px");
      petal.style.setProperty("--dur", 7 + Math.random() * 6 + "s");
      petal.style.setProperty("--delay", -Math.random() * 8 + "s");
      petal.style.setProperty("--rot", Math.random() * 80 + "deg");
      petal.style.setProperty("--sway", Math.random() * 90 - 45 + "px");
      petal.style.background = colors[i % colors.length];
      petalField.appendChild(petal);
    }
  }

  document.querySelectorAll("[data-bless]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (overlay) overlay.classList.add("active");
    });
  });

  function closeThanks() {
    if (overlay) overlay.classList.remove("active");
  }

  document.querySelectorAll("[data-close-thanks]").forEach(function (btn) {
    btn.addEventListener("click", closeThanks);
  });
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeThanks();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeThanks();
  });

  var cd = document.querySelector("[data-countdown]");
  if (cd) {
    var target = new Date("2026-11-29T11:00:00+05:30").getTime();
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        cd.textContent = "This evening is here";
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      cd.innerHTML =
        "<span><strong>" +
        days +
        "</strong> days</span><span><strong>" +
        hours +
        "</strong> hrs</span><span><strong>" +
        mins +
        "</strong> min</span>";
    };
    tick();
    window.setInterval(tick, 30000);
  }
})();
