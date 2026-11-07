import { FUNERAL_HOMES, getFuneralHome } from "@/lib/site/funeral-homes";
import { wideOg } from "@/lib/site/og";
import { funeralHomeCard } from "@/lib/site/og-cards";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => FUNERAL_HOMES.map((h) => ({ sido: h.sido, slug: h.slug }));

export async function GET(_req: Request, { params }: { params: Promise<{ sido: string; slug: string }> }) {
    const { sido, slug } = await params;
    const h = getFuneralHome(sido, slug);
    if (!h) return new Response("Not Found", { status: 404 });
    return wideOg(funeralHomeCard(h));
}
