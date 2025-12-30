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

  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
    content.classList.add('expanded');
  }

  fetch('menu.json')
    .then(res => res.json())
    .then(data => {
      // Create and add search container FIRST
      const searchContainer = document.createElement('div');
      searchContainer.id = 'search-container';
      searchContainer.innerHTML = `
        <button id="sidebar-toggle" title="Toggle Sidebar">☰</button>
        <input type="text" id="search-input" placeholder="Search..." autocomplete="off">
        <div id="search-results"></div>
      `;
      sidebar.appendChild(searchContainer);
      
      // Then append menu tree AFTER the search container
      const menuTree = buildTree(data);
      sidebar.appendChild(menuTree);
      
      // Build search index
      buildSearchIndex(data);
      
      // Load active path if exists
      if (activePath) loadContent(activePath);
      
      // NOW set up sidebar toggle button (after it exists in DOM)
      const sidebarToggle = document.getElementById('sidebar-toggle');
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
        
        // Save state
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
      });
      
      // Set up search event listeners (after elements are in DOM)
      const searchInput = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');
      
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          performSearch(e.target.value);
        }, 300);
      });
      
      // Close search results when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.classList.remove('visible');
        }
      });
    })
    .catch(err => console.error('Failed to load menu.json', err));

    

  // Color Inverter functionality
  // Color Inverter functionality
  // Color Inverter functionality
  const colorInverter = document.getElementById('color-inverter');
  const body = document.body;

  // Load saved preference
  if (localStorage.getItem('colorInverted') === 'true') {
    body.classList.add('inverted');
  }

  colorInverter.addEventListener('click', () => {
    body.classList.toggle('inverted');
    // Save preference
    localStorage.setItem('colorInverted', body.classList.contains('inverted'));
  });
  // Color Inverter functionality
  // Color Inverter functionality
  // Color Inverter functionality


  // Background Changer Button
  // Background Changer Button
  // Background Changer Button
  const bgButton = document.getElementById('bg-button');

  // === PUT YOUR IMAGE URLS HERE ===
  const backgrounds = [
      '/modules/mangoooslibraryv2/Images/anime girl.jpg',
      '/modules/mangoooslibraryv2/Images/anime girl2.jpg',
      '/modules/mangoooslibraryv2/Images/WhiteBG.jpg',
      '/modules/mangoooslibraryv2/Images/Winter.jpg',
      '' // empty string = no background (dark only)
  ];

  let currentBgIndex = 0;

  // Load saved background on start
  const savedBg = localStorage.getItem('backgroundImage');
  if (savedBg && backgrounds.includes(savedBg)) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
      currentBgIndex = backgrounds.indexOf(savedBg);
  } else {
      // Default: first image or none
      document.body.style.backgroundImage = backgrounds[0] ? `url('${backgrounds[0]}')` : 'none';
      currentBgIndex = 0;
  }

  // Common background styles
  function applyBackground(url) {
      document.body.style.backgroundImage = url ? `url('${url}')` : 'none';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundSize = 'cover';
  }

  applyBackground(backgrounds[currentBgIndex] || '');

  bgButton.addEventListener('click', () => {
      currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
      const nextBg = backgrounds[currentBgIndex];
      
      applyBackground(nextBg);
      
      // Save preference
      localStorage.setItem('backgroundImage', nextBg || '');
      
      // Optional: change button emoji to indicate "next"
      bgButton.textContent = '🖼️';
      setTimeout(() => { bgButton.textContent = '🖼️'; }, 200); // small feedback
  });

  // Update Logs button functionality
  const updatesButton = document.getElementById('updates-button');

  updatesButton.addEventListener('click', () => {
    const updatesPath = 'content/Updates/index.html';
    loadContent(updatesPath);
    localStorage.setItem('activePath', updatesPath);
    
    // Remove active class from sidebar items
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  });
  // Background Changer Button ^^^
  // Background Changer Button
  // Background Changer Button

  const TITLE_MARKERS = [
    { marker: '[i]', className: 'info', display: 'i' },
    { marker: '[-]', className: 'hastag', display: '‣' },
    { marker: '[-+]', className: 'dash2', display: '·' },
    { marker: '[NEW]', className: 'new', display: 'NEW' },
    { marker: '[UPDATE]', className: 'updatecat', display: '✉' },
    { marker: '[C]', className: 'custom', wholeRemaining: true },
    { marker: '[S]', className: 'space', display: ' |' }
  ];

  function formatTitle(title) {
    let result = '';
    let remaining = title;

    while (remaining.length > 0) {
      let matched = false;

      for (const m of TITLE_MARKERS) {
        if (remaining.startsWith(m.marker)) {
          if (m.wholeRemaining) {
            // Wrap everything remaining after the marker
            const text = remaining.slice(m.marker.length).trimStart();
            result += `<span class="${m.className}">${text}</span>`;
            return result; // done, no more markers applied
          } else {
            // Regular marker, just replace the marker itself
            result += `<span class="${m.className}">${m.display}</span> `;
            remaining = remaining.slice(m.marker.length);
          }
          matched = true;
          break; // restart markers at new position
        }
      }

      if (!matched) {
        // No marker found at start, append the rest
        result += remaining.trimStart();
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

  // Build tree function
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

  // Search functionality
  let searchIndex = [];

  function buildSearchIndex(items, parentPath = '') {
    items.forEach(item => {
      const cleanTitle = item.title.replace(/\[.*?\]/g, '').trim();
      searchIndex.push({
        title: cleanTitle,
        path: item.path,
        parentPath: parentPath
      });
      if (item.children && item.children.length > 0) {
        buildSearchIndex(item.children, cleanTitle);
      }
    });
  }

  async function fetchPageContent(path) {
    try {
      const response = await fetch(path);
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const scripts = tempDiv.querySelectorAll('script, style');
      scripts.forEach(script => script.remove());
      return tempDiv.textContent || tempDiv.innerText || '';
    } catch (err) {
      console.error('Error fetching content:', err);
      return '';
    }
  }

  async function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    if (!query || query.length < 2) {
      searchResults.classList.remove('visible');
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    for (const item of searchIndex) {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const content = await fetchPageContent(item.path);
      const contentMatch = content.toLowerCase().includes(lowerQuery);
      
      if (titleMatch || contentMatch) {
        let preview = '';
        if (contentMatch) {
          const index = content.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, index - 60);
          const end = Math.min(content.length, index + query.length + 60);
          preview = '...' + content.substring(start, end).trim() + '...';
        } else {
          preview = content.substring(0, 120).trim() + '...';
        }
        
        results.push({
          title: item.title,
          path: item.path,
          preview: preview,
          titleMatch: titleMatch
        });
      }
    }
    
    displaySearchResults(results, query);
  }

  function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      searchResults.classList.add('visible');
      return;
    }
    
    results.sort((a, b) => b.titleMatch - a.titleMatch);
    
    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      
      const highlightedTitle = highlightText(result.title, query);
      const highlightedPreview = highlightText(result.preview, query);
      
      item.innerHTML = `
        <div class="search-result-title">${highlightedTitle}</div>
        <div class="search-result-preview">${highlightedPreview}</div>
      `;
      
      item.addEventListener('click', () => {
        loadContent(result.path);
        localStorage.setItem('activePath', result.path);
        document.getElementById('search-input').value = '';
        searchResults.classList.remove('visible');
        
        document.querySelectorAll('.sidebar-item').forEach(el => {
          el.classList.remove('active');
          if (el.dataset.path === result.path) {
            el.classList.add('active');
          }
        });
      });
      
      searchResults.appendChild(item);
    });
    
    searchResults.classList.add('visible');
  }

  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }