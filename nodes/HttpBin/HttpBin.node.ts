import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { httpVerbFields, httpVerbOperations } from './HttpVerbDescription';

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTTP Request (HIPAA Compliant)',
		name: 'httpBin',
		icon: { light: 'file:httpbin.svg', dark: 'file:httpbin.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Make secure HTTPS requests to any API with flexible authentication. HIPAA compliant - enforces HTTPS only.',
		defaults: {
			name: 'HTTP Request (HIPAA)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'genericHttpAuthApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['genericHttpAuthApi'],
					},
				},
			},
			{
				name: 'httpbinApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['httpbinApi'],
					},
				},
			},
		],
		requestDefaults: {
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'HTTP Verb',
						value: 'httpVerb',
					},
				],
				default: 'httpVerb',
			},

			...httpVerbOperations,
			...httpVerbFields,
			{
				displayName: 'HIPAA Error Mode',
				name: 'hipaaErrorMode',
				type: 'boolean',
				default: true,
				description: 'Whether to hide error details and only output a generic message and status code for HIPAA compliance. Set to false for development.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const validateHttpsUrl = (url: string) => {
			try {
				const urlObj = new URL(url);
				if (urlObj.protocol !== 'https:') {
					throw new NodeOperationError(
						this.getNode(),
						`HIPAA Compliance Error: Only HTTPS URLs are allowed. Received: ${urlObj.protocol}//${urlObj.host}`,
						{
							description: 'For HIPAA compliance, all API requests must use HTTPS encryption. Please update your URL to use https://',
							level: 'error',
						}
					);
				}
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(
					this.getNode(),
					`Invalid URL format: ${url}`,
					{
						description: 'Please provide a valid HTTPS URL',
						level: 'error',
					}
				);
			}
		};

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const hipaaErrorMode = this.getNodeParameter('hipaaErrorMode', i, true) as boolean;
			try {
				const url = this.getNodeParameter('url', i) as string;
				validateHttpsUrl(url);
				const authentication = this.getNodeParameter('authentication', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const headers = this.getNodeParameter('headers', i, {}) as any;
				let credentials: any = {};
				if (authentication !== 'none') {
					try {
						credentials = this.getCredentials(authentication);
					} catch (error) {
						credentials = {};
					}
				}
				const requestOptions: any = {
					method: operation.toUpperCase(),
					url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						...headers,
					},
					resolveWithFullResponse: true,
				};
				if (credentials && Object.keys(credentials).length > 0) {
					if (credentials.authType === 'bearer' && credentials.bearerToken) {
						requestOptions.headers.Authorization = `Bearer ${credentials.bearerToken}`;
					} else if (credentials.authType === 'basic' && credentials.username && credentials.password) {
						requestOptions.auth = {
							username: credentials.username,
							password: credentials.password,
						};
					} else if (credentials.authType === 'apiKey' && credentials.apiKey) {
						if (credentials.apiKeyLocation === 'header') {
							requestOptions.headers[credentials.apiKeyName || 'X-API-Key'] = credentials.apiKey;
						} else if (credentials.apiKeyLocation === 'query') {
							requestOptions.qs = requestOptions.qs || {};
							requestOptions.qs[credentials.apiKeyName || 'api_key'] = credentials.apiKey;
						}
					} else if (credentials.authType === 'custom' && credentials.customHeaders) {
						if (credentials.customHeaders.keyvalue) {
							credentials.customHeaders.keyvalue.forEach((header: any) => {
								requestOptions.headers[header.name] = header.value;
							});
						}
					}
				}
				const response = await this.helpers.httpRequest(requestOptions);
				returnData.push({
					json: response,
				});
			} catch (error) {
				let statusCode: number | undefined = undefined;
				if (error?.response?.status) {
					statusCode = error.response.status;
				} else if (error?.httpCode) {
					statusCode = error.httpCode;
				}
				if (hipaaErrorMode) {
					const errorOutput = {
						error: 'Request failed. Details are hidden for HIPAA compliance.',
						statusCode,
						hipaaCompliant: true,
					};
					if (this.continueOnFail()) {
						returnData.push({ json: errorOutput });
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Request failed with status code: ${statusCode ?? 'unknown'}. (Details hidden for HIPAA compliance)`
						);
					}
				} else {
					const errorOutput = {
						error: error.message || 'Request failed',
						statusCode,
						stack: error.stack,
					};
					if (this.continueOnFail()) {
						returnData.push({ json: errorOutput });
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Request failed: ${error.message || 'Unknown error'}`
						);
					}
				}
			}
		}
		return [returnData];
	}
}
