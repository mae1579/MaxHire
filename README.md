## MaxHire – Projekt Portalu Ogłoszeniowego IT

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 

MaxHire to wszechstronny ekosystem dla branży IT, który optymalizuje współpracę na linii technologia–biznes poprzez usprawnienie procesów projektowych. Kluczowym wyróżnikiem platformy jest elastyczny model dwustronnej publikacji ogłoszeń, pozwalający firmom sprawnie zlecać zadania, a specjalistom aktywnie oferować swoje usługi w ramach jednego, zintegrowanego systemu.

### Struktura Repozytorium

Repozytorium zawiera kod źródłowy api i frontendu:

*   **[./client](/client/)**
    *   Aplikacja front end zbudowana w **React** na silniku **Vite**
    *   Stylizacja przy użyciu **Tailwind CSS** z ikonami z **Lucide React**
    *   Odpowiada za warstwę wizualną i komunikację z API.
*   **[./backend](/backend/)**
    *   Serwer REST API oparty na **Node.js i Express.js**
    *   Relacyjna baza danych **MySQL z hashowaniem haseł JWT** i możliwością uploadu zdjęć do **Cloudinary**
    *   Zarządza logiką autoryzacją i przetwarzaniem danych.

### Kluczowe Endpointy API

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/offers` | Pobiera listę wszystkich dostępnych ogłoszeń |
| `GET` | `/offer/getOffer/:id` | Pobiera pojedyncze ogłoszenie |
| `GET` | `/profile/getProfile/:id` | Pobiera informacje użytkownika |
| `POST` | `/addOffer` | Dodaje ogłoszenie do bazy |
| `POST` | `/upload/profilePhoto` | Uploaduje zdjęcie użytkownika |
| `POST` | `/register` | Rejestruje konto użytkownika |
| `POST` | `/login` | Loguje na konto użytkownika |

### Wygląd i Design

![Wygląd strony](https://raw.githubusercontent.com/mae1579/MaxHire-Backend/refs/heads/main/art/site-preview.jpg)

### Licencja

Projekt jest objęty licencją **GNU GPL v3.0**. Pełna treść licencji znajduje się w pliku `LICENSE`.
