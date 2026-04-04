import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PAGE = { width: 297, height: 210, margin: 10 };

export async function generateIRPdf(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const contentWidth = PAGE.width - PAGE.margin * 2;
  const contentHeight = PAGE.height - PAGE.margin * 2;

  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalTransform = element.style.transform;

  element.style.width = `${PAGE.width}mm`;
  element.style.transform = "none";

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#0D0D14",
      onclone: (clonedDoc) => {
        const allElements = clonedDoc.body.querySelectorAll("*");
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.backgroundColor.includes("oklab") || computedStyle.backgroundColor.includes("oklch")) {
            (el as HTMLElement).style.backgroundColor = "#0D0D14";
          }
        });
      },
    });
  } catch (e) {
    console.warn("html2canvas error, retrying with fallback:", e);
    canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: "#0D0D14",
    });
  }

  element.style.width = originalWidth;
  element.style.height = originalHeight;
  element.style.transform = originalTransform;

  const imgData = canvas.toDataURL("image/png");
  const imgAspectRatio = canvas.height / canvas.width;
  let imgWidth = contentWidth;
  let imgHeight = imgWidth * imgAspectRatio;

  if (imgHeight > contentHeight) {
    let remainingHeight = imgHeight;
    let yOffset = 0;

    while (remainingHeight > 0) {
      const availableHeight = contentHeight;
      const captureHeight = Math.min(
        (availableHeight / imgHeight) * canvas.height,
        canvas.height - yOffset
      );

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = captureHeight;

      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, yOffset, canvas.width, captureHeight, 0, 0, canvas.width, captureHeight);
        const pageImgData = tempCanvas.toDataURL("image/png");
        const pageImgHeight = (captureHeight / canvas.width) * contentWidth * (PAGE.height / PAGE.width);
        pdf.addImage(pageImgData, "PNG", PAGE.margin, PAGE.margin, contentWidth, pageImgHeight);
      }

      remainingHeight -= availableHeight;
      yOffset += captureHeight;

      if (remainingHeight > 0) pdf.addPage();
    }
  } else {
    const yOffset = PAGE.margin + (contentHeight - imgHeight) / 2;
    pdf.addImage(imgData, "PNG", PAGE.margin, yOffset, imgWidth, imgHeight);
  }

  pdf.save("poon-business-plan.pdf");
}
