const express = require("express");
const { OfferRecord } = require("../records/OfferRecord");
const { UserRecord } = require("../records/UserRecord");
const tokenAuth = require("../guards/authGuard");
const { ValidationError } = require("../utils/handleErrors");
const offersRouter = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

offersRouter.get("/", tokenAuth, async (req, res) => {
  const search = req.query.search || "";
  const limit = 7;
  const page = parseInt(req.query.page) || 1;
  const offset = (parseInt(page) - 1) * limit;

  const data = await OfferRecord.findAllFiltr(limit, offset, search);

  res.status(200).json(data);
});

//Edytowanie zgłoszeń zalogowanego usera

offersRouter.patch("/editOffer/:id", tokenAuth, async (req, res) => {
  const findoffer = await OfferRecord.findOneByIdOffer(req.params.id);

  if (!findoffer) {
    throw new ValidationError("Oferta nie istnieje");
  }

  if (findoffer.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Brak uprawnień do edycji tego ogłoszenia" });
  }

  const newOffer = new OfferRecord({
    ...findoffer,
    ...req.body,
  });

  try {
    await newOffer.update();
    return res
      .status(200)
      .json({ message: "Dane ogłoszenia zostały zaaktualizowane" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Wystąpił błąd podczas aktualizacji" });
  }
});

//Usuwanie zgłoszeń zalogowanego usera

offersRouter.delete("/deleteOffer/:id", tokenAuth, async (req, res) => {
  const offer_id = req.params.id;
  const findOffer = await OfferRecord.findOneByIdOffer(offer_id);

  if (!findOffer) {
    throw new ValidationError("Ogloszenie nie istnieje w bazie");
  }
  const loginUser = req.user.id;

  if (findOffer.user_id !== loginUser) {
    throw new ValidationError(
      "Zgloszenie nie nalezy do ciebie, brak mozliwosci usuniecia tego zgloszenia !",
    );
  }

  await findOffer.delete();
  res
    .status(200)
    .json({ message: `Zgloszenie o id: ${offer_id} zostalo usuniete` });
});

// Wyświetlanie dopasowanych ofert do cv użytkownika
offersRouter.get("/matchedOffers", tokenAuth, async (req, res) => {
  try {
    const findUser = await UserRecord.findById(req.user.id);
    if (!findUser || !findUser.cv_url || !findUser.cv_url.trim()) {
      return res
        .status(400)
        .json({ message: "Użytkownik nie ma wgranego CV." });
    }

    console.log("1. Pobieranie pełnej bazy ofert i pliku CV...");
    const allOffers = await OfferRecord.findAllGeminiData();
    const response = await fetch(findUser.cv_url);
    if (!response.ok) throw new Error("Błąd pobierania CV z Cloudinary.");

    const base64Pdf = Buffer.from(await response.arrayBuffer()).toString(
      "base64",
    );

    // Zmieniamy na potężniejszy model, który rozumie logikę
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Przekazujemy absolutnie wszystkie oferty z bazy
    const offersContext = allOffers.map((o) => ({
      id: o.id,
      title: o.title,
      tech: o.tech,
      description: o.description,
    }));

    // PROMPT DLA WERSJI 2.5-FLASH: Inteligentny, rygorystyczny i krótki w odpowiedzi
    const prompt = `
Jesteś wybitnym i niezwykle rygorystycznym rekruterem IT. Przeanalizuj załączone CV (plik PDF) i absolutnie WSZYSTKIE poniższe oferty pracy:
${JSON.stringify(offersContext)}

ZASADY ŻELAZNE (ZŁAMANIE ICH TO BŁĄD SYSTEMOWY):
1. CZYTANIE ZE ZROZUMIENIEM: Zwróć szczególną uwagę na sekcje typu "Czego NIE używam" lub negacje w CV. Jeśli kandydat pisze, że nie używa/nie lubi JavaScript, React, PHP itp. - to ich NIE ZNA.

2. ZERO HALUCYNACJI: Jeśli główna technologia z oferty (np. Go, Java, Vue, React, PHP, Node.js) NIE JEST wpisana w CV kandydata jako umiejętność, dopasowanie wynosi równe 0%.
3. BRAK LITOŚCI: Nie przyznawaj punktów za sam HTML/CSS do ofert dla programistów backendu lub React/Vue.

ZADANIE:
1. Wewnętrznie przeanalizuj wszystkie oferty i odrzuć te, które mają 0%.

2. Zwróć MINIMUM 5 i Maksymalnie 5 najlepszych ofert, które FAKTYCZNIE pasują do CV kandydata (mają > 0%).
3. Ofert z 0% dopasowania CAŁKOWICIE POMIŃ w odpowiedzi.
4. Podaj "match_percentage" (od 1 do 100) i jedno sensowne, zgodne z prawdą zdanie w "match_reason" (np. "Posiadasz wymagane doświadczenie z Node.js i MongoDB.").

Zwróć wynik WYŁĄCZNIE jako poprawną tablicę JSON:
[
    {
        "id": "id-oferty",
        "match_percentage": 85,
        "match_reason": "Wspólne technologie: Node.js, MongoDB."
    }
]
`;

    console.log(
      `2. Wysyłanie zapytania do modelu gemini-2.5-flash (analiza ${allOffers.length} ofert)... To zajmie ok. 10-20 sekund.`,
    );
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Pdf, mimeType: "application/pdf" } },
    ]);

    const aiData = JSON.parse(result.response.text());
    const aiArray = Array.isArray(aiData) ? aiData : [];

    const finalTop5Offers = aiArray
      .filter((aiOffer) => aiOffer && aiOffer.match_percentage > 0)
      .map((aiOffer) => {
        const original = allOffers.find((o) => o.id === aiOffer.id) || {};
        return {
          ...original,
          match_percentage: aiOffer.match_percentage,
          match_reason: aiOffer.match_reason,
        };
      })
      .sort((a, b) => b.match_percentage - a.match_percentage) // <-- Poprawiona linijka!
      .slice(0, 5);

    if (finalTop5Offers.length === 0) {
      return res.status(200).json({
        message:
          "Nie znaleziono ofert dopasowanych do Twojego CV. Spróbuj zaktualizować swoje umiejętności.",
        matchedOffers: [],
      });
    }

    console.log("3. Zwracam najlepiej dopasowane oferty.");

    return res.status(200).json({
      message: "Znaleźliśmy oferty pasujące do Twojego CV!",
      matchedOffers: finalTop5Offers,
    });
  } catch (err) {
    console.error("Błąd główny:", err);
    return res
      .status(500)
      .json({ error: "Wystąpił błąd serwera podczas dopasowywania ofert." });
  }
});

module.exports = {
  offersRouter,
};
