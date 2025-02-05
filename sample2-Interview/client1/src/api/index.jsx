const questions = [
  { id: 1, text: "What is the formula for Hydrogen Peroxide?" },
  { id: 2, text: "Explain Newton’s second law of motion." },
  {
    id: 3,
    text: "Describe the importance of Artificial Intelligence in modern technology.",
  },
  {
    id: 4,
    text: "What are the benefits of using React for frontend development?",
  },
];

export const fetchQuestions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(questions);
    }, 500);
  });
};
