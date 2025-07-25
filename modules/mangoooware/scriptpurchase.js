const infoBox = document.getElementById("info");

const infoLines = [
  `User Agent: ${navigator.userAgent}`,
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

// Plugins
if (navigator.plugins.length > 0) {
  const pluginNames = Array.from(navigator.plugins).map(p => p.name).join(", ");
  infoLines.push(`Plugins: ${pluginNames}`);
} else {
  infoLines.push(`Plugins: None`);
}

// Geolocation placeholder
infoLines.push("Geolocation: (waiting for permission...)");

function revealLines(lines, callback) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < lines.length) {
      const div = document.createElement("div");
      div.textContent = lines[index++];
      infoBox.appendChild(div);
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 200);
}

function addGeolocationViaAPI() {
  fetch('https://ip-api.com/json/')
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const geoText = `Geolocation (IP-based): ${data.lat.toFixed(5)}, ${data.lon.toFixed(5)} | ${data.city}, ${data.regionName}, ${data.country}`;
        infoBox.lastChild.textContent = geoText;
      } else {
        infoBox.lastChild.textContent = "Geolocation API error: " + data.message;
      }
    })
    .catch(err => {
      infoBox.lastChild.textContent = "Geolocation API request failed.";
      console.error(err);
    });
}

// Start immediately
revealLines(infoLines, () => {
  addGeolocationViaAPI();
});
