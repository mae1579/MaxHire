import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

function applyComputedColors(root) {
  const doc = root.ownerDocument;
  const nodes = [root, ...root.querySelectorAll("*")];
  nodes.forEach((el) => {
    const cs = doc.defaultView.getComputedStyle(el);
    el.style.color = cs.color;
    el.style.backgroundColor = cs.backgroundColor;
    el.style.borderTopColor = cs.borderTopColor;
    el.style.borderRightColor = cs.borderRightColor;
    el.style.borderBottomColor = cs.borderBottomColor;
    el.style.borderLeftColor = cs.borderLeftColor;
    el.style.outlineColor = cs.outlineColor;
    el.style.textDecorationColor = cs.textDecorationColor;
    el.style.boxShadow = cs.boxShadow;
    el.style.fontFamily = "Arial, Helvetica, sans-serif";
  });
}

async function renderCanvas(element) {
  await Promise.all(
    [...element.querySelectorAll("img")].map((img) =>
      img.decode().catch(() => undefined),
    ),
  );

  return html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (_doc, cloned) => {
      applyComputedColors(cloned);
    },
  });
}

async function createPdf(element) {
  if (!element) {
    throw new Error("Brak podglądu CV");
  }

  let canvas;
  try {
    canvas = await renderCanvas(element);
  } catch (firstError) {
    [...element.querySelectorAll("img")].forEach((img) => img.remove());
    try {
      canvas = await renderCanvas(element);
    } catch {
      throw firstError;
    }
  }

  const img = canvas.toDataURL("image/jpeg", 0.75);
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  const addPageImage = (x, y, w, h) =>
    pdf.addImage(img, "JPEG", x, y, w, h, undefined, "MEDIUM");

  if (imgHeight <= pageHeight + 2) {
    addPageImage(0, 0, pageWidth, Math.min(imgHeight, pageHeight));
    return pdf;
  }

  let heightLeft = imgHeight;
  let position = 0;

  addPageImage(0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 2) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    addPageImage(0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf;
}

export async function buildCvPdfBlob(element) {
  const pdf = await createPdf(element);
  return pdf.output("blob");
}

export async function downloadCvPdf(element, filename) {
  const pdf = await createPdf(element);
  pdf.save(filename);
}
