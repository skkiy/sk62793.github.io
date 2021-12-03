import { Client } from "@notionhq/client";
import { JSDOM } from "jsdom"
import { Post, Report } from "model";

const notionSecret = process.env.NEXT_PUBLIC_NOTION_SECRET || ''
const postDatabaseId = process.env.NEXT_PUBLIC_NOTION_POST_DATABASE_ID || ''
const reportDatabaseId = process.env.NEXT_PUBLIC_NOTION_REPORT_DATABASE_ID || ''

const notion = new Client({
  auth: notionSecret,
});

export const getPosts = async (): Promise<Post[]> => {
  const data = await notion.databases.query({
    database_id: postDatabaseId,
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

export const getReports = async (): Promise<Report[]> => {
  const data = await notion.databases.query({
    database_id: reportDatabaseId,
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
    const reportData: Report = {
      id: res.id,
      title: "",
      date: "",
      categories: [],
    }
    const report = res.properties.report
    if (report.type === "title") {
      reportData.title = report.title[0]?.plain_text || ""
    }

    const category = res.properties.category
    if (category.type === "multi_select") {
      reportData.categories = category.multi_select
    }

    const date = res.properties.date
    if (date.type === "date") {
      reportData.date = date.date?.start || ""
    }
    return reportData
  })
};

export const getReportData = async (id: string): Promise<Report> => {
  const report: Report = {
    id,
    date: "",
    title: "",
    contents: [],
    categories: [],
  }
  const data = await notion.pages.retrieve({
    page_id: id,
  })
  if (data.properties.report.type === "title") {
    report.title = data.properties.report.title[0].plain_text
  }
  if (data.properties.date.type === "date") {
    report.date = data.properties.date.date?.start || ""
  }
  if (data.properties.category.type === "multi_select") {
    report.categories = data.properties.category.multi_select
  }
  const content = await notion.blocks.children.list({ block_id: id });
  report.contents = await Promise.all(content.results.map(async (results) => {
    const { type } = results
    if (type === "bookmark") {
      const url = results[type].url
      const meta = await fetch(url)
        .then(res => res.text())
        .then(text => {
          const metaData = {
            url,
            title: "",
            description: "",
            image: "",
          }
          const doms = new JSDOM(text)
          const metas = doms.window.document.getElementsByTagName("meta")
          for (let i = 0; i < metas.length; i++) {
            const property = metas[i].getAttribute("property");
            if (typeof property == "string") {
              if (property.match("og:title")) metaData.title = metas[i].getAttribute("content") || "";
              if (property.match("og:description")) metaData.description = metas[i].getAttribute("content") || "";
              if (property.match("og:image")) metaData.image = metas[i].getAttribute("content") || "";
            }
          }
          return metaData
        })
        .catch(error => {
          console.error(error)
          return {}
        })
      return {
        ...results,
        [type]: {
          ...results[type],
          meta,
        }
      }
    }
    return results
  }))
  return report
}
