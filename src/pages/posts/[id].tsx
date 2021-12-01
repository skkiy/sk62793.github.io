import { Layout } from 'components/layout'
import { getAllPostIds, getPostData } from 'lib/posts'
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from 'next/head'
import { Date } from 'components/date'
import { ParsedUrlQuery } from "querystring";
import utilStyles from 'styles/utils.module.css'
import { PostDataModel } from 'model/post'

interface Props {
    postData: PostDataModel
}

const Post:NextPage<Props> = ({ postData }) => {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false,
    }
}