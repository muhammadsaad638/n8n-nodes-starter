import { INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { httpVerbFields, httpVerbOperations } from './HttpVerbDescription';

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTTP Request',
		name: 'httpBin',
		icon: { light: 'file:httpbin.svg', dark: 'file:httpbin.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Make HTTP requests to any API with flexible authentication',
		defaults: {
			name: 'HTTP Request',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const authentication = this.getNodeParameter('authentication', i) as string;
				const url = this.getNodeParameter('url', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const headers = this.getNodeParameter('headers', i, {}) as any;

				// Try to get credentials with try/catch approach
				let credentials: any = {};
				if (authentication !== 'none') {
					try {
						credentials = this.getCredentials(authentication);
					} catch (error) {
						// If credentials are not available, continue without them
						credentials = {};
					}
				}

				// Prepare request options
				const requestOptions: any = {
					method: operation.toUpperCase(),
					url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						...headers,
					},
				};

				// Add authentication if credentials are available
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
						// Handle custom headers
						if (credentials.customHeaders.keyvalue) {
							credentials.customHeaders.keyvalue.forEach((header: any) => {
								requestOptions.headers[header.name] = header.value;
							});
						}
					}
				}

				// Make the HTTP request
				const response = await this.helpers.httpRequest(requestOptions);

				returnData.push({
					json: response,
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
