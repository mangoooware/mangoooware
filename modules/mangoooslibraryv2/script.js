const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

let openPath = localStorage.getItem('openPath');
let activePath = localStorage.getItem('activePath');

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    sidebar.appendChild(buildTree(data));
    if (activePath) loadContent(activePath);
  });

function buildTree(items) {
  const ul = document.createElement('ul');

  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = item.title;
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

    // 🛠 Fix: Handle children recursively regardless of depth
    if (item.children && item.children.length > 0) {
      const childUl = buildTree(item.children);
      childUl.classList.add('sidebar-children');

      // Auto-open logic
      if (item.path === openPath || isParent(item.path, activePath)) {
        childUl.classList.add('open');
      }

      li.appendChild(childUl);
    }

    ul.appendChild(li);
  });

  return ul;
}


function loadContent(path) {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
    })
    .catch(err => {
      content.innerHTML = `<p>Failed to load: ${path}</p>`;
    });
}

function isParent(parent, child) {
  return child && child.startsWith(parent);
}