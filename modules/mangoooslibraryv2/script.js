const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
let openPath = localStorage.getItem('openPath');
let activePath = localStorage.getItem('activePath');

// Add this near the top, after your initial variable declarations
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-path]');
  if (link) {
    e.preventDefault(); // Stop full page navigation
    const path = link.dataset.path;
    loadContent(path);
    localStorage.setItem('activePath', path);
    // Optional: Update sidebar active item (you'd need to find and highlight it)
  }
});

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    sidebar.appendChild(buildTree(data));
    if (activePath) loadContent(activePath);
  })
  .catch(err => console.error('Failed to load menu.json', err));

function buildTree(items) {
  const ul = document.createElement('ul');
  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = formatTitle(item.title);
    a.href = "#";
    a.className = 'sidebar-item';
    a.dataset.path = item.path;

    if (item.path === activePath) {
      a.classList.add('active');
    }

    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
      a.classList.add('active');
      loadContent(item.path);
      localStorage.setItem('activePath', item.path);

      if (item.children) {
        const nextUl = a.nextElementSibling;
        if (nextUl && nextUl.classList.contains('sidebar-children')) {
          nextUl.classList.toggle('open');
          localStorage.setItem('openPath', item.path);
        }
      }
    });

    li.appendChild(a);

    if (item.children && item.children.length > 0) {
      const childUl = buildTree(item.children);
      childUl.classList.add('sidebar-children');
      if (item.path === openPath || isParent(item.path, activePath)) {
        childUl.classList.add('open');
      }
      li.appendChild(childUl);
    }

    ul.appendChild(li);
  });
  return ul;
}

const TITLE_MARKERS = [
  { marker: '[i]', className: 'info', display: 'i' },
  { marker: '[-]', className: 'warn', display: '-' },
  { marker: '[NEW]', className: 'new', display: 'NEW' }
];

function formatTitle(title) {
  let result = '';
  let remaining = title;

  while (remaining.length > 0) {
    let matched = false;

    for (const m of TITLE_MARKERS) {
      if (remaining.startsWith(m.marker)) {
        result += `<span class="${m.className}">${m.display}</span> `;
        remaining = remaining.slice(m.marker.length);
        matched = true;
        break; // restart checking markers at new position
      }
    }

    if (!matched) {
      // no more markers at start, append rest
      result += remaining.trimStart(); // remove extra leading spaces
      break;
    }
  }

  return result;
}




function isParent(parent, child) {
  return child && child.startsWith(parent + '/'); // Improved: avoids false matches
}

// Single, consolidated loadContent function
function loadContent(path) {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;

      // Render MathJax
      if (window.MathJax) {
        MathJax.typesetPromise([content]).catch(err => console.log('MathJax error:', err.message));
      }

      // Render chart if function is available
      if (typeof renderPriceTrendChart === 'function') {
      renderPriceTrendChart();
      } else {
        // Fallback: try again shortly in case chart.js is still loading
        setTimeout(() => {
          if (typeof renderPriceChart === 'function') {
            renderPriceChart();
          }
        }, 300);
      }
    })
    .catch(err => {
      content.innerHTML = `<p>Failed to load: ${path}</p>`;
      console.error('Load error:', err);
    });
}

// MathJax configuration and loading
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  }
};

const mathjaxScript = document.createElement('script');
mathjaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
mathjaxScript.async = true;
document.head.appendChild(mathjaxScript);

// Load Chart.js library (required for charts)
if (typeof Chart === 'undefined') {
  const chartLibScript = document.createElement('script');
  chartLibScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  chartLibScript.async = true;
  chartLibScript.onload = () => console.log('Chart.js library loaded');
  chartLibScript.onerror = () => console.error('Failed to load Chart.js library');
  document.head.appendChild(chartLibScript);
}

// Load your custom chart logic (now from Indicators folder)
const chartLogicScript = document.createElement('script');
chartLogicScript.src = '/modules/charts/chart_SMA.js';
chartLogicScript.async = true;
chartLogicScript.onload = () => {
  console.log('chart_SMA.js (custom logic) loaded successfully');
  if (typeof renderPriceChart === 'function' && document.getElementById('priceChart')) {
    renderPriceChart();
  }
};
chartLogicScript.onerror = () => {
  console.error('Failed to load chart_SMA.js — check the path in console Network tab!');
};
document.head.appendChild(chartLogicScript);

