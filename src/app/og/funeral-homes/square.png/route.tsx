import { squareOg } from "@/lib/site/og";
import { funeralHubCard } from "@/lib/site/og-cards";

export const dynamic = "force-static";

export async function GET() {
    return squareOg(funeralHubCard());
}
