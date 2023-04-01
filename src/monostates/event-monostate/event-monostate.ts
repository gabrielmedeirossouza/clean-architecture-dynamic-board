import { EventAdapter } from "@/adapters";

export class EventMonostate
{
	public static readonly event = new EventAdapter(document.body);
}
