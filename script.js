// ===== PAGE INITIALIZATION =====
    // Purpose: Progressively enhance the page without hiding essential content.
    (function initializeCampaignPage() {
      const menuToggle = document.getElementById('nav-menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      const calendarButton = document.getElementById('calendar-download');
      const calendarStatus = document.getElementById('calendar-status');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const desktopViewport = window.matchMedia('(min-width: 768px)');

      menuToggle.hidden = false;
      mobileMenu.hidden = true;
      calendarButton.hidden = false;

      // ===== MOBILE MENU STATE =====
      // Purpose: Keep menu visibility and its accessible expanded state in sync.
      function setMobileMenu(isOpen, returnFocus) {
        mobileMenu.hidden = !isOpen;
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        if (returnFocus) {
          menuToggle.focus();
        }
      }

      // ===== MOBILE MENU TOGGLE =====
      // Trigger: Clicking the visible Menu button on a small screen.
      menuToggle.addEventListener('click', function toggleMobileMenu() {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        setMobileMenu(!isOpen, false);
      });

      // ===== ESCAPE-KEY SUPPORT =====
      // Purpose: Close an expanded menu and return focus to its control.
      document.addEventListener('keydown', function handleEscape(event) {
        if (event.key === 'Escape' && !mobileMenu.hidden) {
          setMobileMenu(false, true);
        }
      });

      // ===== RESPONSIVE MENU RESET =====
      // Purpose: Avoid leaving an expanded mobile menu active on desktop.
      desktopViewport.addEventListener('change', function handleViewportChange(event) {
        if (event.matches) {
          setMobileMenu(false, false);
        }
      });

      // ===== SAME-PAGE SECTION LINKS =====
      // Purpose: Support sticky-header spacing, keyboard focus and reduced motion.
      document.addEventListener('click', function navigateToSection(event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) {
          return;
        }

        event.preventDefault();
        setMobileMenu(false, false);
        target.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });

      // ===== ELECTION-DAY CALENDAR DOWNLOAD =====
      // Purpose: Download a real all-day ICS event; no signup or tracking required.
      // Edit: DTSTART is election day; DTEND is the following day, exclusively.
      calendarButton.addEventListener('click', function downloadElectionCalendar() {
        const calendarLines = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Kate Nolan//Election Day//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          'UID:kate-nolan-district8-20261103',
          'DTSTAMP:20260101T000000Z',
          'DTSTART;VALUE=DATE:20261103',
          'DTEND;VALUE=DATE:20261104',
          'SUMMARY:Vote - Beaufort County School Board District 8',
          'DESCRIPTION:Election Day is November 3\\, 2026. Check your voter',
          '  information and polling place at https://scvotes.gov/.',
          'URL:https://scvotes.gov/',
          'STATUS:CONFIRMED',
          'TRANSP:TRANSPARENT',
          'END:VEVENT',
          'END:VCALENDAR'
        ];

        try {
          const calendarFile = new Blob(
            [calendarLines.join('\r\n') + '\r\n'],
            { type: 'text/calendar;charset=utf-8' }
          );
          const fileUrl = URL.createObjectURL(calendarFile);
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = 'vote-november-3-2026.ics';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          calendarStatus.textContent = 'Open the downloaded calendar file to add election day.';

          // Release the temporary file after the browser starts the download.
          window.setTimeout(function releaseCalendarFile() {
            URL.revokeObjectURL(fileUrl);
          }, 10000);
        } catch (error) {
          calendarStatus.textContent = 'Please add Tuesday, November 3, 2026 to your calendar.';
        }
      });

      // ===== SUBTLE SCROLL REVEALS =====
      // Purpose: Reveal content once; never animate the hero headline or form.
      // The CSS fallback keeps everything readable if the library is unavailable.
      if (window.AOS && !reducedMotion.matches) {
        document.documentElement.classList.add('aos-ready');
        AOS.init({ once: true, duration: 700, offset: 80 });
      }
    }());