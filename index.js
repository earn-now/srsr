const url = require('url');
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const pw = url.parse(req.url, true).query.pw || '';
  if (pw) {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    // login
    await page.goto('https://xz.srsr.ml/auth/login');
    await page.type('#email', 'icsbun@163.com');
    await page.type('#passwd', pw);
    await page.click('#login');
    await page.waitForNavigation();
    // click get more data
    await page.click('.card-action .pull-left');
    const btnText = await page.evaluate(() => {
      return document.querySelector('.card-action .pull-left .btn').innerText;
    });
    // response
    res.end(JSON.stringify({
      success: true,
      text: btnText,
    }));
    await page.close();
    await browser.close();
  } else {
    res.end(JSON.stringify({
      success: false,
      text: req.url,
    }));
  }
}
