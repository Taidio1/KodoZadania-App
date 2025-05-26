# KodoZadania-App

## Opis Aplikacji

KodoZadania-App (Python Programming Practice) to interaktywna aplikacja webowa stworzona, aby pomagać użytkownikom w nauce i doskonaleniu umiejętności programowania w Pythonie poprzez praktyczne wyzwania kodowania oraz przeglądanie i uczenie się definicji pojęć programistycznych. Aplikacja oferuje intuicyjny interfejs z wbudowanym edytorem kodu i natychmiastową informacją zwrotną, a także sekcję dedykowaną nauce teorii.

## Kluczowe Cechy

*   **Interaktywny Edytor Kodu:** Wbudowany edytor z podświetlaniem składni i sprawdzaniem błędów, wspierający formatowanie kodu.
*   **Biblioteka Wyzwań:** Kolekcja zadań programistycznych o różnym poziomie trudności.
*   **Natychmiastowa Informacja Zwrotna:** Szybka weryfikacja i feedback dla przesłanych rozwiązań.
*   **Sekcja Definicji:** Baza pojęć programistycznych z możliwością oznaczania jako przeczytane.
*   **Strona Profilu:** Statystyki postępów użytkownika, w tym przeczytane definicje i ukończone zadania, przedstawione graficznie.
*   **Pasek Nawigacyjny:** Łatwy dostęp do kluczowych sekcji aplikacji (Definicje, Zadania, Profil).

## Plany na Przyszły Rozwój

Planowane ulepszenia i nowe funkcje obejmują:

*   **Integracja z Supabase:** Wykorzystanie Supabase do zarządzania bazą danych, uwierzytelniania i funkcji w czasie rzeczywistym (już częściowo zaimplementowane).
*   **Uwierzytelnianie Użytkowników:** Wprowadzenie systemu logowania i rejestracji (już częściowo zaimplementowane).
*   **Rozbudowa Biblioteki Wyzwań i Definicji:** Dodanie większej liczby zadań i pojęć.
*   **Śledzenie Postępów:** Monitorowanie osiągnięć użytkowników (już częściowo zaimplementowane na stronie profilu).
*   **Zaawansowane Wykonywanie Kodu:** Implementacja bezpiecznego środowiska do uruchamiania kodu Python.
*   **Funkcje Społecznościowe:** Umożliwienie dzielenia się rozwiązaniami i dyskusji.

## Overview
Python Programming Practice is an interactive web application that provides a platform for users to solve Python programming challenges. The application features a split interface with problem descriptions on the left and a code editor on the right, allowing users to write and test their Python solutions in real-time.

##Features
Interactive Code Editor: Syntax highlighting, code completion, and error checking
Challenge Library: A collection of Python programming challenges with varying difficulty levels
Instant Feedback: Immediate results and feedback on submitted solutions
Model Solutions: Reference solutions that users can reveal after solving or when they need help
Hints System: Optional hints to guide users without giving away the full solution
Admin Dashboard: Interface for managing and adding new challenges
Technology Stack
Frontend: Next.js, React, Tailwind CSS
UI Components: shadcn/ui
Code Editor: Monaco Editor
Code Execution: Simulated (with plans for secure Python execution)
Installation
Prerequisites
Node.js 18.0 or higher
npm or pnpm


Setup:
1.Clone the repository:
```shellscript
git clone https://github.com/yourusername/python-programming-practice.git
cd python-programming-practice
```

2. Install dependencies:

```shellscript
npm install
# or
pnpm install
```


3. Run the development server:

```shellscript
npm run dev
# or
pnpm dev
```


4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Usage

### Solving Challenges

1. Browse available challenges and select one to solve
2. Read the problem description, requirements, and any provided hints
3. Write your Python solution in the code editor
4. Click "Submit Solution" to test your code
5. Review the feedback and results
6. If needed, view the model solution after attempting the challenge


### Adding New Challenges (Admin)

1. Navigate to the Admin Dashboard at `/admin`
2. Fill in the challenge details:

    1. Title and unique ID
    2. Difficulty level
    3. Problem description
    4. Starter code template
    5. Model solution
    6. Solution keywords or test cases



3. Save the challenge to add it to the library


## Project Structure

```
python-programming-practice/
├── app/                    # Next.js app directory
│   ├── api/                # API routes for code execution
│   ├── admin/              # Admin dashboard
│   ├── challenges/         # Challenge listing page
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   ├── code-editor.tsx     # Monaco editor component
│   └── ui/                 # UI components from shadcn
├── lib/                    # Utility functions and data
│   └── challenges.ts       # Challenge data structure
└── public/                 # Static assets
```

## Future Development Plans

The following features are planned for future development:

- **User Authentication**: Implement login and registration functionality to allow users to track their progress and save their solutions
- **Supabase Integration**: Connect the application to Supabase for database storage, authentication, and real-time features
- **Expanded Challenge Library**: Increase the number of challenges with a balanced distribution across difficulty levels (easy, medium, and hard)
- **Welcome Page**: Add a landing page that doesn't require login but provides an introduction to the application and a button to access the main features
- **Progress Tracking**: Track user progress, completion rates, and performance metrics
- **Leaderboards**: Implement a ranking system to foster healthy competition
- **Solution History**: Store previous attempts to allow users to review their progress
- **Advanced Code Execution**: Implement secure Python code execution using sandboxed environments
- **Social Features**: Allow users to share solutions and discuss approaches


## Contributing