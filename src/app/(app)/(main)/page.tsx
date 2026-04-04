import HomePageClient from "@/components/home/HomePageClient";
import { getLatestPoll } from "@/actions/poll";

export default async function HomePage() {
    const poll = await getLatestPoll();
    return <HomePageClient initialPoll={poll} />;
}
