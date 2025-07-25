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
infoLines.push("Geolocation: (fetching location info...)");

// Helper to print lines with delay
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

// Async function to get IP and then geolocation info
async function addGeolocationViaAPI() {
  try {
    // 1. Get public IP
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    const ip = ipData.ip;

    // 2. Query ip-api.com with that IP
    let geo = {};
    if (ip && ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,timezone,isp,org,query`);
      geo = await geoRes.json();
      if (geo.status !== "success") geo = {};
    }

    // 3. Display results
    if (Object.keys(geo).length) {
      infoBox.lastChild.textContent =
        `Geolocation (IP-based):\n` +
        `IP: ${geo.query}\n` +
        `Location: ${geo.city}, ${geo.regionName}, ${geo.country} ${geo.zip}\n` +
        `Coordinates: ${geo.lat.toFixed(5)}, ${geo.lon.toFixed(5)}\n` +
        `Timezone: ${geo.timezone}\n` +
        `ISP: ${geo.isp}\n` +
        `Organization: ${geo.org}`;
    } else {
      infoBox.lastChild.textContent = "Geolocation API returned no data.";
    }
  } catch (err) {
    infoBox.lastChild.textContent = "Geolocation API request failed.";
    console.error(err);
  }
}

// Start revealing info and then get geo
revealLines(infoLines, () => {
  addGeolocationViaAPI();
});
