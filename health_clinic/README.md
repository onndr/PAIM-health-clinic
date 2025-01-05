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
    | Id            | String, PK  |
    | FirstName     | String      |
    | LastName      | String      |
    | Email         | String      |
    | PhoneNumber   | String      |
    | Password      | String      |
    | Pesel         | String      |

2. Diseases

    | Column Name       | Column Type           |
    |-------------------|-----------------------|
    | Id                | String, PK            |
    | Name              | String                |
    | UserId            | String, FK            |
    | Date              | Date                  |
    | Status            | AppointmentStatus     |

3. PatientDiseases

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | String, PK  |
    | PatientId         | String, FK  |
    | DiseaseId         | String, FK  |

4. Medics

    | Column Name   | Column Type |
    |---------------|-------------|
    | Id            | String, PK  |
    | FirstName     | String      |
    | LastName      | String      |
    | Email         | String      |
    | PhoneNumber   | String      |
    | Password      | String      |
    | Pesel         | String      |

5. Services

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | String, PK  |
    | Name              | String      |

6. MedicsServices

    | Column Name       | Column Type |
    |-------------------|-------------|
    | Id                | String, PK  |
    | MedicId           | String, FK  |
    | ServiceId         | String, FK  |

7. Appointments

    | Column Name       | Column Type           |
    |-------------------|-----------------------|
    | Id                | String, PK            |
    | MedicId           | String, FK            |
    | PatientDiseaseId  | String, FK            |
    | Date              | Date                  |
    | Status            | AppointmentStatus     |
    | Notes             | String                |

8. MedicTimetable

    | Column Name       | Column Type           |
    |-------------------|-----------------------|
    | Id                | String, PK            |
    | MedicId           | String, FK            |
    | Day               | String, FK            |
    | FromTime          | String                |
    | ToTime            | String                |
