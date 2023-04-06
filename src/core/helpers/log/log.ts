const DEFAULT_HEADER_STYLE = `
font-family: 'Lato', sans-serif;
font-size: 20px;
padding-bottom: 4px;
`;

const DEFAULT_LOCATION_STYLE = `
padding: 2px 6px;
border: 1px solid #eb6262;
margin-bottom: 4px;
`;

const DEFAULT_CONTENT_HEADER_STYLE = `
font-weight: bold;
`;

const DEFAULT_CONTENT_STYLE = `
padding-bottom: 4px;
`;

export class Log
{
	public static Panic(location: string, message: string): void
	{
		const HEADER_STYLE = `
            ${DEFAULT_HEADER_STYLE}
            color: red;
        `;

		const messageHeader = "PANIC";
		const messageLocation = `Location: ${location}`;
		const messageContent = `%cMessage%c: ${message}`;
		const fullMessage = `%c ${messageHeader}%c\n%c${messageLocation}%c\n${messageContent}`;

		console.error(fullMessage, HEADER_STYLE, "", DEFAULT_LOCATION_STYLE, DEFAULT_CONTENT_STYLE, DEFAULT_CONTENT_HEADER_STYLE, "");
	}
}
