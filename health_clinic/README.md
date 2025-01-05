---
title: Health Clinic (React + Flask + PostgreSQL project)
author: Andrii Gamalii, Adam Kowalkowski
date: 04.01.2024
---

## Health Clinic (React + Flask + PostgreSQL project)

### How to run

```shell
docker compose up -d
cd ../frontend ; yarn build &
cd backend ; uvicorn app.main:app
```

### Project decisions

#### Database

##### Special types

- Enum AppointmentStatus = {Reserved, Realized, Cancelled, Expired}
- Enum Day = {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}

##### Tables

1. Patients

    | Column Name   | Column Type |
    |---------------|-------------|
    | Id            | Integer, PK |
    | FirstName     | String      |
    | LastName      | String      |
    | Email         | String      |
    | PhoneNumber   | String      |
    | Pesel         | String      |
    | HashedPass    | String      |

2. Diseases

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | Integer, PK |
    | Name              | String      |

3. PatientDisease

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | Integer, PK |
    | PatientId         | Integer, FK |
    | DiseaseId         | Integer, FK |

4. Medics

    | Column Name   | Column Type |
    |---------------|-------------|
    | Id            | Integer, PK |
    | FirstName     | String      |
    | LastName      | String      |
    | Email         | String      |
    | PhoneNumber   | String      |
    | Pesel         | String      |
    | HashedPass    | String      |

5. MedicDisease

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | Integer, PK |
    | MedicId           | Integer, FK |
    | DiseaseId         | Integer, FK |

6. Appointments

    | Column Name       | Column Type       |
    |-------------------|-------------------|
    | Id                | Integer, PK       |
    | MedicId           | Integer, FK       |
    | PatientDiseaseId  | Integer, FK       |
    | Date              | Date              |
    | Status            | AppointmentStatus |
    | Notes             | String            |

7. MedicTimetable

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | Integer, PK |
    | MedicId           | Integer, FK |
    | Day               | Day         |
    | FromTime          | String      |
    | ToTime            | String      |
