import { Heading, Text } from "@chakra-ui/react";
import { Content } from "model/post";
import { Fragment } from "react";
import styles from "./content.module.css"


export const AnnotatedText = ({ text }: { text: any }) => {
  if (!text) {
    return null;
  }
  return text.map((value: any) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
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
      >
        {text.link ?
          <a href={text.link.url}>{text.content}</a>
          :
          <p dangerouslySetInnerHTML={{__html: text.content.replace(/\r?\n/g, '<br>')}}></p>}
      </span>
    );
  });
};

export const renderBlock = (block: Content) => {
  const { type, id } = block;
  switch (type) {
    case "paragraph":
      return (
        <Text marginY={2}>
          <AnnotatedText text={block[type].text} />
        </Text>
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
        <li>
          <AnnotatedText text={block[type].text} />
        </li>
      );
    case "numbered_list_item":
      return (
        <li>
          <AnnotatedText text={block[type].text} />
        </li>
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
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};
