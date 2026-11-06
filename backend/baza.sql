-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 06, 2026 at 07:00 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storemax`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `offers`
--

CREATE TABLE `offers` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(40) NOT NULL,
  `company` varchar(40) NOT NULL,
  `description` text NOT NULL,
  `tech` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tech`)),
  `links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`links`)),
  `updated` varchar(50) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `company`, `description`, `tech`, `links`, `updated`, `user_id`) VALUES
('0f9b2c3a-1d4e-4f6a-8b2c-9d1e3f5a7b9c', 'Sklep Internetowy Fashion', 'StyleCode', 'Poszukujemy **doświadczonego programisty** do stworzenia nowoczesnego sklepu internetowego dla marki *odzieżowej premium*. Projekt wymaga pełnej responsywności oraz integracji z systemem magazynowym ERP, co jest kluczowe dla naszej logistyki.\n\nWymagamy również:\n- Wdrożenia bezpiecznych płatności online (*Przelewy24/Stripe*)\n- Modułu do obsługi zwrotów i newslettera\n\nCzekamy na oferty zawierające portfolio podobnych realizacji e-commerce.', '[\"React\", \"Node.js\", \"MongoDB\", \"Stripe\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793812400', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', 'Aplikacja CRM dla Logistyki', 'TransSoft', 'Zlecę zaprojektowanie i wdrożenie dedykowanego **systemu CRM** dla firmy transportowej operującej na terenie *całej Europy*. System musi umożliwiać śledzenie przesyłek w czasie rzeczywistym oraz zarządzanie flotą pojazdów przez dyspozytorów.\n\nDodatkowo aplikacja powinna generować:\n- Automatyczne faktury\n- Raporty dla księgowości\n\nSzukamy zespołu, który ma doświadczenie w tworzeniu *skalowalnych aplikacji biznesowych*.', '[\"Angular\", \"TypeScript\", \"C#\", \".NET Core\", \"SQL Server\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1792945100', '1daeb50e-fcd9-40fb-8149-7813b1a5f18f'),
('23456789-0abc-4def-0123-45678901abcd', 'Monitoring Sieci WiFi', 'NetGuard', 'Hotel w górach poszukuje **specjalisty sieciowego** do wdrożenia systemu monitoringu sieci WiFi. Goście skarżą się na zasięg, więc potrzebujemy diagnozy i instalacji dodatkowych Access Pointów firmy *Ubiquiti*.\n\nSystem musi pozwalać na:\n- Zdalny podgląd statusu urządzeń\n- Powiadamianie obsługi o awariach\n\nWymagana wizja lokalna oraz konfiguracja kontrolera sieci.', '[\"Networking\", \"WiFi\", \"Ubiquiti\", \"SNMP\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793610200', 'b79fa00b-6652-4f77-90b2-8dd933f9ec80'),
('2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 'Projekt sieci LAN w biurze', 'NetConnect', 'Zlecę kompleksowe zaprojektowanie i wdrożenie **infrastruktury sieciowej** w nowym biurowcu naszej firmy. Oczekujemy konfiguracji bezpiecznej sieci LAN/WLAN dla około *50 stanowisk roboczych* z podziałem na VLAN-y dla różnych działów.\n\nW zakres zlecenia wchodzi także:\n- Dobór sprzętu sieciowego\n- Konfiguracja bezpiecznego tunelu VPN\n\nProszę o wycenę uwzględniającą testy obciążeniowe i dokumentację.', '[\"Cisco\", \"Networking\", \"VLAN\", \"VPN\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1791823900', '2638e05d-64e0-4040-88d2-2aa10cd67501'),
('34567890-abcd-4ef0-1234-56789012abcd', 'Aplikacja To-Do', 'TaskMaster', 'Szukamy freelancera do stworzenia rozbudowanej **aplikacji To-Do** z funkcją pracy zespołowej w *czasie rzeczywistym*. Użytkownicy powinni widzieć zmiany wprowadzane przez innych członków zespołu natychmiastowo.\n\nKluczowe wymagania:\n- Wykorzystanie WebSocketów (*Socket.io*)\n- Tryb ciemny (*Dark Mode*)\n- Możliwość tworzenia podzadań', '[\"React\", \"Socket.io\", \"Node.js\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1792451200', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'Strona wizytówka kawiarni', 'CoffeeWeb', 'Potrzebujemy nowej, **estetycznej strony internetowej** dla kawiarni otwierającej się w centrum *Warszawy*. Strona musi być lekka, szybko się ładować i posiadać czytelne menu oraz galerię zdjęć, którą łatwo zaktualizujemy.\n\nElementy obowiązkowe:\n- Sekcja kontaktowa z integracją *Google Maps*\n- Oparcie o CMS (*WordPress*) do dodawania promocji', '[\"HTML5\", \"CSS3\", \"JavaScript\", \"WordPress\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793108400', '483c5e36-d237-4b10-9ea5-8103b55d3e05'),
('45678901-bcde-4f01-2345-67890123abcd', 'Serwis ogłoszeniowy', 'LocalAds', 'Planujemy uruchomienie **lokalnego portalu ogłoszeniowego** i szukamy wykonawcy MVP. Serwis musi posiadać wyszukiwarkę z filtrowaniem, podział na kategorie oraz panel użytkownika do zarządzania ogłoszeniami.\n\nZależy nam na technologii *Python/Django* ze względu na szybkość tworzenia i bezpieczeństwo.', '[\"Django\", \"Python\", \"PostgreSQL\", \"Bootstrap\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1791942100', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('56789012-cdef-4012-3456-78901234abcd', 'Optymalizacja Wordpress', 'SpeedFix', 'Moja strona firmowa na WordPressie działa **bardzo wolno**, co negatywnie wpływa na pozycjonowanie. Zlecę audyt i optymalizację serwisu, aby uzyskać wynik w Google PageSpeed Insights *powyżej 90 punktów*.\n\nZakres prac:\n- Minifikacja kodu\n- Optymalizacja grafik\n- Konfiguracja cache', '[\"WordPress\", \"Lighthouse\", \"PHP\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793740000', 'e11ac16f-a76c-4cda-a3d2-8cebd0cbef83'),
('67890123-def0-4123-4567-89012345abcd', 'Chatbot na stronę', 'TalkAI', 'Chcemy wdrożyć na naszej stronie internetowej **inteligentnego chatbota**, który odciąży dział obsługi klienta. Bot ma odpowiadać na najczęściej zadawane pytania, wykorzystując *API OpenAI* lub gotowe rozwiązania.\n\n- Interfejs spójny z serwisem\n- Płynne działanie na urządzeniach mobilnych\n- Panel do edycji bazy wiedzy bota', '[\"JavaScript\", \"OpenAI API\", \"HTML\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1792115300', 'fb2f6f95-ea70-4d08-8939-bc3b8a91de71'),
('6f7a8b9c-0d1e-4f2a-3b4c-5d6e7f8a9b0c', 'System rezerwacji wizyt', 'MediPlan', 'Prywatna przychodnia lekarska poszukuje wykonawcy **webowego systemu rezerwacji wizyt online**. Pacjent powinien mieć możliwość wyboru lekarza, daty oraz godziny, a system automatycznie wyśle powiadomienie *SMS*.\n\nWymagana pełna zgodność ze standardami bezpieczeństwa danych (*RODO*).', '[\"Vue.js\", \"Laravel\", \"MySQL\", \"PHP\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793319800', 'b79fa00b-6652-4f77-90b2-8dd933f9ec80'),
('78901234-ef01-4234-5678-90123456abcd', 'System Magazynowy', 'WareHouse', 'Mała hurtownia budowlana zleci napisanie prostej **aplikacji desktopowej** do zarządzania stanem magazynowym. Program musi działać *offline* i synchronizować dane z serwerem tylko na żądanie.\n\nFunkcjonalności:\n- Dodawanie towarów\n- Wystawianie dokumentów WZ/PZ\n- Inwentaryzacja', '[\"Java\", \"JavaFX\", \"Hibernate\", \"MySQL\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1791698200', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('8b9c0d1e-2f3a-4b4c-5d6e-7f8a9b0c1d2e', 'Blog kulinarny', 'TastyCode', 'Szukam osoby, która postawi profesjonalnego **bloga kulinarnego** na bazie *WordPress*. Zależy mi na dedykowanym motywie graficznym dostosowanym do urządzeń mobilnych.\n\nKluczowe wymagania:\n- Optymalizacja *SEO*\n- Wysokie wyniki w *Core Web Vitals*\n- Wtyczki do newslettera i Social Media', '[\"WordPress\", \"PHP\", \"SEO\", \"CSS\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1792683100', 'dbae20c5-69a4-4982-a8b8-9c2272f5b72e'),
('90123456-0123-4456-7890-12345678abcd', 'Portfolio dla Architekta', 'ArchiWeb', 'Szukam **frontendowca** do stworzenia minimalistycznego portfolio dla biura architektonicznego. Projekt jest oszczędny graficznie, ale wymaga *perfekcyjnej typografii* oraz wysokiej jakości prezentacji zdjęć.\n\nStrona musi być statyczna (*Gatsby* lub *Next.js*) z obsługą Headless CMS. Termin realizacji: 2 tygodnie.', '[\"Gatsby\", \"React\", \"GraphQL\", \"Netlify\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793504800', '2638e05d-64e0-4040-88d2-2aa10cd67501'),
('945363e9-5277-49d7-b45b-f996f469ef3d', 'Frontend Developer ', 'MaxMax', 'MaxMax zatrudni\n\nszukamy osób:\n- doświadczonych\n- studentów', '[\"react\",\"node.js\",\"express.js\"]', '{\"Github\":\"https://github.com/mae1579/MaxHire/\",\"Linkedin\":\"https://github.com/mae1579/MaxHire/\"}', '1793953770', 'cd80fb91-dc8f-4a4e-8332-74fe60d2c5e7'),
('9c0d1e2f-3a4b-4c5d-6e7f-8a9b0c1d2e3f', 'Bot Discord do zarządzania', 'GameServer', 'Potrzebujemy zaawansowanego **bota na serwer Discord** naszej społeczności graczy (*ponad 5000 osób*). Bot ma służyć do automatycznej moderacji czatu, przydzielania ról oraz obsługi ticketów wsparcia.\n\nWymagana integracja z API gry w celu prezentowania statystyk.', '[\"Node.js\", \"Discord.js\", \"MongoDB\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1792209100', 'e11ac16f-a76c-4cda-a3d2-8cebd0cbef83'),
('a1b2c3d4-e5f6-4789-0123-456789abcdef', 'Landing Page produktu', 'MarketingPro', 'Agencja reklamowa zleci wykonanie efektownego **Landing Page** dla nowego napoju energetycznego. Strona ma być wizytówką kampanii promocyjnej.\n\nWymagane elementy:\n- Animacje w *GSAP*\n- Płynne scrollowanie\n- Formularz kontaktowy zintegrowany z systemem mailingowym', '[\"HTML\", \"SASS\", \"GSAP\", \"JavaScript\"]', NULL, '1793012900', 'fb2f6f95-ea70-4d08-8939-bc3b8a91de71'),
('b2c3d4e5-f6a7-4890-1234-567890abcdef', 'Baza danych klientów', 'DataFlow', 'Zlecimy zaprojektowanie i wdrożenie **relacyjnej bazy danych** dla firmy handlowej. Obecnie pracujemy na plikach Excel, co staje się nieefektywne, dlatego potrzebujemy migracji do *PostgreSQL*.\n\n- Relacje klientów, zamówień i magazynu\n- Skrypty w Pythonie do czyszczenia i importu danych', '[\"PostgreSQL\", \"SQL\", \"Python\", \"Pandas\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1791584000', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('c3d4e5f6-a7b8-4901-2345-678901abcdef', 'Konfiguracja serwera poczty', 'MailSys', 'Poszukujemy **administratora Linux** do postawienia i zabezpieczenia własnego serwera pocztowego dla małej firmy. Zależy nam na pełnej kontroli nad danymi.\n\nWymagana konfiguracja:\n- *Postfix* oraz *Dovecot*\n- Zabezpieczenia domenowe (*SPF, DKIM, DMARC*)', '[\"Linux\", \"Postfix\", \"Dovecot\", \"Bash\"]', NULL, '1792821000', '1daeb50e-fcd9-40fb-8149-7813b1a5f18f'),
('d4e5f6a7-b8c9-4012-3456-789012abcdef', 'Skrypt do automatyzacji', 'AutoOffice', 'Biuro rachunkowe zleci napisanie **skryptu automatyzującego** generowanie miesięcznych raportów dla klientów. Skrypt powinien pobierać dane z plików *CSV*, przetwarzać je i tworzyć spersonalizowane pliki *PDF*.\n\nRozwiązanie musi być proste w obsłudze dla pracowników nietechnicznych.', '[\"Python\", \"Pandas\", \"ReportLab\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793798100', '2638e05d-64e0-4040-88d2-2aa10cd67501'),
('e5f6a7b8-c9d0-4123-4567-890123abcdef', 'Gra przeglądarkowa 2D', 'IndieWeb', 'Poszukuję **programisty JS** do współpracy przy hobbystycznym projekcie gry platformowej 2D. Gra ma działać w przeglądarce i wykorzystywać bibliotekę *Phaser.js* lub czyste *Canvas API*.\n\nPosiadam gotowe grafiki, potrzebuję wsparcia przy logice i fizyce gry.', '[\"JavaScript\", \"Phaser.js\", \"HTML5\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1792314900', '483c5e36-d237-4b10-9ea5-8103b55d3e05'),
('f1a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Audyt techniczny SEO', 'SearchRise', 'Poszukujemy **eksperta SEO** do przeprowadzenia kompleksowego audytu technicznego naszego serwisu e-commerce.\n\nZakres analizy:\n- Indeksowanie i architektura linków\n- Analiza wskaźników *Core Web Vitals*\n- Poprawność wdrożenia tagów *Schema.org*', '[\"SEO\", \"Google Analytics\", \"Ahrefs\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793412000', 'bc197781-5fce-42b9-aad6-10591e639771'),
('f2a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Aplikacja mobilna dla siłowni', 'FitLife', 'Zlecę stworzenie **aplikacji mobilnej** na systemy *iOS* oraz *Android* dla sieci klubów fitness.\n\nFunkcje:\n- Rezerwacja zajęć grupowych\n- Cyfrowy karnet z kodem *QR*\n- Integracja z płatnościami mobilnymi', '[\"Flutter\", \"Dart\", \"Firebase\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1792015000', '0757f51f-4ce0-4393-8ea0-019781a98992'),
('f3a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Migracja z Magento na Shopify', 'E-Commerx', 'Zlecimy **pełną migrację** działającego sklepu B2B z platformy *Magento* na *Shopify*.\n\nWymagania:\n- Przeniesienie bazy klientów oraz zamówień\n- Zachowanie obecnych struktur adresów *URL* (przekierowania 301)\n- Dostosowanie dedykowanego szablonu', '[\"Shopify\", \"Liquid\", \"Migration\", \"SEO\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1793690000', '1daeb50e-fcd9-40fb-8149-7813b1a5f18f'),
('f4a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Wdrożenie klastra Kubernetes', 'CloudNative', 'Poszukujemy **DevOps Inżyniera** do zaprojektowania i skonteneryzowania naszej aplikacji na infrastrukturze *AWS EKS*.\n\n- Automatyzacja wdrażania za pomocą *GitLab CI*\n- Konfiguracja monitoringu (*Prometheus / Grafana*)', '[\"AWS\", \"Kubernetes\", \"Terraform\", \"GitLab CI\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1792589000', '1f215656-b55f-49fd-af2e-734d1a402e3e'),
('f5a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Wtyczka do przeglądarki Chrome', 'SalesBoost', 'Zlecę stworzenie **rozszerzenia dla Google Chrome**, które ułatwi naszemu zespołowi sprzedażowemu pobieranie publicznych danych biznesowych z serwisu LinkedIn i bezpośredni zapis do wewnętrznego systemu *CRM*.\n\nWymagana obsługa *OAuth2* oraz przejrzysty interfejs.', '[\"JavaScript\", \"Chrome Extensions\", \"HTML/CSS\"]', NULL, '1791780000', '483c5e36-d237-4b10-9ea5-8103b55d3e05'),
('f6a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Algorytm rekomendacji e-commerce', 'SmartStore', 'Poszukujemy **Data Scientista** do stworzenia i dostrojenia silnika rekomendacji produktów w naszym sklepie internetowym z branży elektronicznej.\n\nWymagania:\n- Analiza historii koszyków zakupowych\n- Wystawienie endpointu *FastAPI*\n- Model uczenia maszynowego przygotowany w *Pythonie*', '[\"Python\", \"Scikit-Learn\", \"FastAPI\", \"Pandas\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793215000', 'dd7387aa-328b-47c4-ae49-0397100bdcd3'),
('f7a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Refaktoryzacja UI panelu klienta', 'FinTechApp', 'Poszukujemy **Frontend Developera** do odświeżenia warstwy wizualnej w naszej aplikacji finansowej.\n\nOczekujemy:\n- Przepisania komponentów na *React* z wykorzystaniem *Tailwind CSS*\n- Dokładnego odwzorowania makiet przygotowanych w systemie *Figma*\n- Wdrożenia *Dark Mode* oraz dbałości o zasady *a11y*', '[\"React\", \"Tailwind CSS\", \"Figma\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1792750000', 'e11ac16f-a76c-4cda-a3d2-8cebd0cbef83'),
('f8a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Testy E2E dla serwisu edukacyjnego', 'QA House', 'Zlecimy wdrożenie automatycznych **testów E2E** na platformie szkoleniowej online.\n\n- Opracowanie scenariuszy testowych w *Cypress* lub *Playwright*\n- Integracja z potokiem *GitHub Actions*\n- Generowanie raportów z wyników testów', '[\"Cypress\", \"JavaScript\", \"Playwright\", \"CI/CD\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793654000', 'fb2f6f95-ea70-4d08-8939-bc3b8a91de71'),
('f9a2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Integracja PrestaShop z hurtownią XML', 'AutoParts', 'Poszukujemy **programisty PHP** do napisania automatycznego skryptu integrującego sklep *PrestaShop* z zewnętrzną hurtownią motoryzacyjną.\n\nZadania:\n- Cykliczny import stanów magazynowych oraz cen poprzez *XML API*\n- Automatyczna aktualizacja oferty co 15 minut\n- Poprawne mapowanie kategorii produktów', '[\"PHP\", \"PrestaShop\", \"XML\", \"API\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\"}', '1791899000', 'b79fa00b-6652-4f77-90b2-8dd933f9ec80'),
('faa2b3c4-d5e6-f7a8-b9c0-1d2e3f4a5b6c', 'Wizualizacja smartwatcha – 3D Rendering', 'CreativeMinds', 'Zlecimy wykonanie serii **renderingów i animacji 3D** dla nowego modelu smartwatcha na potrzeby kampanii promocyjnej w mediach społecznościowych.\n\n- Oteksturowanie i wyrenderowanie dostarczonych modeli *CAD*\n- Przygotowanie krótkich klipów wideo (*15s i 30s*)\n- Wysoka dbałość o detale oświetlenia i materiałów', '[\"Blender\", \"Cinema 4D\", \"3D Animation\", \"Rendering\"]', '{\"Github\": \"https://github.com/mae1579/MaxHire/\", \"Linkedin\": \"#\"}', '1793450000', '6b296584-2181-4358-9f6d-358e86279216');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(7) DEFAULT NULL,
  `name` varchar(55) NOT NULL,
  `surname` varchar(55) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `cv_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `surname`, `phone`, `photo`, `cv_url`, `description`) VALUES
