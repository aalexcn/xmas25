for (let i = 0; i < 35; i++) {
    const s = document.createElement("div");
    s.className = "snow";
    s.textContent = "❄";
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = (10 + Math.random() * 18) + "px";
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    document.body.appendChild(s);
  }
  