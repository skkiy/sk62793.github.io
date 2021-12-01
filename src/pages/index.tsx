import { getPosts } from "lib/notion";
import Head from 'next/head'
import { NextPage } from 'next'
import { Layout, siteTitle } from 'components/layout'
import utilStyles from 'styles/utils.module.css'
import Link from 'next/link'
import { Date } from 'components/date'
import { Post } from 'model/post'

interface Props {
  allPostsData: Post[]
}

const Home: NextPage<Props> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Software Engineer</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date || ""} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export default Home

export async function getStaticProps() {
  const allPostsData = await getPosts()
  return {
    props: {
      allPostsData
    }
  }
}
