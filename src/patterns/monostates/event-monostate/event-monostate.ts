import { EventAdapter } from "@/patterns";

export class EventMonostate
{
	public static readonly event = new EventAdapter(document.body);
}
