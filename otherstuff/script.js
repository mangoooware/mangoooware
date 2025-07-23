let links = [];
let visited = new Set();

async function loadFile(file) {
  const res = await fetch(file);
  const text = await res.text();
  return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
}

async function saveVisited(link) {
  await fetch('save_visit.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'link=' + encodeURIComponent(link)
  });
}

function getNextLink() {
  const unvisited = links.filter(link => !visited.has(link));
  if (unvisited.length === 0) {
    alert("All links visited.");
    return null;
  }
  const next = unvisited[0]; // or random: Math.floor(Math.random() * unvisited.length)
  visited.add(next);
  return next;
}

document.addEventListener('DOMContentLoaded', async () => {
  links = await loadFile('links.txt');
  const visitedList = await loadFile('visited.txt');
  visitedList.forEach(link => visited.add(link));

  document.getElementById('next').addEventListener('click', async () => {
    const link = getNextLink();
    if (link) {
      document.getElementById('currentLink').innerText = link;
      window.open(link, '_blank');
      await saveVisited(link);
    }
  });
});