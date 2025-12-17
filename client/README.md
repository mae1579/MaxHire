<img width="1792" height="592" alt="rr1pYhB - Imgur" src="https://github.com/user-attachments/assets/69ee0541-6bd4-4fa4-9caa-3479832bdf68" />




## MaxHire – Portal Ogłoszeniowy IT

MaxHire to wszechstronna platforma dedykowana branży IT, stworzona w celu optymalizacji procesów łączących technologię z biznesem. Projekt działa jako centralny ekosystem, który usprawnia nawiązywanie współpracy, kładąc nacisk na efektywną realizację przedsięwzięć.

Kluczowym wyróżnikiem platformy jest **elastyczny model dwustronnej publikacji ogłoszeń**. System umożliwia firmom skuteczne zlecanie projektów i poszukiwanie wykonawców, a specjalistom – aktywne oferowanie swoich usług. Dzięki temu MaxHire skraca dystans między zleceniodawcą a realizatorem, zapewniając szybkie dopasowanie kompetencji do konkretnych wyzwań i potrzeb projektowych.

## Struktura Projektu

Aplikacja podzielona jest na dwa główne katalogi:

*   **`./frontend`**
    *   Aplikacja kliencka (SPA) zbudowana w **React**.
    *   Stylizacja przy użyciu **Tailwind CSS** dla szybkiego i responsywnego designu.
    *   Odpowiada za warstwę wizualną i komunikację z API.
*   **`./backend`**
    *   Serwer REST API oparty na **Node.js** i **Express.js**.
    *   Wykorzystuje relacyjną bazę danych **MySQL** do bezpiecznego przechowywania ogłoszeń i użytkowników.
    *   Zarządza logiką biznesową, autoryzacją i przetwarzaniem danych.

## Kluczowe Endpointy API

| Metoda | Ścieżka | Opis |
|---|---|---|
| `GET` | `/api/offers` | Pobiera listę wszystkich dostępnych ogłoszeń. |
| `POST` | `/api/auth/register` | Rejestracja nowego użytkownika w bazie. |
| `POST` | `/api/auth/login` | Logowanie i generowanie tokena JWT. |
| `POST` | `/api/offers` | Dodawanie nowego ogłoszenia (wymaga zalogowania). |
| `DELETE`| `/api/offers/:id` | Usuwanie ogłoszenia z bazy danych. |

## Wygląd i Design


# Logowanie

<img width="1000" height="904" alt="K8BnYsq - Imgur" src="https://github.com/user-attachments/assets/532ab3a1-440b-48c7-a686-f62eb741c696" />


# Strona Główna

<img width="1000" height="904" alt="o9xF9Hp - Imgur" src="https://github.com/user-attachments/assets/c1251273-6e9e-410f-b0d8-7c64b16daee6" />


Strona została zaprojektowana w nowoczesnym, **minimalistycznym stylu**. Głównym celem było stworzenie przejrzystego interfejsu, w którym użytkownik się nie gubi.

*   **Kolorystyka:** Oparta na kontraście czerni i bieli, co nadaje aplikacji elegancki i profesjonalny charakter. Ciemne elementy na jasnym tle są bardzo czytelne.
*   **Tło:** Aby ożywić prosty design, zastosowano delikatną, fioletową poświatę (gradient) w tle, która dodaje głębi, ale nie rozprasza uwagi.

## Licencja

Projekt jest objęty licencją **GNU GPL v3.0**. Pełna treść licencji znajduje się w pliku `LICENSE`.
