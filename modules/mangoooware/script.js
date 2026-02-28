const infoBox = document.getElementById("info");

const infoLines = [
  `User Agent: ${navigator.userAgent}`,
  "Geolocation: (fetching location info...)",  // geoDivIndex = 1
  `Platform: ${navigator.platform}`,
  `Language: ${navigator.language}`,
  `Online: ${navigator.onLine}`,
  `Cookies Enabled: ${navigator.cookieEnabled}`,
  `Hardware Threads: ${navigator.hardwareConcurrency}`,
  `Max Touch Points: ${navigator.maxTouchPoints}`,
  `Screen: ${screen.width}x${screen.height}`,
  `Color Depth: ${screen.colorDepth}`,
  `Pixel Ratio: ${window.devicePixelRatio}`,
  `Timezone Offset: ${new Date().getTimezoneOffset()} min`,
  `Referrer: ${document.referrer || 'None'}`,
  `Location: ${location.href}`,
  `Window Size: ${window.innerWidth}x${window.innerHeight}`,
];

if (navigator.plugins.length > 0) {
  const pluginNames = Array.from(navigator.plugins).map(p => p.name).join(", ");
  infoLines.push(`Plugins: ${pluginNames}`);
} else {
  infoLines.push(`Plugins: None`);
}

let geoDivIndex = 1;

function revealLines(lines, callback) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < lines.length) {
      const div = document.createElement("div");
      div.style.whiteSpace = "pre-line"; // keeps line breaks
      div.textContent = lines[index++];
      infoBox.appendChild(div);
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 200);
}

async function addGeolocationViaAPI() {
  try {
    // Fetch CORS-friendly geolocation info
    const res = await fetch("https://ipapi.co/json/");
    const geo = await res.json();

    infoBox.children[geoDivIndex].textContent =
      `Geolocation:\n` +
      `IP: ${geo.ip}\n` +
      `Location: ${geo.city}, ${geo.region}, ${geo.country_name}\n` +
      `Coordinates: ${geo.latitude?.toFixed(5)}, ${geo.longitude?.toFixed(5)}\n` +
      `Timezone: ${geo.timezone}\n` +
      `ISP/Org: ${geo.org}\n` +
      `Postal: ${geo.postal}`;

    // Log to MongoDB via serverless
    await fetch('/api/geo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        geo,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'None',
        acceptLanguage: navigator.language,
        cookies: document.cookie
      })
    });

  } catch (err) {
    infoBox.children[geoDivIndex].textContent = "Geolocation API request failed.";
    console.error(err);
  }
}

// Start revealing info
revealLines(infoLines, addGeolocationViaAPI);