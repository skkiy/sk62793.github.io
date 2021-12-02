import Head from 'next/head'
import Link from 'next/link'
import { Box, Flex } from "@chakra-ui/react";

import styles from './layout.module.css'
import utilStyles from 'styles/utils.module.css'
import {NAME, SITE_TITLE} from "conf"
interface Props {
  home?: boolean
}

export const Layout: React.FC<Props> = ({ children, home }) => {
  return (
    <Box className={styles.container} minH={"100%"} marginY={0}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="sasayu's portfolio"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            SITE_TITLE
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={SITE_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <Flex alignItems={"center"}>
            <img
              // priority
              src="/images/profile.png"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={NAME}
            />
            <h1 className={utilStyles.heading2Xl}>{NAME}</h1>
          </Flex>
        ) : (
          <Flex alignItems={"center"}>
            <Link href="/">
              <a>
                <img
                  // priority
                  src="/images/profile.png"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={NAME}
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{NAME}</a>
              </Link>
            </h2>
          </Flex>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </Box>
  )
}
