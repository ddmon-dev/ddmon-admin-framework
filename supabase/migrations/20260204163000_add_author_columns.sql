-- notices: updated_by 추가 (author는 이미 있음)
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- news: author, updated_by 추가
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- faqs: author, updated_by 추가
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS updated_by TEXT;
