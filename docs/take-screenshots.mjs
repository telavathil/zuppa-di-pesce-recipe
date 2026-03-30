import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const SCREENSHOTS_DIR = '/Users/tobinelavathil/dev/zuppa-di-pesce-recipe/docs/screenshots';
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const VIEWPORT = { width: 390, height: 844 };
const BASE_URL = 'http://localhost:5173';

async function shot(page, name) {
  await page.screenshot({
    path: `${SCREENSHOTS_DIR}/${name}`,
    fullPage: false,
  });
  console.log(`Saved: ${name}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  // ── 1. Initial load — Recipe tab, Ingredients (default) ──────────────────
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot(page, '01-recipe-ingredients.png');

  // ── 2. Click "Steps" segmented toggle ────────────────────────────────────
  // Look for a button/tab labelled "Steps"
  const stepsBtn = page.getByRole('button', { name: /^steps$/i }).first();
  if (await stepsBtn.count() === 0) {
    // Fallback: any element containing text "Steps"
    await page.locator('text=Steps').first().click();
  } else {
    await stepsBtn.click();
  }
  await page.waitForTimeout(500);
  await shot(page, '02-recipe-steps.png');

  // ── 3. Click first step card ("Purge the clams") ─────────────────────────
  const firstStep = page.locator('text=Purge the clams').first();
  await firstStep.click();
  await page.waitForTimeout(500);
  await shot(page, '03-step-expanded.png');

  // ── 4. Equipment tab ──────────────────────────────────────────────────────
  const equipmentTab = page.getByRole('button', { name: /equipment/i }).first();
  if (await equipmentTab.count() > 0) {
    await equipmentTab.click();
  } else {
    await page.locator('text=Equipment').first().click();
  }
  await page.waitForTimeout(500);
  await shot(page, '04-equipment-tab.png');

  // ── 5. Shopping tab ───────────────────────────────────────────────────────
  const shoppingTab = page.getByRole('button', { name: /shopping/i }).first();
  if (await shoppingTab.count() > 0) {
    await shoppingTab.click();
  } else {
    await page.locator('text=Shopping').first().click();
  }
  await page.waitForTimeout(500);
  await shot(page, '05-shopping-tab.png');

  // ── 6. Settings tab — Traditional mode selected ───────────────────────────
  const settingsTab = page.getByRole('button', { name: /settings/i }).first();
  if (await settingsTab.count() > 0) {
    await settingsTab.click();
  } else {
    await page.locator('text=Settings').first().click();
  }
  await page.waitForTimeout(500);
  await shot(page, '06-settings-tab.png');

  // ── 7. Click "Sous Vide" option ───────────────────────────────────────────
  const sousVide = page.locator('text=Sous Vide').first();
  await sousVide.click();
  await page.waitForTimeout(500);
  await shot(page, '07-settings-sous-vide.png');

  // ── 8. Back to Recipe tab — sous vide banner visible ─────────────────────
  const recipeTab = page.getByRole('button', { name: /recipe/i }).first();
  if (await recipeTab.count() > 0) {
    await recipeTab.click();
  } else {
    await page.locator('text=Recipe').first().click();
  }
  await page.waitForTimeout(500);
  await shot(page, '08-recipe-sous-vide.png');

  await browser.close();
  console.log('All screenshots saved.');
})();
