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
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (_doc, cloned) => {
      applyComputedColors(cloned);
    },
  });
}

export async function downloadCvPdf(element, filename) {
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

  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(img, "PNG", 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(img, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
