(() => {
  const getCookie = (name) => {
    const value = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return value ? decodeURIComponent(value.split('=').slice(1).join('=')) : '';
  };

  document.querySelectorAll('.wishlist-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      if (button.dataset.busy === '1') return;
      button.dataset.busy = '1';
      const original = button.innerHTML;
      button.disabled = true;

      try {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const productIndex = parts.indexOf('product');
        const slug = productIndex >= 0 ? parts[productIndex + 1] : '';
        if (!slug) throw new Error('product');

        const response = await fetch(`/account/favorites/toggle/${encodeURIComponent(slug)}/`, {
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
        button.classList.toggle('is-favorite', !!data.favorite);
        button.setAttribute('aria-pressed', data.favorite ? 'true' : 'false');
        button.innerHTML = data.favorite
          ? '♥ <span>حذف از علاقه‌مندی</span>'
          : '♡ <span>افزودن به علاقه‌مندی</span>';
      } catch (error) {
        button.innerHTML = original;
      } finally {
        button.disabled = false;
        button.dataset.busy = '0';
      }
    });
  });
})();
