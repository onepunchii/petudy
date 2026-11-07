import { squareOg } from "@/lib/site/og";
import { funeralSidoParams, funeralSidoServiceCard } from "@/lib/site/og-cards-funeral";
import { SIDO, type SidoSlug } from "@/lib/site/regions";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = funeralSidoParams;

export async function GET(_req: Request, { params }: { params: Promise<{ sido: string }> }) {
    const { sido } = await params;
    if (!(sido in SIDO)) return new Response("Not Found", { status: 404 });
    return squareOg(funeralSidoServiceCard(sido as SidoSlug));
}
