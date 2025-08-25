# **App Name**: QuizWise

## Core Features:

- User Authentication: User authentication via Email/Password or Google Sign-In, with per-user data storage in Firebase.
- Add MCQ: Form to add multiple-choice questions (MCQs), including subject selection/creation, question text, four choices stored as one array, correct answer index, optional explanation, tags, difficulty, and question language.
- View Questions: List of saved questions, filterable by subject, difficulty, and tags, with edit/delete options.
- Generate Exam: Exam generation, filtering the questions by language, difficulty and selecting a number of questions. Display correct answers with explanations upon submission.
- Export to PDF: Button to export the selected exam to PDF. Generates a PDF containing either the questions (without answers), the user's answers with indications of the right answers, or the user's answers with right answers and detailed explanations.

## Style Guidelines:

- Primary color: HSL(210, 75%, 60%) - A vibrant blue (#29ABE2) to convey intelligence and focus.
- Background color: HSL(210, 20%, 95%) - A desaturated, light blue (#F0F8FF) for a clean and calming interface.
- Accent color: HSL(180, 60%, 40%) - A contrasting teal (#33A1C9) for highlighting interactive elements and key actions.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text.
- Consistent use of clear, simple icons from a library like Font Awesome or Material Icons.
- Responsive layout with clear sections for dashboard, question management, and exam generation, adapting seamlessly to both mobile and desktop screens.
- Subtle transitions and hover effects to enhance user experience.