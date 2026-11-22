-- PostgreSQL schema for grievance and CV submissions.
-- Store CV file bytes in private object storage; this schema stores metadata only.
-- Timestamps use timestamptz so date and time are retained together with timezone.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE public.grievance_topic AS ENUM (
    'roads_infrastructure',
    'water_agriculture',
    'public_services',
    'employment',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.grievance_status AS ENUM (
    'received',
    'under_review',
    'in_progress',
    'resolved',
    'closed',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.candidate_role AS ENUM ('job_seeker', 'employer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.candidate_application_status AS ENUM (
    'submitted',
    'screening',
    'shortlisted',
    'interview_scheduled',
    'selected',
    'rejected',
    'withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.grievance_contact_type AS ENUM ('phone', 'email');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.resume_scan_status AS ENUM (
    'pending_scan',
    'clean',
    'quarantined',
    'scan_failed',
    'deleted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.people (
  person_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_e164 text UNIQUE,
  email_address text,
  full_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT people_mobile_e164_format
    CHECK (mobile_e164 IS NULL OR mobile_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  CONSTRAINT people_email_not_blank
    CHECK (email_address IS NULL OR btrim(email_address) <> ''),
  CONSTRAINT people_full_name_not_blank
    CHECK (btrim(full_name) <> ''),
  CONSTRAINT people_full_name_length
    CHECK (char_length(full_name) <= 200)
);

CREATE TABLE IF NOT EXISTS public.grievance_submissions (
  grievance_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid REFERENCES public.people(person_id) ON DELETE RESTRICT,
  submitted_name text NOT NULL,
  contact_type public.grievance_contact_type NOT NULL,
  contact_value text NOT NULL,
  topic public.grievance_topic NOT NULL,
  message text NOT NULL,
  status public.grievance_status NOT NULL DEFAULT 'received',
  consent_given boolean NOT NULL,
  consented_at timestamptz NOT NULL,
  consent_text_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT grievance_name_not_blank CHECK (btrim(submitted_name) <> ''),
  CONSTRAINT grievance_contact_not_blank CHECK (btrim(contact_value) <> ''),
  CONSTRAINT grievance_message_length CHECK (
    char_length(btrim(message)) BETWEEN 5 AND 2000
  ),
  CONSTRAINT grievance_consent_required CHECK (consent_given),
  CONSTRAINT grievance_consent_version_not_blank
    CHECK (btrim(consent_text_version) <> '')
);

CREATE TABLE IF NOT EXISTS public.grievance_status_history (
  grievance_status_history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id uuid NOT NULL
    REFERENCES public.grievance_submissions(grievance_id) ON DELETE RESTRICT,
  status public.grievance_status NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  changed_by text,
  note text,
  CONSTRAINT grievance_history_actor_not_blank
    CHECK (changed_by IS NULL OR btrim(changed_by) <> '')
);

CREATE TABLE IF NOT EXISTS public.candidate_applications (
  application_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL REFERENCES public.people(person_id) ON DELETE RESTRICT,
  submitted_name text NOT NULL,
  submitted_email text,
  role public.candidate_role NOT NULL,
  town text NOT NULL,
  status public.candidate_application_status NOT NULL DEFAULT 'submitted',
  consent_given boolean NOT NULL,
  consented_at timestamptz NOT NULL,
  consent_text_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT candidate_name_not_blank CHECK (btrim(submitted_name) <> ''),
  CONSTRAINT candidate_email_not_blank
    CHECK (submitted_email IS NULL OR btrim(submitted_email) <> ''),
  CONSTRAINT candidate_town_not_blank CHECK (btrim(town) <> ''),
  CONSTRAINT candidate_consent_required CHECK (consent_given),
  CONSTRAINT candidate_consent_version_not_blank
    CHECK (btrim(consent_text_version) <> '')
);

CREATE TABLE IF NOT EXISTS public.candidate_application_status_history (
  application_status_history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL
    REFERENCES public.candidate_applications(application_id) ON DELETE RESTRICT,
  status public.candidate_application_status NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  changed_by text,
  note text,
  CONSTRAINT application_history_actor_not_blank
    CHECK (changed_by IS NULL OR btrim(changed_by) <> '')
);

CREATE TABLE IF NOT EXISTS public.resume_documents (
  resume_document_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL
    REFERENCES public.candidate_applications(application_id) ON DELETE RESTRICT,
  storage_provider text NOT NULL,
  bucket_name text NOT NULL,
  object_key text NOT NULL,
  original_filename text NOT NULL,
  media_type text NOT NULL,
  size_bytes bigint NOT NULL,
  sha256_hex text,
  is_current boolean NOT NULL DEFAULT true,
  scan_status public.resume_scan_status NOT NULL DEFAULT 'pending_scan',
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT resume_storage_provider_not_blank
    CHECK (btrim(storage_provider) <> ''),
  CONSTRAINT resume_bucket_not_blank CHECK (btrim(bucket_name) <> ''),
  CONSTRAINT resume_object_key_not_blank CHECK (btrim(object_key) <> ''),
  CONSTRAINT resume_original_filename_not_blank
    CHECK (btrim(original_filename) <> ''),
  CONSTRAINT resume_media_type_allowed CHECK (
    media_type IN (
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ),
  CONSTRAINT resume_size_limit CHECK (size_bytes BETWEEN 1 AND 10485760),
  CONSTRAINT resume_sha256_format
    CHECK (sha256_hex IS NULL OR sha256_hex ~ '^[0-9a-f]{64}$'),
  CONSTRAINT resume_storage_location_unique UNIQUE (storage_provider, bucket_name, object_key)
);

CREATE UNIQUE INDEX IF NOT EXISTS resume_documents_one_current_per_application
  ON public.resume_documents(application_id)
  WHERE is_current;

CREATE INDEX IF NOT EXISTS grievance_submissions_person_created_idx
  ON public.grievance_submissions(person_id, created_at DESC)
  WHERE person_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS grievance_submissions_status_created_idx
  ON public.grievance_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS grievance_status_history_grievance_time_idx
  ON public.grievance_status_history(grievance_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS candidate_applications_person_created_idx
  ON public.candidate_applications(person_id, created_at DESC);
CREATE INDEX IF NOT EXISTS candidate_applications_status_created_idx
  ON public.candidate_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS candidate_application_status_history_application_time_idx
  ON public.candidate_application_status_history(application_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS resume_documents_application_created_idx
  ON public.resume_documents(application_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS people_set_updated_at ON public.people;
CREATE TRIGGER people_set_updated_at
  BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS grievance_submissions_set_updated_at
  ON public.grievance_submissions;
CREATE TRIGGER grievance_submissions_set_updated_at
  BEFORE UPDATE ON public.grievance_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS candidate_applications_set_updated_at
  ON public.candidate_applications;
CREATE TRIGGER candidate_applications_set_updated_at
  BEFORE UPDATE ON public.candidate_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS resume_documents_set_updated_at ON public.resume_documents;
CREATE TRIGGER resume_documents_set_updated_at
  BEFORE UPDATE ON public.resume_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.record_grievance_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.grievance_status_history (
      grievance_id,
      status,
      changed_by
    )
    VALUES (
      NEW.grievance_id,
      NEW.status,
      NULLIF(current_setting('app.actor', true), '')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grievance_status_history_on_change
  ON public.grievance_submissions;
CREATE TRIGGER grievance_status_history_on_change
  AFTER INSERT OR UPDATE OF status ON public.grievance_submissions
  FOR EACH ROW EXECUTE FUNCTION public.record_grievance_status_change();

CREATE OR REPLACE FUNCTION public.record_candidate_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.candidate_application_status_history (
      application_id,
      status,
      changed_by
    )
    VALUES (
      NEW.application_id,
      NEW.status,
      NULLIF(current_setting('app.actor', true), '')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS candidate_status_history_on_change
  ON public.candidate_applications;
CREATE TRIGGER candidate_status_history_on_change
  AFTER INSERT OR UPDATE OF status ON public.candidate_applications
  FOR EACH ROW EXECUTE FUNCTION public.record_candidate_status_change();

-- Normalize candidate mobile numbers to E.164 before resolving/creating people records.
-- Link a grievance to a person when its submitted contact is a phone number that can
-- be normalized; email-only grievance contacts may leave person_id NULL.
-- Upload CVs to private object storage and save only their key and verified metadata.
-- Generate short-lived signed download URLs in the backend; never store public URLs here.
