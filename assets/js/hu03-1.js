document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('a[href$=".html"]');

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      navigateTo(link.getAttribute('href'));
    });
  });

  function navigateTo(href) {
    window.location.href = href;
  }
});
