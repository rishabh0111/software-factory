/* software-factory site: theme toggle, copy button, entrance reveal. No dependencies. */
(function () {
  var root = document.documentElement;

  var btn = document.querySelector(".theme-toggle");
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function current() { return root.getAttribute("data-theme") || (mq.matches ? "dark" : "light"); }
  function label() { btn.textContent = "Theme: " + (current() === "dark" ? "Dark" : "Light"); }
  if (btn) {
    btn.hidden = false;
    label();
    mq.addEventListener("change", label);
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }

  var status = document.getElementById("copy-status");
  document.querySelectorAll(".cmd").forEach(function (block) {
    var code = block.querySelector("code");
    var b = block.querySelector(".copy");
    if (!code || !b) return;
    var idle = b.textContent;
    b.hidden = false;
    b.addEventListener("click", function () {
      var text = Array.prototype.map.call(code.querySelectorAll(".ln"), function (l) { return l.textContent; }).join("\n");
      function done(ok) {
        b.textContent = ok ? "Copied" : "Select and copy";
        if (status) status.textContent = ok ? "Commands copied to the clipboard." : "Copy failed. The commands are selected; press Ctrl+C or Command+C.";
        if (!ok) { var r = document.createRange(); r.selectNodeContents(code); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        setTimeout(function () { b.textContent = idle; if (status) status.textContent = ""; }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  });

  var items = document.querySelectorAll(".reveal");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!items.length || still || !("IntersectionObserver" in window)) return;
  root.classList.add("motion");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--d", Math.min(i, 5) * 70 + "ms");
    io.observe(el);
  });
})();
