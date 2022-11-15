import { Protocol } from 'puppeteer';

export const timer = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

export const mapToCookie = (cookieToMap?: any): Protocol.Network.CookieParam[] => {
	throw new Error('This method has not yet beenimplemented');

	let cookieArray: Protocol.Network.CookieParam[] = [];

	for (const cookie of cookieToMap) {
		cookieArray.push({
			name: cookie.name,
			value: cookie.value,
			url: cookie.url,
			domain: cookie.domain,
			path: cookie.path,
			secure: cookie.secure,
			httpOnly: cookie.httpOnly,
			// sameSite: 'Lax' | 'Strict' | 'None',
			expires: cookie.expirationDate,
		});
	}

	return cookieArray;
};

export enum ProxyType {
	residential = 'residential',
	datacenter = 'datacenter',
}
