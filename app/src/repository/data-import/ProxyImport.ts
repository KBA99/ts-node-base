import fs from 'fs';
import Axios, { AxiosProxyConfig, AxiosResponse } from 'axios-https-proxy-fix';
import path from 'path';
import { performanceConfig } from '../../utils/request.performance-config';
import { PROXY_CONFIG } from '../../config';

export class ProxyImport {
	static readonly pathToProxy = path.join(
		__dirname,
		'..',
		'data',
		'proxies',
		`${PROXY_CONFIG.proxyType}.txt`
	);
	private static readonly immutableAxiosProxyConfigArray: AxiosProxyConfig[] = new Array<AxiosProxyConfig>();
	public static axiosProxyArray: AxiosProxyConfig[] = new Array<AxiosProxyConfig>();
	public static splitProxiesArray: string[] = new Array<string>();
	private static readonly REQUEST_TIMEOUT = 5000;
	private static readonly PROXY_RESPONSE_TIME = 3000;
	public static isProxyImported: boolean = false;
	private retryCounter = 0;

	static importProxies = async () => {
		const importedProxies = fs.readFileSync(ProxyImport.pathToProxy, 'utf8');
		ProxyImport.splitProxiesArray = importedProxies.split('\n');
		for (let i = 0; i < ProxyImport.splitProxiesArray.length; i++) {
			const [host, port, username, password] = ProxyImport.splitProxiesArray[i].split(':');

			ProxyImport.immutableAxiosProxyConfigArray.push({
				host,
				port: +port,
				auth: {
					username,
					password,
				},
			});
		}
		ProxyImport.isProxyImported = true;
	};

	getRandomAxiosProxy = () => {
		if (ProxyImport.axiosProxyArray.length == 0) {
			ProxyImport.axiosProxyArray = Array.from(ProxyImport.immutableAxiosProxyConfigArray); //creates a new array to recycle all proxies if proxyfile is dead
		}
		const proxyLength = ProxyImport.axiosProxyArray.length;
		const arrayIndex = Math.floor(Math.random() * proxyLength);
		const proxy = ProxyImport.axiosProxyArray[arrayIndex];
		ProxyImport.axiosProxyArray.splice(arrayIndex, 1);
		if (!proxy) {
			throw new Error('No proxy available.');
		}
		return proxy;
	};

	static getRandomProxyInStringFormat = () => {
		const proxyLength = ProxyImport.splitProxiesArray.length;
		const arrayIndex = Math.floor(Math.random() * proxyLength);
		const randomProxy = ProxyImport.splitProxiesArray[arrayIndex];
		if (!randomProxy) {
			throw new Error('No proxy available.');
		}
		return randomProxy;
	};

	getWorkingAxiosProxy = async () => {
		const SUCCESS_STATUS_CODES = [201, 200];
		const { response, requestDuration, proxy } = await this.testRequestPerformance();

		const successfulRequest =
			SUCCESS_STATUS_CODES.includes(response.status) &&
			requestDuration <= ProxyImport.PROXY_RESPONSE_TIME;

		if (successfulRequest) {
			return proxy;
		} else {
			throw 'Unable to get a working proxy.';
		}
	};

	private async testRequestPerformance(): Promise<{
		response: AxiosResponse;
		requestDuration: number;
		proxy: AxiosProxyConfig;
	}> {
		const requestStart = performance.now();
		performanceConfig.proxy = this.getRandomAxiosProxy();
		performanceConfig.timeout = ProxyImport.REQUEST_TIMEOUT;

		let response;
		try {
			response = await Axios(performanceConfig);
		} catch (error) {
			response = {
				statusText: 'ERROR',
			} as AxiosResponse;
		}

		if (response.statusText == 'OK') {
			const requestEnd = performance.now();
			const requestDuration = requestEnd - requestStart;
			return { response, requestDuration, proxy: performanceConfig.proxy };
		} else {
			if (this.retryCounter < 3) {
				console.log('==> Retrying New proxy');
				this.retryCounter++;
			} else {
				throw new Error('Failed to get working proxy');
			}
			return this.testRequestPerformance();
		}
	}
}
