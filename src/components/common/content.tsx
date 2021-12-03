import { Box, Heading, Text, ListItem, UnorderedList, Link, Img } from "@chakra-ui/react";

import { Content, Meta, Text as TextModel } from "model";
import styles from "./content.module.css"


export const AnnotatedText = ({ text }: { text: TextModel }) => (
  <>
    {text.map((value, i) => {
      const {
        annotations: { bold, code, color, italic, strikethrough, underline },
        type
      } = value;
      return (
        <span
          className={[
            bold ? styles.bold : "",
            code ? styles.code : "",
            italic ? styles.italic : "",
            strikethrough ? styles.strikethrough : "",
            underline ? styles.underline : "",
          ].join(" ")}
          style={color !== "default" ? { color } : {}}
          key={i}
        >
          {type === "text" ?
            value.text.link ?
              <a href={value.text.link.url}>{value.text.content}</a>
              :
              <p dangerouslySetInnerHTML={{ __html: value.text.content.replace(/\r?\n/g, '<br>') }} />
            : <></>}
          {type === "mention" || type === "equation" &&
          <p dangerouslySetInnerHTML={{ __html: value.plain_text.replace(/\r?\n/g, '<br>') }} />}
        </span>
      )
    })}
  </>
)

export const renderBlock = (block: Content) => {
  const { type, id } = block;
  switch (type) {
    case "paragraph":
      return (
        <Box marginY={2}>
          <AnnotatedText text={block[type].text} />
        </Box>
      );
    case "heading_1":
      return (
        <Heading as={"h1"} size={"xl"} marginY={6}>
          <AnnotatedText text={block[type].text} />
        </Heading>
      );
    case "heading_2":
      return (
        <Heading as={"h2"} size={"lg"} marginY={4}>
          <AnnotatedText text={block[type].text} />
        </Heading>
      );
    case "heading_3":
      return (
        <Heading as={"h3"} size={"md"} marginY={3}>
          <AnnotatedText text={block[type].text} />
        </Heading>
      );
    case "bulleted_list_item":
      return (
        <UnorderedList>
          <ListItem>
            <AnnotatedText text={block[type].text} />
          </ListItem>
        </UnorderedList>
      );
    case "numbered_list_item":
      return (
        <UnorderedList>
          <ListItem>
            <AnnotatedText text={block[type].text} />
          </ListItem>
        </UnorderedList>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={block[type].checked} />{" "}
            <AnnotatedText text={block[type].text} />
          </label>
        </div>
      );
    case "toggle":
      const toggle = block[type]
      return (
        <details>
          <summary>
            <AnnotatedText text={toggle.text} />
          </summary>
          {/*{toggle.children?.map((block: any) => (*/}
          {/*  <Fragment key={block.id}>{renderBlock(block)}</Fragment>*/}
          {/*))}*/}
        </details>
      );
    case "child_page":
      return <p>{block[type].title}</p>;
    case "image":
      const image = block[type]
      const src =
        image.type === "external" ? image.external.url : image.file.url;
      const caption = image.caption ? image.caption[0].plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return <blockquote key={id}>{block[type].text[0].plain_text}</blockquote>;
    case "bookmark":
      // @ts-ignore
      const { meta } = block[type] as { meta: Meta }
      return (
        <Link href={block[type].url} target={"_blank"} marginY={2} display={"block"}>
          <Box display={"flex"} h={24} border={"1px solid"} borderColor={"#ddd"} borderRadius={5}>
            <Box flex={2} p={2}>
              <Text fontSize={"medium"}>{meta.title ?? ""}</Text>
              <Text fontSize={"small"}>{meta.description ?? ""}</Text>
              <Text fontSize={"small"}>{block[type].url}</Text>
            </Box>
            <Box flex={1}>
              <Img src={meta.image ?? ""} w={"100%"} h={"100%"} objectFit={"cover"} />
            </Box>
          </Box>
        </Link>
      )
    default:
      break
      // return `❌ Unsupported block (${
      //   type === "unsupported" ? "unsupported by Notion API" : type
      // })`;
  }
};
