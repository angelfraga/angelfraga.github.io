
      var PALETTES = ['dotnet', 'angular', 'ai', 'electron', 'architecture', 'testing'];
      var NAMES = {
        dotnet: '.NET',
        angular: 'Angular',
        ai: 'AI',
        electron: 'Electron',
        architecture: 'Architecture',
        testing: 'Testing'
      };

      function applyPalette(name) {
        if (PALETTES.indexOf(name) === -1) name = PALETTES[0];

        var body = document.body;
        PALETTES.forEach(function (p) {
          body.classList.remove('palette-' + p);
        });
        body.classList.add('palette-' + name);

        var label = document.getElementById('palette-label');
        if (label) label.textContent = NAMES[name];

        var options = document.querySelectorAll('.pal-option');
        for (var i = 0; i < options.length; i++) {
          options[i].classList.toggle(
            'active',
            options[i].getAttribute('data-palette') === name
          );
        }

        try {
          localStorage.setItem('palette', name);
        } catch (err) {}

        var flyout = document.getElementById('flyout');
        flyout.classList.remove('open');
        document.getElementById('palette-btn').setAttribute('aria-expanded', 'false');
      }

      function togglePaletteFlyout(event) {
        if (event) event.stopPropagation();
        var flyout = document.getElementById('flyout');
        var btn = document.getElementById('palette-btn');
        var open = flyout.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      }

      function toggleTheme() {
        var root = document.documentElement;
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try {
          localStorage.setItem('theme', next);
        } catch (err) {}
      }

      document.addEventListener('click', function (e) {
        var btn = document.getElementById('palette-btn');
        var flyout = document.getElementById('flyout');
        if (!btn.contains(e.target) && !flyout.contains(e.target)) {
          flyout.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      window.applyPalette = applyPalette;
      window.togglePaletteFlyout = togglePaletteFlyout;
      window.toggleTheme = toggleTheme;

      (function init() {
        var palette = null;
        try {
          palette = localStorage.getItem('palette');
        } catch (err) {}
        if (PALETTES.indexOf(palette) === -1) palette = PALETTES[0];
        applyPalette(palette);

        var theme = null;
        try {
          theme = localStorage.getItem('theme');
        } catch (err) {}
        document.documentElement.setAttribute(
          'data-theme',
          theme ||
            (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );

        var page = location.pathname.split('/').pop() || 'index.html';
        var links = document.querySelectorAll('nav a[href]');
        for (var i = 0; i < links.length; i++) {
          var href = links[i].getAttribute('href');
          if (href && href.split('/').pop() === page) {
            links[i].classList.add('active');
          }
        }
      })();
    