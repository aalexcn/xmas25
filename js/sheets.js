function sendReflectionToSheets(name, reflection) {
    fetch("https://script.google.com/macros/s/AKfycbxhoJt6DdeT0AnPJbzgWJ4uR4ff9p08IXpsr3jMNFFq1YSr-L7jxtqFFtUkt08q4tscuw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, reflection })
    });
  }
  