import { Fragment } from "react";
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";

import { Post } from 'model'
import { Layout, Date, renderBlock } from 'components/common'
import { getPostData, getPosts } from "lib/notion";
import utilStyles from 'styles/utils.module.css'

interface Props {
  postData: Post
}

const Post: NextPage<Props> = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date || ""} />
        </div>
        {postData.contents?.map((content, i) => (
          <Fragment key={i}>{renderBlock(content)}</Fragment>
        ))}
      </article>
    </Layout>
  )
}

export default Post

interface Params extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const postData = await getPostData(params!.id)
  return {
    props: {
      postData,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await getPosts()
  const paths = posts.map(post => {
    return {
      params: {
        id: post.id
      },
    }
  })
  return {
    paths,
    fallback: "blocking",
  }
}