/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/problem-ui/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        "ubuntu-mono": ['"Ubuntu Mono"', "monospace"],
        "fira-code": ['"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};
