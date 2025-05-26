-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create challenges table
create table public.challenges (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  language text not null check (language in ('python', 'javascript', 'java')),
  topic text not null,
  starter_code text,
  solution text,
  test_cases jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_solutions table
create table public.user_solutions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  solution_code text not null,
  is_correct boolean not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id)
);

-- Create progress table
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  last_attempt_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id)
);

-- Create challenge_attempts table to track user progress
create table public.challenge_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  challenge_id uuid references public.challenges(id) not null,
  code text not null,
  status text not null check (status in ('success', 'failed', 'in_progress')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.user_solutions enable row level security;
alter table public.progress enable row level security;
alter table public.challenge_attempts enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Challenges are viewable by everyone"
  on public.challenges for select
  using (true);

create policy "Only admins can insert challenges"
  on public.challenges for insert
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Users can view their own solutions"
  on public.user_solutions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own solutions"
  on public.user_solutions for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- Allow all authenticated users to read challenges
create policy "Allow authenticated users to read challenges"
  on public.challenges for select
  to authenticated
  using (true);

-- Allow users to read their own attempts
create policy "Allow users to read their own attempts"
  on public.challenge_attempts for select
  to authenticated
  using (auth.uid() = user_id);

-- Allow users to create their own attempts
create policy "Allow users to create their own attempts"
  on public.challenge_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to update their own attempts
create policy "Allow users to update their own attempts"
  on public.challenge_attempts for update
  to authenticated
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_challenges_updated_at
  before update on public.challenges
  for each row
  execute function update_updated_at_column();

create trigger update_challenge_attempts_updated_at
  before update on public.challenge_attempts
  for each row
  execute function update_updated_at_column(); 