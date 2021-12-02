import { Fragment } from "react";
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";

import { Report } from 'model'
import { Layout, Date, renderBlock } from 'components/common'
import { getReportData, getReports } from "lib/notion";
import utilStyles from 'styles/utils.module.css'

interface Props {
  reportData: Report
}

const Report: NextPage<Props> = ({ reportData }) => {
  return (
    <Layout>
      <Head>
        <title>{reportData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{reportData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={reportData.date || ""} />
        </div>
        {reportData.contents?.map((content, i) => (
          <Fragment key={i}>{renderBlock(content)}</Fragment>
        ))}
      </article>
    </Layout>
  )
}

export default Report

interface Params extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const reportData = await getReportData(params!.id)
  return {
    props: {
      reportData,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const reports = await getReports()
  const paths = reports.map(report => {
    return {
      params: {
        id: report.id
      }
    }
  })
  return {
    paths,
    fallback: false,
  }
}