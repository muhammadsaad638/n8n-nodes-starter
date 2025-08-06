import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GenericHttpAuthApi implements ICredentialType {
	name = 'genericHttpAuthApi';
	displayName = 'Generic HTTP Authentication API';
	documentationUrl = 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-base.httpRequest/';

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'Bearer Token',
					value: 'bearer',
					description: 'Bearer token authentication',
				},
				{
					name: 'API Key',
					value: 'apiKey',
					description: 'API key authentication',
				},
				{
					name: 'Basic Auth',
					value: 'basic',
					description: 'Basic username/password authentication',
				},
				{
					name: 'Custom Headers',
					value: 'custom',
					description: 'Custom authentication headers',
				},
			],
			default: 'bearer',
		},
		// Bearer Token fields
		{
			displayName: 'Bearer Token',
			name: 'bearerToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authType: ['bearer'],
				},
			},
			description: 'The bearer token for authentication',
		},
		// API Key fields
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'The API key for authentication',
		},
		{
			displayName: 'API Key Location',
			name: 'apiKeyLocation',
			type: 'options',
			options: [
				{
					name: 'Header',
					value: 'header',
					description: 'Send API key in request headers',
				},
				{
					name: 'Query Parameter',
					value: 'query',
					description: 'Send API key as query parameter',
				},
			],
			default: 'header',
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'Where to send the API key',
		},
		{
			displayName: 'API Key Name',
			name: 'apiKeyName',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: 'X-API-Key',
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'Name of the API key header or query parameter',
		},
		// Basic Auth fields
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					authType: ['basic'],
				},
			},
			description: 'Username for basic authentication',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authType: ['basic'],
				},
			},
			description: 'Password for basic authentication',
		},
		// Custom Headers fields
		{
			displayName: 'Custom Headers',
			name: 'customHeaders',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Custom Header',
			default: {},
			displayOptions: {
				show: {
					authType: ['custom'],
				},
			},
			description: 'Custom authentication headers',
			options: [
				{
					name: 'keyvalue',
					displayName: 'Header',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							placeholder: 'Authorization',
							description: 'Name of the header',
							required: true,
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
							placeholder: 'Bearer your-token-here',
							description: 'Value of the header',
							required: true,
						},
					],
				},
			],
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.authType === "bearer" ? "Bearer " + $credentials.bearerToken : undefined}}',
			},
			auth: {
				username: '={{$credentials.authType === "basic" ? $credentials.username : undefined}}',
				password: '={{$credentials.authType === "basic" ? $credentials.password : undefined}}',
			},
			qs: {
				'={{$credentials.authType === "apiKey" && $credentials.apiKeyLocation === "query" ? $credentials.apiKeyName : undefined}}': '={{$credentials.authType === "apiKey" && $credentials.apiKeyLocation === "query" ? $credentials.apiKey : undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: 'https://httpbin.org/bearer',
			method: 'GET',
		},
	};
}
