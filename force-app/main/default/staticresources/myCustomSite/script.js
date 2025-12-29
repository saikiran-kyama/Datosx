/* Simple client-side navigation for the static site
   - toggles active nav item
   - replaces content in #dx-content
   - exposes myCustomSiteInit(container) for optional LWC-driven initialization
*/
(function () {
  // Role nav definitions
  var NAVS = {
    healthsystem: [
      { id: 'overview', label: 'Overview' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'matches', label: 'Matches' },
      { id: 'projects', label: 'Projects' },
      { id: 'messaging', label: 'Messaging' },
      { id: 'documents', label: 'Documents' },
      { id: 'legal', label: 'Legal' }
    ],
    sponsor: [
      { id: 'overview', label: 'Overview' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'enquires', label: 'Enquires' },
      { id: 'projects', label: 'Projects' },
      { id: 'messaging', label: 'Messaging' },
      { id: 'documents', label: 'Documents' },
      { id: 'legal', label: 'Legal' }
    ]
  };

  // Hardcoded credentials
  var CREDENTIALS = {
    healthsystem: 'datosx@2025',
    sponsor: 'datosx@2025'
  };

  // Helpers to scope DOM queries to a container (for LWC-injected usage)
  function $(selector, container) {
    container = container || document;
    return container.querySelector(selector);
  }

  function $all(selector, container) {
    container = container || document;
    return Array.prototype.slice.call(container.querySelectorAll(selector));
  }

  function setContent(pageId, container) {
    container = container || document;
    var content = $('#dx-content', container);
    if (!content) return;
    var html = '';
    switch (pageId) {
      case 'overview':
        html = '<h2>Overview</h2><p>Overview content for the selected role.</p>';
        break;
      case 'capabilities':
        html = '<h2>Capabilities</h2><p>Capabilities details.</p>';
        break;
      case 'matches':
        html = '<h2>Matches</h2><p>Matches and recommendations.</p>';
        break;
      case 'enquires':
        html = '<h2>Enquires</h2><p>Enquires from sponsors.</p>';
        break;
      case 'projects':
        html = '<h2>Projects</h2><p>Projects list and details.</p>';
        break;
      case 'messaging':
        html = '<h2>Messaging</h2><p>Messages and notifications.</p>';
        break;
      case 'documents':
        html = '<h2>Documents</h2><p>Shared documents and uploads.</p>';
        break;
      case 'legal':
        html = '<h2>Legal</h2><p>Legal and compliance information.</p>';
        break;
      default:
        html = '<h2>Overview</h2><p>Welcome.</p>';
    }
    content.innerHTML = html;
  }

  function renderNavForRole(role, container) {
    container = container || document;
    var nav = $('#dx-nav', container);
    if (!nav) return;
    nav.innerHTML = '';
    var items = NAVS[role] || [];
    items.forEach(function (it, idx) {
      var li = document.createElement('li');
      li.setAttribute('role', 'menuitem');
      li.setAttribute('data-page', it.id);
      li.textContent = it.label;
      if (idx === 0) li.classList.add('active');
      nav.appendChild(li);
    });
  }

  function onNavClick(e, container) {
    container = container || document;
    var li = e.target.closest('li[data-page]');
    if (!li) return;
    var page = li.getAttribute('data-page');
    var navs = $all('.dx-nav li', container);
    navs.forEach(function (n) {
      n.classList.remove('active');
    });
    li.classList.add('active');
    setContent(page, container);
  }

  function showSiteFor(role, container) {
    container = container || document;
    // hide login, show site
    var loginView = $('.login-view', container);
    var siteView = $('.site-view', container);
    if (loginView) loginView.setAttribute('aria-hidden', 'true');
    if (siteView) siteView.setAttribute('aria-hidden', 'false');

    renderNavForRole(role, container);

    // wire nav clicks (scope to container)
    var nav = $('#dx-nav', container);
    if (nav) {
      nav.removeEventListener('click', onNavClick);
      nav.addEventListener('click', function (e) { onNavClick(e, container); });
    }

    // set initial content
    var first = $('#dx-nav li', container);
    if (first) {
      var page = first.getAttribute('data-page');
      setContent(page, container);
    }

    // wire logout
    var logout = $('#dx-logout', container);
    if (logout) {
      logout.addEventListener('click', function () {
        sessionStorage.removeItem('dx_user');
        // show login again
        if (loginView) loginView.setAttribute('aria-hidden', 'false');
        if (siteView) siteView.setAttribute('aria-hidden', 'true');
      });
    }
  }

  function handleLoginForm(container) {
    container = container || document;
    var form = $('#dx-login-form', container);
    if (!form) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var uElem = $('#dx-username', container);
      var pElem = $('#dx-password', container);
      var btn = form.querySelector('button[type="submit"]');
      var u = uElem.value.trim();
      var p = pElem.value;
      if (!u || !p) return;

      // clear previous error
      showLoginError('', container);

      // set loading state
      if (btn) {
        btn.disabled = true;
        var prevText = btn.textContent;
        btn.textContent = 'Signing in...';
      }

      // simulate small delay so UX feels responsive
      setTimeout(function () {
        // validate
        if (CREDENTIALS[u] && CREDENTIALS[u] === p) {
          // success
          sessionStorage.setItem('dx_user', JSON.stringify({ username: u, role: u }));
          showSiteFor(u, container);
        } else {
          // show inline error instead of alert
          showLoginError('Invalid username or password', container);
          // small visual shake on card
          var card = container.querySelector('.login-card');
          if (card) {
            card.classList.remove('shake');
            // trigger reflow to restart animation
            void card.offsetWidth;
            card.classList.add('shake');
          }
        }

        // restore button
        if (btn) {
          btn.disabled = false;
          btn.textContent = prevText || 'Sign in';
        }
      }, 300);
    });
  }

  function showLoginError(message, container) {
    container = container || document;
    var el = $('#dx-login-error', container);
    if (!el) return;
    if (!message) {
      el.textContent = '';
      el.setAttribute('hidden', '');
      return;
    }
    el.removeAttribute('hidden');
    el.textContent = message;
    // move focus to error for accessibility
    el.focus && el.focus();
  }

  function tryRestoreSession(container) {
    container = container || document;
    var raw = sessionStorage.getItem('dx_user');
    if (!raw) return false;
    try {
      var obj = JSON.parse(raw);
      if (obj && obj.role) {
        showSiteFor(obj.role, container);
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  }

  function init(container) {
    container = container || document;
    // Wire login form submit
    handleLoginForm(container);

    // restore session if present
    if (!tryRestoreSession(container)) {
      // show login
      var loginView = $('.login-view', container);
      var siteView = $('.site-view', container);
      if (loginView) loginView.setAttribute('aria-hidden', 'false');
      if (siteView) siteView.setAttribute('aria-hidden', 'true');
    }
  }

  // Expose init to be called by the LWC wrapper with the injected container
  window.myCustomSiteInit = function (container) {
    init(container);
  };

  // Auto-init when loaded directly
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  }

})();
