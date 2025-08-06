import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const httpVerbOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
		options: [
			{
				name: 'DELETE',
				value: 'delete',
				description: 'Perform a DELETE request',
				action: 'Perform a DELETE request',
				routing: {
					request: {
						method: 'DELETE',
					},
				},
			},
			{
				name: 'GET',
				value: 'get',
				description: 'Perform a GET request',
				action: 'Perform a GET request',
				routing: {
					request: {
						method: 'GET',
					},
				},
			},
			{
				name: 'HEAD',
				value: 'head',
				description: 'Perform a HEAD request',
				action: 'Perform a HEAD request',
				routing: {
					request: {
						method: 'HEAD',
					},
				},
			},
			{
				name: 'PATCH',
				value: 'patch',
				description: 'Perform a PATCH request',
				action: 'Perform a PATCH request',
				routing: {
					request: {
						method: 'PATCH',
					},
				},
			},
			{
				name: 'POST',
				value: 'post',
				description: 'Perform a POST request',
				action: 'Perform a POST request',
				routing: {
					request: {
						method: 'POST',
					},
				},
			},
			{
				name: 'PUT',
				value: 'put',
				description: 'Perform a PUT request',
				action: 'Perform a PUT request',
				routing: {
					request: {
						method: 'PUT',
					},
				},
			},
		],
		default: 'get',
	},
];

export const httpVerbFields: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{ name: 'None', value: 'none' },
			{ name: 'Generic HTTP Auth', value: 'genericHttpAuthApi' },
			{ name: 'HttpBin API', value: 'httpbinApi' },
		],
		default: 'none',
		description: 'Select the authentication method to use',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		placeholder: 'https://api.example.com/endpoint',
		description: 'The HTTPS URL to make the request to (HTTP is not allowed for HIPAA compliance)',
		required: true,
		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
		routing: {
			request: {
				url: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Send Query Parameters',
		name: 'sendQuery',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		description: 'Whether the request has query params or not',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
	},
	{
		displayName: 'Specify Query Parameters',
		name: 'specifyQuery',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendQuery: [true],
			},
		},
		options: [
			{
				name: 'Using Fields Below',
				value: 'keypair',
			},
			{
				name: 'Using JSON',
				value: 'json',
			},
		],
		default: 'keypair',
	},
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendQuery: [true],
				specifyQuery: ['keypair'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Parameter',
		default: {
			parameters: [
				{
					name: '',
					value: '',
				},
			],
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'JSON',
		name: 'jsonQuery',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendQuery: [true],
				specifyQuery: ['json'],
			},
		},
		default: '',
	},
	{
		displayName: 'Send Headers',
		name: 'sendHeaders',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		description: 'Whether the request has headers or not',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
	},
	{
		displayName: 'Specify Headers',
		name: 'specifyHeaders',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendHeaders: [true],
			},
		},
		options: [
			{
				name: 'Using Fields Below',
				value: 'keypair',
			},
			{
				name: 'Using JSON',
				value: 'json',
			},
		],
		default: 'keypair',
	},
	{
		displayName: 'Header Parameters',
		name: 'headerParameters',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendHeaders: [true],
				specifyHeaders: ['keypair'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Parameter',
		default: {
			parameters: [
				{
					name: '',
					value: '',
				},
			],
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'JSON',
		name: 'jsonHeaders',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendHeaders: [true],
				specifyHeaders: ['json'],
			},
		},
		default: '',
	},
	{
		displayName: 'Send Body',
		name: 'sendBody',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		description: 'Whether the request has a body or not',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
	},
	{
		displayName: 'Body Content Type',
		name: 'contentType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
			},
		},
		options: [
			{
				name: 'JSON',
				value: 'json',
			},
			{
				name: 'Form Urlencoded',
				value: 'form-urlencoded',
			},
			{
				name: 'Raw',
				value: 'raw',
			},
		],
		default: 'json',
		description: 'Content-Type to use to send body parameters',
	},
	{
		displayName: 'Specify Body',
		name: 'specifyBody',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['json'],
			},
		},
		options: [
			{
				name: 'Using Fields Below',
				value: 'keypair',
			},
			{
				name: 'Using JSON',
				value: 'json',
			},
		],
		default: 'keypair',
		description: 'The body can be specified using explicit fields (keypair) or using a JavaScript object (JSON)',
	},
	{
		displayName: 'Body Parameters',
		name: 'bodyParameters',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['json'],
				specifyBody: ['keypair'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Parameter',
		default: {
			parameters: [
				{
					name: '',
					value: '',
				},
			],
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'ID of the field to set. Choose from the list, or specify an ID using an expression.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the field to set',
					},
				],
			},
		],
	},
	{
		displayName: 'JSON',
		name: 'jsonBody',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['json'],
				specifyBody: ['json'],
			},
		},
		default: '',
	},
	{
		displayName: 'Body Parameters',
		name: 'bodyParameters',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['form-urlencoded'],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Parameter',
		default: {
			parameters: [
				{
					name: '',
					value: '',
				},
			],
		},
		options: [
			{
				name: 'parameters',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'ID of the field to set. Choose from the list, or specify an ID using an expression.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the field to set',
					},
				],
			},
		],
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['raw'],
			},
		},
		default: '',
		placeholder: 'Enter raw body content',
	},
	{
		displayName: 'Content Type',
		name: 'rawContentType',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				sendBody: [true],
				contentType: ['raw'],
			},
		},
		default: '',
		placeholder: 'text/html',
	},
	{
		displayName: 'Output Response',
		name: 'outputResponse',
		type: 'boolean',
		default: false,
		description: 'Whether the HTTP response will be output. Disable in production for HIPAA compliance.',
	},
];

