const { test } = require('@playwright/test');

test('capture runtime errors', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const resp = await page.goto('https://nageco.com', { waitUntil: 'networkidle', timeout: 90000 });
  console.log('NAV_STATUS', resp && resp.status());
  await page.waitForTimeout(3000);

  const links = await page.$$eval('link[rel="stylesheet"]', (els) => els.map((el) => el.getAttribute('href')));
  console.log('CSS_LINKS', JSON.stringify(links));

  const perf = await page.evaluate(async () => {
    const out = [];
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((el) => el.getAttribute('href')).filter(Boolean);
    for (const href of links) {
      try {
        const r = await fetch(href, { method: 'GET' });
        out.push({ href, status: r.status, type: r.headers.get('content-type') });
      } catch (e) {
        out.push({ href, error: String(e) });
      }
    }
    return out;
  });
  console.log('CSS_FETCH', JSON.stringify(perf));

  console.log('PAGE_ERRORS', JSON.stringify(pageErrors));
  console.log('CONSOLE_ERRORS', JSON.stringify(consoleErrors));
});
