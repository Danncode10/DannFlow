# E-VetDoc System Discovery Report

**Purpose:** Capture the product requirements inferred from the 14 reference images in this folder. This is a discovery artifact only; it does not change the application or database.

## Executive summary

The reference material describes **E-VetDoc**, a web-based veterinary clinic management system. It should give pet owners a self-service portal and give clinic personnel a secure workspace for appointments, pet records, clinical documentation, invoices, payments, notifications, and printable reports.

The central workflow is:

1. A pet owner registers, adds or views their pet information, and requests an appointment.
2. Clinic personnel review and schedule the appointment; walk-ins are also recorded through a visit logbook/check-in flow.
3. A veterinarian reviews the pet’s history and creates clinical records, such as diagnoses, treatments, confinement or surgery notes, and prescriptions.
4. The clinic creates an invoice; the owner pays at the clinic, and authorized staff record the payment, issue a receipt, and notify the owner.
5. Authorized staff generate printable/PDF patient, diagnosis, and payment reports.

## Users and permissions

| Role | Main responsibilities | Required access boundary |
| --- | --- | --- |
| **Pet owner / client** | Register and sign in; view their own pets and medical history; request/view appointments; view invoices and receipts; print appointment details. | Can access only their own profile, pets, appointments, records, invoices, and receipts. |
| **Clinician / clinic administrator** | Manage clients and pet records; add patients; search/list patients; manage appointment schedules; create/update invoices; record payments; manage permitted user accounts. | Limited to their clinic and assigned operational duties. Financial and user-management privileges should be explicit. |
| **Veterinarian** | View appointments and pet details; document medical history, laboratory, confinement, and surgery diagnoses; create prescriptions; generate medical reports. | Can view only pets and appointments within their clinic, and create/update records within their professional scope. |
| **System / integrations** | Send notifications, deliver invoices and receipts, and generate documents. | Uses server-side credentials only; must not bypass user authorization. |

## Functional requirements recovered from the images

### Identity and access

- Client registration and login.
- Secure login and logout for clients, clinicians, and veterinarians.
- Role-aware access, not a single generic “user” experience.
- Account/profile management for authorized clinic personnel.

### Pet owners and pets

- Store owner contact information and a pet profile (name, age/date of birth, breed, species, sex, and owner relationship).
- Let clinic staff add and update patients/pets.
- Support search and a patient list for clinic staff.
- Let owners view information for their own pets.

### Appointments and visits

- Owners request online appointments for consultations, vaccinations, and other clinic services.
- Staff and veterinarians view schedules and appointment details.
- Keep appointment history and allow owners to print appointment information.
- Support walk-in visits and a logbook/check-in record.
- Track an appointment lifecycle, at minimum: requested, confirmed/scheduled, completed, cancelled, and no-show.

### Clinical records

- Maintain a longitudinal medical history per pet.
- Record clinical notes and diagnoses, including laboratory, confinement, and surgery-related records where applicable.
- Record treatments and medications.
- Create prescriptions.
- Store the source patient-history questionnaire shown in the sample record: origin/acquisition, living environment, diet, appetite and attitude, drinking habits, symptoms, prior veterinary history, examinations, and vaccinations/preventives.
- Generate a consolidated patient-and-owner record suitable for printing/PDF export.

### Billing and payments

- Create and update invoices for services/products.
- Show invoice details to the owner.
- Let authorized clinic staff record an in-clinic payment, beginning with cash payments.
- Record payment amount, method, date/time, optional reference or notes, and the staff member who recorded it.
- Support unpaid, partially paid, paid, voided, and refunded/corrected invoice states as appropriate.
- Deliver a digital receipt by email and/or in the application after staff record payment, and provide a printable PDF receipt.
- Preserve an audit trail: paid payments must be corrected through a void/refund/correction record rather than silently overwritten.

### Notifications and reporting

- Send appointment reminders, alerts, receipts, and status updates.
- Generate PDF/printable reports, including patient records, veterinary diagnoses, and payment assessments.
- Provide reliable search, retrieval, update, and cloud storage of clinic information.

## Proposed system modules

| Module | What it should contain |
| --- | --- |
| **Authentication and roles** | Supabase Auth, profile data, clinic membership, clinician/veterinarian/admin roles, and RLS policies. |
| **Clinic and staff management** | Clinic identity, operating hours, staff memberships, veterinarian availability, and permissions. |
| **Owner and pet registry** | Owners, pets, pet-owner relationships, demographics, history questionnaire, and document uploads. |
| **Appointment and visit management** | Service catalog, appointment requests, scheduling, status history, walk-ins, check-in/logbook, and reminders. |
| **Medical records** | Encounters/consultations, diagnoses, treatments, lab results, confinement notes, surgery notes, prescriptions, and attachments. |
| **Billing** | Invoice headers/lines, adjustments, staff-recorded in-clinic payments, receipts, and financial reporting. |
| **Notifications** | In-app notifications, email templates/delivery logs, appointment reminders, and payment/receipt messages. |
| **Reports and documents** | Patient record PDF, prescription PDF, invoice/receipt PDF, operational reports, and access-controlled downloads. |

