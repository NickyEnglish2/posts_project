export const testData = {
  posts: [
    {
      id: "1",
      title: "First Post by User 1",
      body: "This is the body of the first post by User 1.",
      userId: "1",
      comments: ["1"]
    },
    {
      id: "2",
      title: "Second Post by User 2",
      body: "This is the body of the second post by User 2.",
      userId: "2",
      comments: ["2"]
    }
  ],
  comments: [
    {
      id: "1",
      postId: "1",
      userId: "2",
      body: "Great post! I really enjoyed reading it."
    },
    {
      id: "2",
      postId: "2",
      userId: "1",
      body: "Nice post!"
    }
  ],
  users: [
    {
      id: "1",
      name: "John Doe"
    },
    {
      id: "2",
      name: "Jane Smith"
    }
  ]
};