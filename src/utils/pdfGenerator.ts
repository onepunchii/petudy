import domtoimage from "dom-to-image-more";
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

  const imgData = await domtoimage.toPng(element, {
    width: element.offsetWidth * 2,
    height: element.offsetHeight * 2,
    style: {
      transform: "none",
      transformOrigin: "top left",
      backgroundColor: "#0D0D14",
    },
    cacheBust: true,
  });

  element.style.width = originalWidth;
  element.style.height = originalHeight;
  element.style.transform = originalTransform;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imgData;
  });

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.fillStyle = "#0D0D14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const finalImgData = canvas.toDataURL("image/png");
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

      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, yOffset, canvas.width, captureHeight, 0, 0, canvas.width, captureHeight);
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
    pdf.addImage(finalImgData, "PNG", PAGE.margin, yOffset, imgWidth, imgHeight);
  }

  pdf.save("poon-business-plan.pdf");
}
