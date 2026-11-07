import { squareOg } from "@/lib/site/og";
import { funeralServiceCard } from "@/lib/site/og-cards-funeral";

export const dynamic = "force-static";

export async function GET() {
    return squareOg(funeralServiceCard());
}
