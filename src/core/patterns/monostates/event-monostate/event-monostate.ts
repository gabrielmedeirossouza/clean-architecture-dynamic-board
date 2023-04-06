import { EventAdapter } from "@/core";

export class EventMonostate
{
	public static readonly event = new EventAdapter(document.body);
}
