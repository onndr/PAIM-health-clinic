---
title: Health Clinic (React + Flask + PostgreSQL project)
authors: Andrii Gamalii, Adam Kowalkowski
date: 04.01.2025
---

## Health Clinic (React + Flask + PostgreSQL project)

## Project requirements

### Functional requirements

Przychodnia zdrowia (kalendarz, przegląd usług, przegląd lekarzy, historia choroby)

Aplikacja powinna umożliwiać:

- Zakładanie konta użytkownika,
- Uwierzytelnienie (Logowanie),
- Przeglądanie katalogu usług, przegląd lekarzy/lekarek (oceny ich pracy),
- Umawianie terminu wizyty (podgląd wolnych terminów w kalendarzu przychodni – można wzorować się na kalendarzu w portalu „Znany lekarz”)/zwalnianie terminu (rezygnacja),
- Przegląd zrealizowanych wizyt (termin, lekarz/lekarka, przebieg wizyty),

### Technical requirements

#### Technologia implementacji

- Aplikacja internetowa powinna zostać wykonana z wykorzystaniem frameworka React.
- Aplikacja backend powinna zostać wykonana w języku Python z wykorzystaniem frameworka Flask.
- Aplikacja powinna zostać wdrożona w środowisku kontenerów Docker.

#### Format Danych

- Dane są przechowywane w bazie danych PostgreSQL
- Dostęp do bazy zrealizowany za pomocą biblioteki Pythonowej SQLAlchemy
- Struktura bazy danych dokładnie opisana w [readme](health_clinic\README.md)
