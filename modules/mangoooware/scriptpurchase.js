const infoBox = document.getElementById("info");

const infoLines = [
  `User Agent: ${navigator.userAgent}`,
  "Geolocation: (fetching location info...)",  // Moved here right after User Agent
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

let geoDivIndex = 1; // since we placed geolocation at index 1

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

async function addGeolocationViaAPI() {
  try {
    const res = await fetch('https://ipwhois.app/json/');
    const data = await res.json();

    if (data.success === false) {
      infoBox.children[geoDivIndex].textContent = "Geolocation API error: " + data.message;
      return;
    }

    infoBox.children[geoDivIndex].textContent =
      `Geolocation (ipwhois.app):\n` +
      `IP: ${data.ip}\n` +
      `Location: ${data.city}, ${data.region}, ${data.country}\n` +
      `Coordinates: ${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}\n` +
      `Timezone: ${data.timezone}\n` +
      `ISP: ${data.isp}\n` +
      `Organization: ${data.org}`;
  } catch (err) {
    infoBox.children[geoDivIndex].textContent = "Geolocation API request failed.";
    console.error(err);
  }
}

revealLines(infoLines, () => {
  addGeolocationViaAPI();
});
