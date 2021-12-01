import { Layout } from 'components/layout'
import { getPostData, getPosts } from "lib/notion";
import { renderBlock } from "components/common/content"
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from 'next/head'
import { Date } from 'components/date'
import { ParsedUrlQuery } from "querystring";
import { Fragment } from "react";
import utilStyles from 'styles/utils.module.css'
import { Post } from 'model/post'

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
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = await getPosts()
  const paths = posts.map(post => {
    return {
      params: {
        id: post.id
      }
    }
  })
  return {
    paths,
    fallback: false,
  }
}