(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const resp = await page.goto('https://nageco.com', { waitUntil: 'networkidle', timeout: 120000 });
  console.log('NAV_STATUS', resp ? resp.status() : 'NO_RESPONSE');

  const cssLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((el) => el.getAttribute('href'))
      .filter(Boolean);
  });

  console.log('CSS_LINKS', JSON.stringify(cssLinks));

  const cssStatuses = [];
  for (const href of cssLinks) {
    const absolute = new URL(href, 'https://nageco.com').toString();
    const r = await page.request.get(absolute);
    const headers = await r.allHeaders();
    cssStatuses.push({ href, status: r.status(), contentType: headers['content-type'] || '' });
  }

  console.log('CSS_STATUSES', JSON.stringify(cssStatuses));
  await page.waitForTimeout(3000);
  console.log('PAGE_ERRORS', JSON.stringify(pageErrors));
  console.log('CONSOLE_ERRORS', JSON.stringify(consoleErrors));

  await browser.close();
})().catch((error) => {
  console.error('SCRIPT_ERROR', error && error.stack ? error.stack : error);
  process.exit(1);
});