('0757f51f-4ce0-4393-8ea0-019781a98992', 'anna.kowalska@gmail.com', '$2b$10$vDid.CRgdny7sXzBJHb1eesmbIaaBp.iaJGz4q.u1.ggiHQTsgtYe', 'user', 'Anna', 'Kowalska', '+486012345677', 'https://ui-avatars.com/api/?name=Anna+Kowalska&background=random', '', 'Jestem **Project Managerem** z zamiłowaniem do *metodyk zwinnych*. Oferuję kompleksowe prowadzenie projektów IT.\n\n**Moje umiejętności:**\n- Scrum / Kanban\n- Zarządzanie ryzykiem\n- Kontakt z klientem'),
('159d6187-32bb-4d6a-9ed6-5c3fb498e882', 'a4@wp.pl', '$2b$10$XSyJOTvwNqpI.HULfggIBOZAsdjZvqz.UMGY5PDI4L1CjD6UFZwq2', 'user', 'a4', 'a4', NULL, 'https://ui-avatars.com/api/?name=a4+a4&background=random', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1793983457/UserCVs/vyvx0cjstgtb073drq8m.pdf', 'Młodszy programista **Java**. Zorientowany na rozwój i naukę tworzenia aplikacji webowych.'),
('1daeb50e-fcd9-40fb-8149-7813b1a5f18f', 'piotr.nowak@wp.pl', '$2b$10$CRz.KqrgC6IenPjAJtspIObpuuZDUtiS5HpvkNcMBDCurKaKmutZO', 'user', 'Piotr', 'Nowak', '+48502345678', 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=random', '', 'Doświadczony **Backend Developer** w ekosystemie *.NET*. Pasjonat czystego kodu i skalowalnej architektury.'),
('1f215656-b55f-49fd-af2e-734d1a402e3e', 'janek12@janek.pl', '$2b$10$tWWKxLowGVZRxRDSe7NDDOjAfwIcoZV1XAa1hgQ6Y54xQQinMiC.K', 'admin', 'janek', 'janek', NULL, 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1792937251/ProfilePhoto/m4ramouvpilagvyoapo6.png', '', '**Administrator systemów Linux** i inżynier *DevOps*. Gwarantuję stabilność infrastruktury w chmurze.\n\n**Technologie:**\n- Docker / Kubernetes\n- AWS / Azure'),
('2638e05d-64e0-4040-88d2-2aa10cd67501', 'mario.wisniewski@gmail.com', '$2b$10$pzoOdtzHGTz7UZNL./iSE.4f6cuDvSL6yEvOGOG8kBKijov41vQPe', 'user', 'Mariusz', 'Wiśniewski', '+48790111222', 'https://ui-avatars.com/api/?name=Mariusz+Wisniewski&background=random', '', '**Architekt Sieciowy** (CCNP). Specjalizuję się w projektowaniu bezpiecznych infrastruktur *korporacyjnych*.'),
('483c5e36-d237-4b10-9ea5-8103b55d3e05', 'jacek.ksiezyc@gmail.com', '$2b$10$uavRx4rMnJmyGobeqptkpez.VJEpW4bkHUeM1azQIEraf7h79aEre', 'user', 'Jacek', 'Księżyc', '+48666777888', 'https://ui-avatars.com/api/?name=Jacek+Ksiezyc&background=random', '', 'Tworzę **szybkie i nowoczesne** aplikacje typu *SPA*. Zwracam uwagę na zasady *UX* oraz optymalizację kodu.'),
('6b296584-2181-4358-9f6d-358e86279216', 'a6@wp.pl', '$2b$10$pqiky0rkwqTXNEH70bjeYO7ACBPYa3EFalo2nIUYe6g7GRIAozv9C', 'user', 'a6', 'a6', NULL, 'https://ui-avatars.com/api/?name=a6+a6&background=random', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1793984711/UserCVs/mznmxb4a3zxdpwmwlwtr.pdf', 'Specjalista ds. **Grafiki 3D** oraz wizualizacji produktowych.'),
('91937019-ae5d-4afd-b880-f8ce412803b9', 'a3@wp.pl', '$2b$10$OU0Plxugb8fnEickYE3ZwesSaTW4lRoBq9T4ZTNAZvRIEDH9Pc79y', 'user', 'a3', 'a3', NULL, 'https://ui-avatars.com/api/?name=a3+a3&background=random', '', 'Programista **Frontend**. Pasjonat biblioteki *React* i Tailwind CSS.'),
('b79fa00b-6652-4f77-90b2-8dd933f9ec80', 'kamil.maj@wp.pl', '$2b$10$8uzrDSp4luTeZiKsBkGb/e4TKRg.bdBLwN9irPbpmLEW9qs0/CKMe', 'user', 'Kamil', 'Maj', '+48505606707', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1768008486/ProfilePhoto/tw7v5btvlulcqj4tlpus.jpg', '', 'Ekspert systemów **Cyberbezpieczeństwa**. Przeprowadzam specjalistyczne testy penetracyjne.\n\n- Zgodność z normami OWASP\n- Zabezpieczenia sieciowe'),
('bb727450-8bf9-4d89-b915-ba3ecafe18c1', 'a2@wp.pl', '$2b$10$9uXNAUQ.tf1Y8DUPVqBDx.H1PlRTpI2YS2uF4ydT7MjyYfXubRfxW', 'admin', 'A2', 'a2', '1323', NULL, '', ''),
('bc197781-5fce-42b9-aad6-10591e639771', 'adam.kowalski@wp.pl', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Adam', 'Kowalski', '+48600900800', 'https://ui-avatars.com/api/?name=Adam+Kowalski&background=random', '', '**Fullstack Developer** (*React + Node.js*). Buduję użyteczne i stabilne aplikacje od A do Z z dbałością o testy.'),
('cd80fb91-dc8f-4a4e-8332-74fe60d2c5e7', 'a1@wp.pl', '$2b$10$Wm9ldAuKWaQZyo3nsgKQZO9L9Ql/MKfqzQzSlm3QmJ5dtWZfaIxp6', 'user', 'Jan', 'Szynszyl', '535 356 735', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1793961249/ProfilePhoto/b86uxliwhzho6mlflywo.png', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1793965165/UserCVs/odhx6xfgoslpalyidupw.pdf', 'JĘZYKI PODSTAWOWE\nJavaScript (ES6+)\nTypeScript\nHTML5 / CSS3\nEKOSYSTEM REACT\nReact.js\nNext.js (App Router)\nReact Router\nZARZĄDZANIE STANEM\nRedux Toolkit\nZustand\nReact Query (TanStack)\nSTYLIZOWANIE & UI\nTailwind CSS\nStyled-components\nMaterial UI / Shadcn/ui'),
('dbae20c5-69a4-4982-a8b8-9c2272f5b72e', 'krzysztof.zielony@wp.pl', '$2b$10$MznG0LPcVKDFPL0ADuxLvuz3kn577NXhl5nzoYn4a4SV75OwWEKPi', 'user', 'Krzysztof', 'Zielony', '+48501502503', 'https://ui-avatars.com/api/?name=Krzysztof+Zielony&background=random', '', 'Wieloletni praktyk **SEO** oraz *twórca stron na WordPressie*. Pomagam firmom zaistnieć w sieci.\n\n- Optymalizacja indeksowania\n- Konfiguracja e-commerce'),
('dd7387aa-328b-47c4-ae49-0397100bdcd3', 'janek@janek.pl', '$2b$10$0ZevgpuzJsaB8sYueAmI5.qHh09uRKZOq0TK7WzbF9TuVC7IKlJgi', 'user', 'janek', 'janek', NULL, 'https://ui-avatars.com/api/?name=janek+janek&background=random', '', '**Data Scientist** oraz entuzjasta systemów *AI / Machine Learning*. Analizuję dane biznesowe przy użyciu Pythona.'),
('e11ac16f-a76c-4cda-a3d2-8cebd0cbef83', 'jan.nowakowski@gmail.com', '$2b$10$y27Yghrct7FhplUr3M2wO.Onm/Ngr/J.53/z9aG3wlOy9wzZjZ4Se', 'user', 'Jan', 'Nowakowski', '+48781782783', 'https://ui-avatars.com/api/?name=Jan+Nowakowski&background=random', '', 'Programista **Python/Django**. Projektuję wydajne architektury *REST API* oraz spinam systemy B2B.'),
('f405788c-21f0-4db4-bfc8-43d6f02de8d6', 'a5@wp.pl', '$2b$10$N8IZaG3Af.Z2VWMIxt2Vs.KJ3SwD9wzRc6U6po9nDwcVsbEuTWR5e', 'user', 'a5', 'a5', NULL, 'https://ui-avatars.com/api/?name=a5+a5&background=random', 'https://res.cloudinary.com/dp8o4hppt/image/upload/v1793984323/UserCVs/iixbjqzqqwibalhvc48y.pdf', 'Inżynier oprogramowania ukierunkowany na **technologie webowe**.'),
('fb2f6f95-ea70-4d08-8939-bc3b8a91de71', 'monika.zajac@gmail.com', '$2b$10$ksCVQDKYGN2gGFm/h75/melSEjukB4LI4Dvnxaa2L5XsYUx2lRX.u', 'user', 'Monika', 'Zając', '+48512345678', 'https://ui-avatars.com/api/?name=Monika+Zajac&background=random', '', '**UX/UI Designer**. Projektuję *intuicyjne* interfejsy mobilne oraz desktopowe z naciskiem na dostępność *a11y*.');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `FK_offers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
