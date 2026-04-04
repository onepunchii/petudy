import { NextRequest, NextResponse } from "next/server";

const SERVICE_KEY = decodeURIComponent("%2Ft32BvJaaHMbhGkj9ppq%2Fn6MAjjx%2F9P1A4CnqRp3VCKzP4XX6ZIvnjhRwj7M%2Be8dUWO%2By38yqxs0jjt%2FAA4mGA%3D%3D");
const API_BASE_URL = "http://apis.data.go.kr/1543061/animalInfoSrvc_v3";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const dogRegNo = searchParams.get("dog_reg_no");
    const ownerNm = searchParams.get("owner_nm");

    if (!dogRegNo || !ownerNm) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    try {
        // Construct the full URL with query parameters
        // Note: Service Key is often sensitive to encoding, so we append it manually if needed, 
        // but URLSearchParams usually handles standard encoding. 
        // For public data portal keys that are already encoded, passing them as is or decoding first depends on usage.
        // Here we use the standard URL parsing.

        const queryParams = new URLSearchParams({
            serviceKey: SERVICE_KEY,
            dog_reg_no: dogRegNo,
            owner_nm: ownerNm,
            _type: "json" // Request JSON response
        });

        const url = `${API_BASE_URL}/getDogInfoSearch?${queryParams.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching animal registration data:", error);
        return NextResponse.json(
            { error: "Failed to fetch data from external API" },
            { status: 500 }
        );
    }
}
