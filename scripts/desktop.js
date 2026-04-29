// Desktop interaction: open windows on icon double-click, drag windows, close, clock

(function () {
  let zCounter = 100;

  function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    win.style.zIndex = String(++zCounter);
  }

  // ============== ICON CLICKS ==============
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    let clickTimer = null;

    const open = () => {
      const id = icon.dataset.window;
      const win = document.querySelector(`.app-window[data-id="${id}"]`);
      if (!win) return;
      win.classList.remove('hidden');
      bringToFront(win);
      icon.classList.remove('selected');
    };

    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      // Single-click selects (Windows 3.1 behavior)
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');

      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
        open();
      } else {
        clickTimer = setTimeout(() => { clickTimer = null; }, 300);
      }
    });

    // Allow Enter to open when selected (keyboard nav)
    icon.tabIndex = 0;
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') open();
    });
  });

  // Click outside icons deselects
  document.addEventListener('click', () => {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
  });

  // ============== CLOSE BUTTONS ==============
  document.querySelectorAll('[data-action="close"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const win = btn.closest('.window');
      if (win) win.classList.add('hidden');
    });
  });

  // ============== DRAGGING ==============
  document.querySelectorAll('.window').forEach(win => {
    const titleBar = win.querySelector('.title-bar');
    if (!titleBar) return;

    let dragging = false;
    let startX, startY, startLeft, startTop;

    titleBar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ctrl-btn')) return;
      dragging = true;
      bringToFront(win);

      // Convert centered windows (with transform: translateX) to absolute coords
      const rect = win.getBoundingClientRect();
      win.style.transform = 'none';
      win.style.left = rect.left + 'px';
      win.style.top = rect.top + 'px';

      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = (startLeft + dx) + 'px';
      win.style.top = Math.max(0, startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => { dragging = false; });

    win.addEventListener('mousedown', () => bringToFront(win));
  });

  // ============== CLOCK ==============
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    el.textContent = `${hh}:${mm}`;
  }

  document.addEventListener('desktop:ready', () => {
    bringToFront(document.getElementById('program-manager'));
    updateClock();
    setInterval(updateClock, 30000);
  });
})();
