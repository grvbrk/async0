export const MAX_QUERY_LENGTH = 20;
export const COLUMN_VISIBILITY_BREAKPOINTS = [
  {
    max: 640,
    columns: {
      solutions: false,
      bookmarks: false,
      difficulty: false,
      topics: false,
      lists: false,
      link: false,
    },
  },
  {
    max: 768,
    columns: {
      solutions: false,
      bookmarks: true,
      difficulty: true,
      topics: true,
      lists: false,
      link: false,
    },
  },
  {
    max: 1024,
    columns: {
      solutions: true,
      bookmarks: true,
      difficulty: true,
      topics: true,
      lists: false,
      link: false,
    },
  },
  {
    max: Infinity,
    columns: {
      solutions: true,
      bookmarks: true,
      difficulty: true,
      topics: true,
      lists: true,
      link: true,
    },
  },
];
