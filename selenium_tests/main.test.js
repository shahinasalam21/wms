const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// ✅ Helper for safe clicking
async function safeClick(driver, element) {
  await driver.executeScript("arguments[0].scrollIntoView({behavior:'smooth', block:'center'});", element);
  await driver.wait(until.elementIsVisible(element), 5000);
  await driver.wait(until.elementIsEnabled(element), 5000);
  try {
    await element.click();
  } catch (err) {
    console.warn("⚠ Regular click failed, trying JavaScript click.");
    await driver.executeScript("arguments[0].click();", element);
  }
}

async function mainTestFlow() {
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
  let generatedEmail = 'testuser' + Date.now() + '@example.com';
  let password = 'password123';

  try {
    // Step 1: Go to homepage and click "Create Account"
    await driver.get('http://localhost:3000');
    const createAccountBtn = await driver.wait(until.elementLocated(By.linkText("Create Account")), 10000);
    await safeClick(driver, createAccountBtn);
    await driver.wait(until.urlContains("/signup"), 10000);
    console.log("✅ Navigated to signup page.");

    // Step 2: Fill and submit signup form
    await driver.wait(until.elementLocated(By.name('name')), 5000);
    await driver.findElement(By.name('name')).sendKeys('Test User');
    await driver.findElement(By.name('email')).sendKeys(generatedEmail);
    await driver.findElement(By.name('password')).sendKeys(password);
    await driver.findElement(By.name('confirmPassword')).sendKeys(password);
    await driver.findElement(By.name('role')).sendKeys('Manager');

    console.log("✅ Signup form filled. Please solve reCAPTCHA manually...");
    await driver.sleep(8000); // Allow manual reCAPTCHA solving

    try {
      await driver.wait(async () => {
        const iframes = await driver.findElements(By.css('iframe[title*="recaptcha challenge"]'));
        return iframes.length === 0;
      }, 10000);
    } catch {
      console.warn("⚠ reCAPTCHA still visible, trying to submit anyway...");
    }

    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await safeClick(driver, submitBtn);

    await driver.wait(until.alertIsPresent(), 10000);
    const alert = await driver.switchTo().alert();
    console.log('📢 Signup Alert:', await alert.getText());
    await alert.accept();

    // Step 3: Redirected to login
    await driver.sleep(3000);
    const loginUrl = await driver.getCurrentUrl();
    if (!loginUrl.includes("login")) {
      throw new Error("Did not redirect to login page after signup.");
    }
    console.log("✅ Signup complete. On login page.");

    // Step 4: Login with the same credentials
    await driver.wait(until.elementLocated(By.name('email')), 5000);
    await driver.findElement(By.name('email')).sendKeys(generatedEmail);
    await driver.findElement(By.name('password')).sendKeys(password);

    console.log("✅ Login form filled. Please solve reCAPTCHA manually...");
    await driver.sleep(10000); // Manual solve again

    const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
    await safeClick(driver, loginBtn);

    try {
      await driver.wait(until.alertIsPresent(), 10000);
      const loginAlert = await driver.switchTo().alert();
      await loginAlert.accept();
      console.log("✅ Login alert dismissed.");
    } catch {
      console.warn("ℹ No alert after login.");
    }

    await driver.wait(until.urlMatches(/\/dashboard|\/manager-dashboard/), 10000);
    const dashboardUrl = await driver.getCurrentUrl();
    console.log("✅ Logged in and redirected to:", dashboardUrl);

    // Step 5: Create a new workflow
    await driver.wait(until.elementLocated(By.css('.create-button')), 10000);
    const createWorkflowBtn = await driver.findElement(By.css('.create-button'));
    await safeClick(driver, createWorkflowBtn);
    console.log("✅ Clicked 'Create Workflow' button.");
    await driver.sleep(2000);

    await driver.wait(until.elementLocated(By.css('input[name="name"]')), 5000);
    await driver.findElement(By.css('input[name="name"]')).sendKeys('Test Workflow');
    await driver.sleep(1000);

    await driver.findElement(By.css('textarea[name="description"]')).sendKeys('This is a test workflow.');
    await driver.sleep(1000);

    await driver.findElement(By.css('input[name="taskName"]')).sendKeys('Sample Task');
    await driver.sleep(1000);

    const assignedTo = await driver.wait(until.elementLocated(By.name('assignedTo')), 5000);
    await assignedTo.sendKeys('john@example.com');
    await driver.sleep(1000);

    await driver.findElement(By.css('select[name="priority"]')).sendKeys('High');
    await driver.sleep(1000);

    await driver.findElement(By.css('input[name="description"][placeholder="Task Description"]')).sendKeys('This is a test task.');
    await driver.sleep(1000);

    await driver.findElement(By.css('input[name="duedate"]')).sendKeys('2025-04-30');
    await driver.sleep(1000);

    const addTaskBtn = await driver.findElement(By.css('button.btn-add'));
    await safeClick(driver, addTaskBtn);
    console.log("✅ Task added to the workflow.");
    await driver.sleep(1500);

    const finalCreateBtn = await driver.findElement(By.css('button.btn-create'));
    await safeClick(driver, finalCreateBtn);
    console.log("✅ Workflow creation submitted.");
    await driver.sleep(2000);

    try {
      await driver.wait(until.alertIsPresent(), 10000);
      const workflowAlert = await driver.switchTo().alert();
      console.log("📢 Workflow Alert:", await workflowAlert.getText());
      await workflowAlert.accept();
      console.log("✅ Workflow alert dismissed.");
    } catch {
      console.warn("⚠ No alert appeared after workflow creation.");
    }

    await driver.sleep(1000);

    const workflowsLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(., 'Workflows')]")), 10000);
    await safeClick(driver, workflowsLink);
    console.log("✅ Navigated to 'Workflows' page.");

    await driver.sleep(4000); // Optional pause to observe the workflows

  } catch (err) {
    console.error("❌ Test Flow Failed:", err);
  } finally {
    await driver.quit();
  }
}

mainTestFlow();
