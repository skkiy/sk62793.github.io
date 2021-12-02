import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Post, Report } from 'model'
import { getPosts, getReports } from "lib/notion";
import { Layout, Date, CategoryTag } from 'components/common'
import utilStyles from 'styles/utils.module.css'
import { SITE_TITLE } from "conf";

interface Props {
  allPostsData: Post[]
  allReportsData: Report[]
}

const Home: NextPage<Props> = ({ allPostsData, allReportsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
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
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Report</h2>
        <ul className={utilStyles.list}>
          {allReportsData.map(({ id, date, title, categories }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/reports/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date || ""} />
              </small>
              <br />
              {categories?.map(({ id, name, color }) => (
                <CategoryTag id={id} name={name} color={color} key={id} />
              ))}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export default Home

export const getStaticProps = async () => {
  const allPostsData = await getPosts()
  const allReportsData = await getReports()
  return {
    props: {
      allPostsData,
      allReportsData,
    },
    revalidate: 10,
  }
}
