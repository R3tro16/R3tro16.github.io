(function () {
  const bootScreen = document.getElementById('boot-screen');
  const bootText = document.getElementById('boot-text');
  const bootCursor = document.getElementById('boot-cursor');
  const splashScreen = document.getElementById('splash-screen');
  const desktop = document.getElementById('desktop');

  bootScreen.classList.add('powering-on');
  document.body.classList.add('cursor-busy');

  let skipped = false;
  const skip = () => { skipped = true; };
  document.addEventListener('keydown', skip, { once: true });
  document.addEventListener('click', skip, { once: true });

  const lines = [
    { text: 'Award Modular BIOS v4.51PG, An Energy Star Ally', delay: 30 },
    { text: 'Copyright (C) 1984-95, Award Software, Inc.', delay: 30 },
    { text: '', delay: 200 },
    { text: 'Pentium-S CPU at 100MHz', delay: 80 },
    { text: 'Memory Test : 65536K OK', delay: 250 },
    { text: '', delay: 100 },
    { text: 'Detecting IDE drives ...', delay: 150 },
    { text: '  Primary Master   : RETRO16-HDD', delay: 200 },
    { text: '  Primary Slave    : None', delay: 60 },
    { text: '  Secondary Master : CD-ROM', delay: 60 },
    { text: '  Secondary Slave  : None', delay: 60 },
    { text: '', delay: 200 },
    { text: 'Press DEL to enter SETUP, ESC to skip memory test', delay: 60 },
    { text: '04/29/2026-i430VX-2A59GR2GC-00', delay: 400 },
    { text: '', delay: 200 },
    { text: 'Starting MS-DOS...', delay: 300 },
    { text: 'HIMEM is testing extended memory...done.', delay: 400 },
    { text: '', delay: 200 },
    { text: 'C:\\> WIN', delay: 600, typewriter: true },
  ];

  let buffer = '';

  function typeText(str, callback) {
    if (skipped) {
      buffer += str;
      bootText.textContent = buffer;
      callback();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (skipped) {
        clearInterval(interval);
        buffer += str.slice(i);
        bootText.textContent = buffer;
        callback();
        return;
      }
      buffer += str[i];
      bootText.textContent = buffer;
      i++;
      if (i >= str.length) {
        clearInterval(interval);
        callback();
      }
    }, 60);
  }

  function runLine(index) {
    if (index >= lines.length) {
      setTimeout(showSplash, 400);
      return;
    }
    const { text, delay, typewriter } = lines[index];
    const wait = skipped ? 0 : delay;

    setTimeout(() => {
      if (typewriter && !skipped) {
        typeText(text + '\n', () => runLine(index + 1));
      } else {
        buffer += text + '\n';
        bootText.textContent = buffer;
        runLine(index + 1);
      }
    }, wait);
  }

  function showSplash() {
    bootCursor.style.display = 'none';
    bootScreen.classList.add('hidden');
    splashScreen.classList.remove('hidden');
    setTimeout(showDesktop, skipped ? 400 : 1800);
  }

  function showDesktop() {
    splashScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
    document.body.classList.remove('cursor-busy');
    document.dispatchEvent(new CustomEvent('desktop:ready'));
  }

  runLine(0);
})();
