import { squareOg } from "@/lib/site/og";
import { funeralRegionCard, funeralRegionParams } from "@/lib/site/og-cards-funeral";
import { getRegion } from "@/lib/site/regions";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = funeralRegionParams;

export async function GET(_req: Request, { params }: { params: Promise<{ sido: string; region: string }> }) {
    const { sido, region } = await params;
    const r = getRegion(sido, region);
    if (!r) return new Response("Not Found", { status: 404 });
    return squareOg(funeralRegionCard(r));
}
