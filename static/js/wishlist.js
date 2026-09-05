(() => {
  const getCookie = (name) => {
    const value = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return value ? decodeURIComponent(value.split('=').slice(1).join('=')) : '';
  };

  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const productIndex = parts.indexOf('product');
    const slug = productIndex >= 0 ? parts[productIndex + 1] : '';
    if (!slug) return;
    const endpoint = `/account/favorites/toggle/${encodeURIComponent(slug)}/`;

    const applyState = (favorite) => {
      button.classList.toggle('is-favorite', !!favorite);
      button.setAttribute('aria-pressed', favorite ? 'true' : 'false');
      button.innerHTML = favorite
        ? '♥ <span>حذف از علاقه‌مندی</span>'
        : '♡ <span>افزودن به علاقه‌مندی</span>';
    };

    fetch(endpoint, { credentials: 'same-origin' })
      .then(response => response.status === 401 ? null : response.json())
      .then(data => { if (data && data.ok) applyState(data.favorite); })
      .catch(() => {});

    button.addEventListener('click', async () => {
      if (button.dataset.busy === '1') return;
      button.dataset.busy = '1';
      button.disabled = true;
      const original = button.innerHTML;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'same-origin',
        });
        if (response.status === 401) {
          window.location.href = '/account/';
          return;
        }
        if (!response.ok) throw new Error('request');
        const data = await response.json();
        applyState(data.favorite);
      } catch (error) {
        button.innerHTML = original;
      } finally {
        button.disabled = false;
        button.dataset.busy = '0';
      }
    });
  });
})();
