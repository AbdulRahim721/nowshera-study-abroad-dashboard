-- CopyDownload MVP database schema
-- PostgreSQL / Supabase-compatible SQL
-- All university and student records below are fake practice data.

begin;

-- Students are the primary applicant records.
create table if not exists public.students (
  id bigint generated always as identity primary key,
  name text not null check (length(trim(name)) > 0),
  phone text not null check (length(trim(phone)) >= 7),
  country text not null check (length(trim(country)) > 0),
  marks numeric(5,2) not null check (marks >= 0 and marks <= 100),
  ielts numeric(2,1) check (ielts is null or (ielts >= 0 and ielts <= 9)),
  budget numeric(12,2) check (budget is null or budget >= 0),
  last_reply text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'in_progress', 'documents_pending', 'submitted', 'closed')),
  created_at timestamptz not null default now()
);

-- One row represents one university/program combination.
-- fee is text because the MVP must support currencies and phrases such as
-- "No tuition (about EUR 150 a term)" without introducing a currency table.
create table if not exists public.universities (
  id bigint generated always as identity primary key,
  university text not null check (length(trim(university)) > 0),
  country text not null check (length(trim(country)) > 0),
  program text not null check (length(trim(program)) > 0),
  fee text not null check (length(trim(fee)) > 0),
  deadline date not null,
  min_marks numeric(5,2) not null check (min_marks >= 0 and min_marks <= 100),
  min_ielts numeric(2,1) check (min_ielts is null or (min_ielts >= 0 and min_ielts <= 9)),
  documents_needed text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (university, program)
);

