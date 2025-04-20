# Random Questions & Letters

A fun and interactive web application that generates random questions from different categories and allows users to write heartfelt letters to friends.

## Features

- Random question generation from various categories (Random, Food, Animals, Philosophy)
- Answer submission with personality insights
- Save and view past answers
- Write and download letters to friends
- Modern, responsive design with Tailwind CSS
- Local storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd random-questions
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
  ├── components/
  │   └── Navbar.js
  ├── pages/
  │   ├── Home.js
  │   ├── QuestionPage.js
  │   ├── MyAnswers.js
  │   └── LetterToFriend.js
  ├── utils/
  │   └── questions.js
  ├── App.js
  ├── index.js
  └── index.css
```

## Technologies Used

- React
- React Router
- Tailwind CSS
- date-fns
- Heroicons

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License. 