import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

const A4_LANDSCAPE = { width: 297, height: 210 };

const SECTIONS = [
  { id: "hero", title: "Po-On" },
  { id: "brand", title: "브랜드" },
  { id: "problem", title: "Problem & Solution" },
  { id: "market", title: "시장" },
  { id: "competition", title: "경쟁" },
  { id: "model", title: "비즈니스 모델" },
  { id: "financial", title: "재무" },
  { id: "roadmap", title: "로드맵" },
  { id: "team", title: "팀" },
  { id: "invest", title: "사업계획" },
  { id: "contact", title: "연락처" },
];

export async function generateIRPdf(): Promise<void> {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    const element = document.getElementById(section.id);
    if (!element) continue;

    try {
      const dataUrl = await domtoimage.toPng(element, {
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: "none",
          transformOrigin: "top left",
          backgroundColor: "#0D0D14",
        },
        cacheBust: true,
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const imgAspectRatio = img.height / img.width;
      const pageWidth = A4_LANDSCAPE.width;
      const pageHeight = A4_LANDSCAPE.height;

      let imgWidth = pageWidth;
      let imgHeight = imgWidth * imgAspectRatio;

      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = imgHeight / imgAspectRatio;
      }

      if (i > 0) pdf.addPage();

      const xOffset = (pageWidth - imgWidth) / 2;
      const yOffset = (pageHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    } catch (e) {
      console.error(`Failed to capture section ${section.id}:`, e);
    }
  }

  pdf.save("poon-business-plan.pdf");
}
