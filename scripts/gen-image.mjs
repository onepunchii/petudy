#!/usr/bin/env node
/**
 * OpenRouter 이미지 생성 스크립트 (포온 브랜드 이미지용)
 *
 * 사용법:
 *   node --env-file=.env.local scripts/gen-image.mjs --out public/brand/x.png --aspect 16:9 \
 *        --ref public/images/rocket-3d.png --prompt "..." [--model google/gemini-3-pro-image]
 *
 *   여러 장을 한 번에: node --env-file=.env.local scripts/gen-image.mjs --manifest scripts/brand-images.json [--only id1,id2] [--skip-existing]
 *
 * 키: .env.local 의 OPENROUTER_API_KEY (커밋 금지 — .gitignore 처리됨)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, extname } from "node:path";

const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) {
    console.error("OPENROUTER_API_KEY 가 없습니다 (.env.local 확인)");
    process.exit(1);
}

const args = process.argv.slice(2);
const opt = (name, def) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : def;
};
const multi = (name) => args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []));

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const toDataUrl = (p) => `data:${MIME[extname(p).toLowerCase()] ?? "image/png"};base64,${readFileSync(p).toString("base64")}`;

async function generate({ prompt, out, aspect = "1:1", refs = [], model = "google/gemini-3-pro-image" }) {
    const content = [{ type: "text", text: prompt }, ...refs.map((r) => ({ type: "image_url", image_url: { url: toDataUrl(r) } }))];
    for (let attempt = 1; attempt <= 3; attempt++) {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${KEY}`,
                "Content-Type": "application/json",
                "X-Title": "po-on brand images",
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content }],
                modalities: ["image", "text"],
                image_config: { aspect_ratio: aspect },
            }),
        });
        const json = await res.json().catch(() => ({}));
        const url = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (res.ok && url?.startsWith("data:")) {
            mkdirSync(dirname(out), { recursive: true });
            writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
            const cost = json?.usage?.cost;
            console.log(`✓ ${out}${cost ? `  ($${Number(cost).toFixed(4)})` : ""}`);
            return true;
        }
        console.error(`✗ ${out} (시도 ${attempt}) ${res.status} ${JSON.stringify(json?.error ?? json?.choices?.[0]?.message?.content ?? "").slice(0, 300)}`);
    }
    return false;
}

const manifest = opt("manifest");
if (manifest) {
    const m = JSON.parse(readFileSync(manifest, "utf8"));
    const only = opt("only")?.split(",");
    const skip = args.includes("--skip-existing");
    const items = m.items.filter((it) => (!only || only.includes(it.id)) && !(skip && existsSync(it.out)));
    const concurrency = Number(opt("concurrency", "3"));
    let ok = 0;
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const results = await Promise.all(
            batch.map((it) =>
                generate({
                    prompt: [m.style?.[it.style] ?? "", it.prompt].filter(Boolean).join("\n\n"),
                    out: it.out,
                    aspect: it.aspect,
                    refs: it.refs ?? m.refs?.[it.style] ?? [],
                    model: it.model ?? m.model,
                }),
            ),
        );
        ok += results.filter(Boolean).length;
    }
    console.log(`완료 ${ok}/${items.length}`);
} else {
    const ok = await generate({ prompt: opt("prompt"), out: opt("out"), aspect: opt("aspect", "1:1"), refs: multi("ref"), model: opt("model") });
    process.exit(ok ? 0 : 1);
}
