import { funeralSidoList, isFuneralSido } from "@/lib/site/funeral-homes";
import { squareOg } from "@/lib/site/og";
import { funeralSidoCard } from "@/lib/site/og-cards";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => funeralSidoList().map((s) => ({ sido: s.slug }));

export async function GET(_req: Request, { params }: { params: Promise<{ sido: string }> }) {
    const { sido } = await params;
    if (!isFuneralSido(sido)) return new Response("Not Found", { status: 404 });
    return squareOg(funeralSidoCard(sido));
}
