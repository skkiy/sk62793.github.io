import { Client } from "@notionhq/client";
import { Post } from "model/post";

const notionSecret = process.env.NEXT_PUBLIC_NOTION_SECRET || ''
const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || ''

const notion = new Client({
  auth: notionSecret,
});

export const getPosts = async (): Promise<Post[]> => {
    const data = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'published',
            checkbox: {
              equals: true,
            },
          },
        ]
      },
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
    });
  return data.results.map(res => {
    const post = res.properties.post
    const date = res.properties.date
    const postData: Post = {
      id: res.id,
      title: "",
      date: "",
    }
    if (post.type === "title") {
      postData.title = post.title[0]?.plain_text || ""
    }
    if (date.type === "date") {
      postData.date = date.date?.start || ""
    }
    return postData
  })
};

export const getPostData = async (postId: string): Promise<Post> => {
  const post: Post = {
    id: postId,
    date: "",
    title: "",
    contents: [],
  }
  const data = await notion.pages.retrieve({
    page_id: postId,
  })
  if (data.properties.post.type === "title") {
    post.title = data.properties.post.title[0].plain_text
  }
  if (data.properties.date.type === "date") {
    post.date = data.properties.date.date?.start || ""
  }
  const content = await notion.blocks.children.list({ block_id: postId });
  post.contents = content.results
  return post
}