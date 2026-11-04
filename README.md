# MaxHire

Portal ogłoszeń IT: zlecenia, profile, generator CV, panel admina.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Firmy i freelancerzy wrzucają ogłoszenia w jednym miejscu. Konto, logowanie hasłem albo linkiem na maila, CV do PDF i na profil, admin kasuje userów.

![Podgląd](https://raw.githubusercontent.com/mae1579/MaxHire-Backend/refs/heads/main/art/site-preview.jpg)

## Stack

| Warstwa | Tech |
| --- | --- |
| Front | React 19, Vite 7, Tailwind 4, React Router |
| API | Express 5, JWT w cookie `token_auth`, mysql2 |
| Baza | MySQL 8, schemat `storemax` (`backend/baza.sql`) |
| Reszta | Cloudinary (zdjęcia + PDF CV), Gmail, Gemini (odczyt CV / match ofert) |

```
MaxHire/
├── client/     # UI  →  http://localhost:5173
└── backend/    # API →  http://localhost:3000
```

Lokalnie Vite proxy: `/backend/*` → `localhost:3000/*` (obcina prefix). W kodzie axios bije w `/backend/login`, Express ma `/login`.

## Odpalenie (bez Dockera)

1. MySQL na `127.0.0.1:3306`, user `root` **bez hasła**, baza `storemax`.
2. Import `backend/baza.sql`.
3. Plik **`.env` w korzeniu repo** (backend ładuje `backend/.env`, potem `../.env`):

```env
JWT_SECRET=
JWT_SECRET2=
JWT_EMAILLOGIN=
BCRYPT_SALT=10
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_APP_EMAIL=
GMAIL_APP_PASSWORD=
GEMINI_API_KEY=
```

```bash
cd backend && npm install && npm start
cd client && npm install && npm run dev
```

Front: http://localhost:5173  
W `client/.env`: `VITE_BACKEND_API_URL=` (puste).

### Docker

```bash
docker compose up --build
```

MySQL + API + client. Backend w compose dostaje `DB_HOST=db`.

## Co umie aplikacja

- Rejestracja / login / recover, regulamin, prywatność
- Przeglądanie i tworzenie ogłoszeń, profil, zdjęcie
- Generator CV (8 szablonów + 2 premium, na razie tylko admin), PDF, zapis na `POST /upload/uploadcv`
- Panel admina (`/admin`, rola `admin`)
- Gemini: wypełnianie rejestracji z PDF i match ofert do CV

## API (skrót)

Wymaga cookie `token_auth`, chyba że napisane inaczej. Front dokleja prefix `/backend`.

| Metoda | Ścieżka | Opis |
| --- | --- | --- |
| `POST` | `/register` | Rejestracja |
| `POST` | `/register/registerAi/cv` | Gemini wyciąga dane z PDF |
| `POST` | `/login` | Login hasłem |
| `POST` | `/login/email/loginuser` | Link magiczny na maila |
| `POST` | `/logout` | Wylogowanie |
| `GET` | `/offers?page=&search=` | Lista ogłoszeń |
| `GET` | `/offer/getOffer/:id` | Jedno ogłoszenie |
| `POST` | `/addOffer` | Nowe ogłoszenie |
| `PATCH` | `/offers/editOffer/:id` | Edycja |
| `DELETE` | `/offers/deleteOffer/:id` | Usunięcie |
| `GET` | `/profile/getProfile/:id` | Profil |
| `POST` | `/upload/profilePhoto` | Zdjęcie |
| `POST` | `/upload/uploadcv` | PDF CV → Cloudinary, `users.cv_url` |
| `GET` | `/admin/userList` | Lista userów (admin) |

## Licencja

**GNU GPL v3.0** — plik `LICENSE`.
