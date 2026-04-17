const { chromium } = require('playwright');
const fs = require('fs');

if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

(async () => {
    const urls = [
        { url: 'https://natthanon41.github.io/RX.INVs/dashboard', name: 'screenshots/dashboard.png' },
        { url: 'https://natthanon41.github.io/RX.INVs/dashboard/inventory', name: 'screenshots/inventory.png' },
        { url: 'https://natthanon41.github.io/RX.INVs/dashboard/purchase', name: 'screenshots/purchase.png' },
        { url: 'https://natthanon41.github.io/RX.INVs/dashboard/dispense', name: 'screenshots/dispense.png' },
        { url: 'https://natthanon41.github.io/RX.INVs/dashboard/requisition', name: 'screenshots/requisition.png' }
    ];

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 740 } });
    
    for (const item of urls) {
        console.log(`Navigating to ${item.url}...`);
        await page.goto(item.url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500); // Wait for animations
        console.log(`Taking screenshot: ${item.name}`);
        await page.screenshot({ path: item.name });
    }

    await browser.close();
    console.log('Done!');
})();
