import "dotenv/config";

import { chunkText } from "../src/lib/chunk-text";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const content =
  "React is a JavaScript library for building user interfaces. React components are reusable pieces of UI that can accept data through props. React state allows components to store and manage data that can change over time.";

// const chunks = [
//   {
//     id: "react-chunk-0",
//     content: "React is a JavaScript library for building user interfaces.",
//     chunkIndex: 0,
//   },
//   {
//     id: "react-chunk-1",
//     content:
//       "React components are reusable pieces of UI that can accept data through props.",
//     chunkIndex: 1,
//   },
//   {
//     id: "react-chunk-2",
//     content:
//       "React state allows components to store and manage data that can change over time.",
//     chunkIndex: 2,
//   },
//   {
//     id: "react-chunk-3",
//     content:
//       "React props are inputs passed from a parent component to a child component.",
//     chunkIndex: 3,
//   },
//   {
//     id: "react-chunk-4",
//     content:
//       "React Hooks are functions that let components use features such as state and effects.",
//     chunkIndex: 4,
//   },
//   {
//     id: "react-chunk-5",
//     content:
//       "The useState Hook allows a React component to create and update state.",
//     chunkIndex: 5,
//   },
//   {
//     id: "react-chunk-6",
//     content:
//       "The useEffect Hook allows React components to perform side effects after rendering.",
//     chunkIndex: 6,
//   },
//   {
//     id: "react-chunk-7",
//     content:
//       "The useMemo Hook memoizes a calculated value so that the calculation can be reused between renders.",
//     chunkIndex: 7,
//   },
//   {
//     id: "react-chunk-8",
//     content:
//       "The useCallback Hook memoizes a function so that the same function reference can be reused between renders.",
//     chunkIndex: 8,
//   },
//   {
//     id: "react-chunk-9",
//     content:
//       "React.memo can prevent a component from re-rendering when its props have not changed.",
//     chunkIndex: 9,
//   },
//   {
//     id: "react-chunk-10",
//     content:
//       "React Context allows components to access shared data without passing props through every level of the component tree.",
//     chunkIndex: 10,
//   },
//   {
//     id: "react-chunk-11",
//     content:
//       "React event handling allows components to respond to user interactions such as clicks, typing, and form submissions.",
//     chunkIndex: 11,
//   },
//   {
//     id: "react-chunk-12",
//     content:
//       "Conditional rendering in React allows components to display different UI based on application state or other conditions.",
//     chunkIndex: 12,
//   },
//   {
//     id: "react-chunk-13",
//     content:
//       "React lists are commonly rendered by using the map function to transform an array into a collection of elements.",
//     chunkIndex: 13,
//   },
//   {
//     id: "react-chunk-14",
//     content:
//       "React keys help React identify items in a list and determine which items have changed, been added, or been removed.",
//     chunkIndex: 14,
//   },
//   {
//     id: "react-chunk-15",
//     content:
//       "React rendering is the process of React calculating what the user interface should look like based on the current component state and props.",
//     chunkIndex: 15,
//   },
//   {
//     id: "react-chunk-16",
//     content:
//       "React reconciliation is the process React uses to compare the previous UI representation with the new one and determine necessary updates.",
//     chunkIndex: 16,
//   },
//   {
//     id: "react-chunk-17",
//     content:
//       "The Virtual DOM is an in-memory representation of the UI that React uses when determining updates to the actual DOM.",
//     chunkIndex: 17,
//   },
// ];

const chunkContents = chunkText(content, 80, 20);
console.log("Generated chunks:", chunkContents);

async function main() {
  // Remove the previous test document if it already exists.
  await prisma.chunk.deleteMany({
    where: {
      documentId: "react-basics",
    },
  });

  await prisma.document.deleteMany({
    where: {
      id: "react-basics",
    },
  });

  // await prisma.document.create({
  //   data: {
  //     id: "react-basics",
  //     title: "React Basics",
  //     content: chunks.map((chunk) => chunk.content).join(" "),

  //     chunks: {
  //       create: chunks,
  //     },
  //   },
  // });

  await prisma.document.create({
    data: {
      id: "react-basics",
      title: "React Basics",
      content,
      chunks: {
        create: chunkContents.map((content, index) => ({
          id: `react-chunk-${index}`,
          content,
          chunkIndex: index,
        })),
      },
    },
  });

  console.log("RAG document and chunks seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