## Suggested core data model

The following entities should be designed before implementation. They intentionally separate clinical and financial history so records remain traceable.

```text
profiles ──< clinic_memberships >── clinics
profiles ──< pets (as owner) >── pet_owners ──< pets
pets ──< appointments >── services
appointments ──< visits/encounters ──< diagnoses
visits/encounters ──< treatments
visits/encounters ──< prescriptions ──< prescription_items
visits/encounters ──< laboratory_results
visits/encounters ──< confinement_records
visits/encounters ──< surgery_records
appointments/visits ──< invoices ──< invoice_items
invoices ──< payments ──< receipts
profiles/pets/appointments/invoices ──< notifications
```

Important design choices:

- Use a `clinic_id` on all clinic-owned records to support strict tenancy and future multi-clinic operation.
- Model the owner-pet relationship separately (`pet_owners`) so a pet can have multiple authorized owners if needed.
- Treat a medical encounter as immutable or versioned after sign-off; record amendments rather than silently overwriting clinical facts.
- Record the staff member who entered each payment and retain payment/correction history for accountability.
- Store document metadata in the database and files in Supabase Storage, with protected buckets and signed URLs.

## Compatibility with the current repository

**Conclusion: Yes—this system is very feasible in the current Next.js 16 + Supabase + Drizzle architecture.** The repository already provides a useful foundation, but it is currently a generalized service-business starter rather than a veterinary medical-record system.

| Capability | Current state | Work needed |
| --- | --- | --- |
| Next.js application, Tailwind, Shadcn-style components | Available | Rebuild the information architecture and screens around clinic workflows. |
| Supabase authentication | Available | Add clinic-aware roles and route/page authorization. |
| Drizzle schema and migrations | Available | Create the veterinary schema in `db/schema/`, generate and review migrations, then refresh generated types. |
| Existing bookings/services | Partially reusable | Adapt or replace the vehicle-oriented booking fields with pet, clinic, veterinarian, service, and appointment-status fields. |
| Existing notifications | Partially reusable | Add recipient ownership, delivery channels, templates, scheduling, and notification preferences. |
| Existing audit logs | Available | Extend to clinical and billing audit events; restrict log visibility to authorized staff. |
| In-clinic billing/payment processing | Not implemented | Add invoice/payment tables, a staff-only payment-recording workflow, payment history, email receipts, printable PDFs, and audit logs. |
| Medical records and prescriptions | Not implemented | Add clinical entities, workflows, PDF templates, and strong RLS/audit rules. |
| PDF generation/email delivery | Not installed | Select and integrate libraries/providers during implementation. |

## Delivery approach recommended for later implementation

1. **Foundation:** define clinic membership and role model, RLS policies, pet/owner registry, and database migrations.
2. **Scheduling:** build appointment request, staff scheduling, calendar, visit check-in, and notification reminders.
3. **Clinical workspace:** implement encounters, medical history, diagnosis categories, treatments, labs, confinement/surgery notes, and prescriptions.
4. **Finance:** implement invoices, line items, staff-recorded cash payments, receipt generation, and payment corrections/refunds.
5. **Documents and reporting:** build the patient-record, prescription, invoice, and management-report PDFs; add secure sharing/printing.
6. **Hardening:** test role/clinic isolation, audit trails, backups, error handling, accessibility, and payment-record integrity.

## Scope and risk notes

- This is feasible as a web application; the hardware specifications in the reference images are not product requirements for a cloud-hosted SaaS. The practical requirement is a modern browser, stable internet, and optionally a clinic printer.
- Online payment gateways, mobile-payment providers, and payment webhooks are deliberately **out of scope for the first release**. They can be added later if the clinic needs remote payment collection.
- Medical and payment data require careful access control, auditability, backups, and retention decisions. These are core requirements, not late-stage polish.
- The images describe the desired functions but do not define essential product rules such as clinic multi-tenancy, appointment duration, cancellation policy, diagnostic vocabulary, prescription-signing policy, receipt numbering, or local compliance requirements. Those decisions should be confirmed before schema work.
- The existing `profiles.role` enum currently has only `admin` and `user`. It must be expanded or replaced by clinic-scoped memberships before clinician/veterinarian permissions can be safely implemented.

## Reference material reviewed

All 14 supplied images in this folder were reviewed. They include use-case descriptions for the client, clinician, veterinarian, and system actors; a use-case/framework diagram; a generated patient-record example; billing/payment and notification requirements; and deployment/hardware discussion.