-- Fake document metadata only. No document binaries or real personal documents
-- are stored in this MVP table.
create table if not exists public.documents (
  id bigint generated always as identity primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  document_type text not null check (length(trim(document_type)) > 0),
  file_name text not null check (length(trim(file_name)) > 0),
  status text not null default 'uploaded'
    check (status in ('uploaded', 'under_review', 'approved', 'rejected', 'needs_update')),
  issue text,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  student_id bigint not null references public.students(id) on delete cascade,
  sender text not null check (sender in ('student', 'consultant', 'ai_agent', 'system')),
  message text not null check (length(trim(message)) > 0),
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Useful lookup indexes for the main MVP workflows.
create index if not exists idx_students_status on public.students(status);
create index if not exists idx_students_country on public.students(country);
create index if not exists idx_universities_country_deadline
  on public.universities(country, deadline);
create index if not exists idx_documents_student_id on public.documents(student_id);
create index if not exists idx_documents_status on public.documents(status);
create index if not exists idx_messages_student_created_at
  on public.messages(student_id, created_at desc);
create index if not exists idx_messages_approval_status on public.messages(approval_status);

-- Supabase exposes public-schema tables through the Data API. Keep RLS enabled
-- until a dashboard access model and policies are defined. The n8n workflow can
-- use the server-side service_role key, which bypasses RLS; never expose that key
-- in a browser or client-side application.
alter table public.students enable row level security;
alter table public.universities enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;

-- Test students from the project brief. A NULL IELTS value means "not taken yet".
insert into public.students
  (name, phone, country, marks, ielts, budget, last_reply, status)
values
  ('Ali Khan', '0301 2345678', 'UK', 78.00, 6.5, null, 'Today', 'new'),
  ('Ayesha Noor', '0333 9876543', 'Canada', 85.00, 7.0, null, 'Today', 'new'),
  ('Hamza Iqbal', '0346 2223344', 'UK', 69.00, null, null, '4 days ago', 'new');

-- At least 15 fake university/program records across 5 countries.
-- The first five rows are the required initial records.
insert into public.universities
  (university, country, program, fee, deadline, min_marks, min_ielts, documents_needed)
values
  ('University of Manchester', 'UK', 'BSc Computer Science', '£32,000/year', '2027-01-15', 75.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('University of Leeds', 'UK', 'BSc Business Management', '£27,000/year', '2027-01-31', 70.00, 6.5,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('University of Toronto', 'Canada', 'BSc Computer Science', 'CAD 60,000/year', '2027-01-15', 80.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('TU Munich', 'Germany', 'BSc Informatics', 'No tuition (about €150 a term)', '2027-07-15', 70.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('Monash University', 'Australia', 'Bachelor of IT', 'AUD 48,000/year', '2026-11-30', 70.00, 6.0,
    array['Passport', 'transcript', 'IELTS']),
  ('University of Birmingham', 'UK', 'BSc Artificial Intelligence', '£29,000/year', '2027-01-31', 72.00, 6.5,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('University of Glasgow', 'UK', 'BSc Data Science', '£30,000/year', '2027-01-15', 74.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('University of British Columbia', 'Canada', 'BSc Software Engineering', 'CAD 55,000/year', '2027-01-15', 82.00, 6.5,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('McGill University', 'Canada', 'BCom Finance', 'CAD 48,000/year', '2027-02-01', 78.00, 6.5,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('University of Alberta', 'Canada', 'BSc Computing Science', 'CAD 38,000/year', '2027-03-01', 75.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('RWTH Aachen University', 'Germany', 'BSc Computer Engineering', 'No tuition (about €320 a term)', '2027-07-15', 72.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('University of Berlin', 'Germany', 'BSc Economics', 'No tuition (about €310 a term)', '2027-06-30', 68.00, 6.0,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('University of Sydney', 'Australia', 'Bachelor of Commerce', 'AUD 52,000/year', '2026-12-15', 75.00, 6.5,
    array['Passport', 'transcript', 'IELTS']),
  ('University of Queensland', 'Australia', 'Bachelor of Computer Science', 'AUD 47,000/year', '2027-01-31', 73.00, 6.5,
    array['Passport', 'transcript', 'IELTS', 'personal statement']),
  ('RMIT University', 'Australia', 'Bachelor of Information Technology', 'AUD 39,000/year', '2027-02-28', 68.00, 6.0,
    array['Passport', 'transcript', 'IELTS']);

-- Example fake document metadata and messages for the three seeded students.
insert into public.documents
  (student_id, document_type, file_name, status, issue)
select s.id, v.document_type, v.file_name, v.status, v.issue
from public.students s
join (values
  ('Ali Khan', 'Passport', 'ali_khan_passport_TEST.pdf', 'approved', null),
  ('Ayesha Noor', 'Transcript', 'ayesha_noor_transcript_TEST.pdf', 'under_review', null),
  ('Hamza Iqbal', 'IELTS', 'hamza_iqbal_ielts_TEST.pdf', 'needs_update', 'Fake test file: IELTS score page is missing')
) as v(name, document_type, file_name, status, issue)
  on v.name = s.name;

insert into public.messages (student_id, sender, message, approval_status)
select s.id, v.sender, v.message, v.approval_status
from public.students s
join (values
  ('Ali Khan', 'consultant', 'Welcome Ali. We will review suitable UK computer science options.', 'approved'),
  ('Ayesha Noor', 'system', 'Reminder: please upload the latest transcript.', 'approved'),
  ('Hamza Iqbal', 'consultant', 'Please arrange an IELTS test before we shortlist universities.', 'approved')
) as v(name, sender, message, approval_status)
  on v.name = s.name;

commit;

-- Verification queries (run separately after the schema/seed script if preferred).

-- 1. Confirm table protection and row counts.
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('students', 'universities', 'documents', 'messages')
order by tablename;

select 'students' as table_name, count(*) as row_count from public.students
union all select 'universities', count(*) from public.universities
union all select 'documents', count(*) from public.documents
union all select 'messages', count(*) from public.messages;

-- 2. Find programs that Ali Khan is academically eligible for.
select
  s.name,
  u.university,
  u.country,
  u.program,
  u.fee,
  u.deadline
from public.students s
join public.universities u
  on s.marks >= u.min_marks
 and (u.min_ielts is null or s.ielts >= u.min_ielts)
where s.name = 'Ali Khan'
order by u.deadline;

-- 3. Show each student's documents and any issues.
select s.name, d.document_type, d.file_name, d.status, d.issue
from public.students s
left join public.documents d on d.student_id = s.id
order by s.name, d.uploaded_at;

-- 4. Show the message history for every student.
select s.name, m.sender, m.message, m.approval_status, m.created_at
from public.students s
join public.messages m on m.student_id = s.id
order by s.name, m.created_at;
