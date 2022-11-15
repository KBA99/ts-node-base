import puppeteer, { HTTPRequest, HTTPResponse } from 'puppeteer';
import PuppeteerExtra from 'puppeteer-extra';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { mapToCookie, timer } from '../utils/helper';

// PuppeteerExtra.use(RecaptchaPlugin())
// PuppeteerExtra.use(StealthPlugin())

export class Browser {
	static browser: puppeteer.Browser;
	interceptRequest: boolean = true;
	tokenToSet: any;

	constructor() {}

	static instantiateBrowser = async (headless = false) => {
		const browserFetcher = puppeteer.createBrowserFetcher({
			path: './',
		});
		const revisionInfo = await browserFetcher.canDownload('1022525');

		if (revisionInfo) {
			const downloadedBrowser = await browserFetcher.download('1022525');

			Browser.browser = await puppeteer.launch({
				ignoreHTTPSErrors: true,
				executablePath: downloadedBrowser?.executablePath,
				headless: false,
				args: [
					// '--enable-features=NetworkService',
				],
			});
		} else {
			throw new Error('Unable to download current revision version');
		}
	};

	static closeBrowser = async () => {
		Browser.browser.close();
	};

	startTask = async () => {
		if (!Browser.browser) {
			await Browser.instantiateBrowser();
		}

		/** Page Setup */
		const context = await Browser.browser.createIncognitoBrowserContext();
		const page = await context.newPage();
		await page.setRequestInterception(this.interceptRequest);
		page.setDefaultNavigationTimeout(0);

		/** Request Interceptors */
		page.on('request', async (request: HTTPRequest) => {
			if (this.interceptRequest) {
				if (request.url() == 'URL' && !!request.headers()['header']) {
					const postData = JSON.stringify({});

					request.continueRequestOverrides().postData = postData;
					request.continue(request.continueRequestOverrides());
				}
			}

			if (!request.isInterceptResolutionHandled()) {
				request.continue();
			}
		});

		page.on('response', async (response: HTTPResponse) => {
			if (this.interceptRequest) {
				if (response.request().url() == 'URL') {
					console.log(response);
				}
			}
		});

		await page.goto('', { timeout: 0 });

		await this.screenshotStateAndClosePage(page);
	};

	private async setLocalStorageItem(page: puppeteer.Page, key: string, value: string) {
		await page.evaluate((value) => {
			localStorage.setItem(key, value);
		}, this.tokenToSet);
	}

	private async setCookiesOnPage(page: puppeteer.Page) {
		await page.setCookie(...mapToCookie());
	}

	private async screenshotStateAndClosePage(page: puppeteer.Page) {
		await page.screenshot({ path: 'screenshot.png', fullPage: true });
		console.log(`All done, check the screenshot. ✨`);
		await page.close();
	}

	throwErrorIfIncorrectlyConstructed() {
		throw new Error('This method has not yet been defined');
	}
}
