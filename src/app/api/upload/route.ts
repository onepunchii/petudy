import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return Response.json({ error: "Supabase not configured" }, { status: 503 });
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const arrayBuffer = new Uint8Array(bytes);

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

        const { data, error } = await supabase.storage
            .from("memories")
            .upload(fileName, arrayBuffer, {
                contentType: "image/webp",
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return Response.json({ error: error.message }, { status: 500 });
        }

        const { data: urlData } = supabase.storage.from("memories").getPublicUrl(fileName);

        return Response.json({ url: urlData.publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json({ error: "Upload failed" }, { status: 500 });
    }
}
