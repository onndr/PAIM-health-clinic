---
title: Library React + FastAPI project
author: Andrii Gamalii
date: 04.01.2024
---

## Library React + FastAPI project

### How to run

```shell
docker compose up -d
cd ../frontend ; yarn build &
cd backend ; uvicorn app.main:app
```

### Project decisions

#### Database

##### Special types

- Enum BookStatus = {Available, Reserved, Loaned, PermanentlyUnavailable}
- Enum LoanStatus = {Reserved, Taken, Returned, ReservationCancelled, ReservationExpired}

##### Tables

1. Users

    | Column Name   | Column Type |
    |---------------|-------------|
    | Id            | String, PK  |
    | UserName      | String      |
    | FirstName     | String      |
    | LastName      | String      |
    | Email         | String      |
    | PhoneNumber   | String      |
    | Password      | String      |
    | IsLibrarian   | Bool        |
    | Version       | Number      |

2. Books

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | String, PK  |
    | Title             | String      |
    | Author            | String      |
    | Publisher         | String      |
    | PublicationDate   | Date        |
    | Price             | Number      |
    | Status            | BookStatus  |
    | Version           | Number      |

3. Loans

    | Column Name       | Column Type   |
    |-------------------|---------------|
    | Id                | String, PK    |
    | BookId            | String, FK    |
    | UserId            | String, FK    |
    | FromDate          | Date          |
    | ToDate            | Date          |
    | Status            | LoanStatus    |
