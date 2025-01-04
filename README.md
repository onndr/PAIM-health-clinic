---
title: Health Clinic (React + Flask + PostgreSQL project)
authors: Andrii Gamalii, Adam Kowalkowski
date: 04.01.2025
---

## Health Clinic (React + Flask + PostgreSQL project)

## Project requirements

### Functional requirements

- Istnieje jeden specjalny (istniejący) użytkownik **librarian**
- Zwykły użytkownik musi **się zalogować** do swojego konta, jak nie ma konta to może takie stworzyć w procesie **rejestracji konta** (bez potwierdzania mailowego). Autentykacjapowinna być zrobiona z wykorzystaniem JWT
- Zalogowany użytkownik który nie ma wypożyczonych książek może **skasować swoje konto** (librarian nie może skasować konta)
- Użytkownik może **wyszukiwać książki**
- Jeżeli książka nie jest wypożyczona lub zarezerwowana użytkownik **może ją zarezerwować**
- Rezerwacja jest **ważna do końca dnia następnego**
- Użytkownik może **wyświetlić swoje rezerwacje i niektóre (wskazane) kasować**
- Lista książek w bibliotece jest zarządzana przez użytkownika 'librarian' Jeżeli książka była choć raz wypożyczona to jej skasowanie polega na zaznaczeniu że jest trwale niedostepna (i niewidoczna przy wyszukiwaniu przez zwykłych użytkowników)
- Użytkownik librarian może **wyświetlić listę wszystkich rezerwacji** i wyszukaną **rezerwację zmienić na wypożyczenie**
- Użytkownik librarian może **wyświetlić listę wszystkich wypożyczeń** i w wyszukanym **wypożyczeniu zmienić informację, że książka jest dostępna**

### Technical requirements

#### Technologia implementacji

- Zadania 3 musi być zrealizowane za pomocą technologii React w języku Typescript.Sugerowana implementacja strony serwerowej w ASP.MVC webapi, ale dopuszczalne są innetechnologie (Typescript, Python, Java SpringBoot,...)
- obsługa CSS powinna być zrealizowana za pomocą Bootstrap (lub odpowiedników takich jak Tailwind, Materialize ...)

#### Format Danych

- Dane są przechowywane w bazie danych. Wybór bazy oraz jej struktura należy do studenta
- Dostęp do bazy musi być zrealizowany za pomocą Entity Framework
- Student dostarcza konfigurację niezbędną do uruchomienia rozwiązania w środowisku testowym (którym jest Ubuntu 22.04 z zainstalowanym dotnet 8.100 oraz docker compose)

- następujące dane powinny być przechowywane: (student decyduje co jeszcze trzeba przechować)
  - book:
    - id, author, publisher, date of publication, price, history of leases
  - user:
    - user name, first name, last name, email-adress, phone number, history of book leases, password
