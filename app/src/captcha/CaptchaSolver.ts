import * as Captcha from '2captcha';
import { TWO_CAPTCHA_KEY } from '../config';


export class CaptchaSolver {
	static readonly SECURE_KEY: string;
	static readonly REGISTER_URL: string;

	protected solver = new Captcha.Solver(TWO_CAPTCHA_KEY);
	protected secureKey: string;
	protected url: string;
	protected captchaToken: string | undefined;

	constructor(secureKey: string, url: string) {
		this.secureKey = secureKey;
		this.url = url;
	}

	async solveHCaptcha() {
		const { data, id } = await this.solver.hcaptcha(this.secureKey, this.url);
		this.captchaToken = data;
		return this.captchaToken;
	}

	async solveRecaptcha() {
		const { data, id } = await this.solver.recaptcha(this.secureKey, this.url);
		this.captchaToken = data;
		return this.captchaToken;
	}
}