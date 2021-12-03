import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Content = ArrayElement<ListBlockChildrenResponse["results"]>

type TextRequest = string
type IdRequest = string | string

export type Text = Array<{
  type: "text";
  text: {
    content: string;
    link: {
      url: TextRequest;
    } | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background";
  };
  plain_text: string;
  href: string | null;
} | {
  type: "mention";
  mention: {
    type: "user";
    user: {
      id: IdRequest;
      object: "user";
    } | {
      type: "person";
      person: {
        email: string;
      };
      name: string | null;
      avatar_url: string | null;
      id: IdRequest;
      object: "user";
    } | {
      type: "bot";
      bot: Record<string, never> | {
        owner: {
          type: "user";
          user: {
            type: "person";
            person: {
              email: string;
            };
            name: string | null;
            avatar_url: string | null;
            id: IdRequest;
            object: "user";
          } | {
            id: IdRequest;
            object: "user";
          };
        } | {
          type: "workspace";
          workspace: true;
        };
      };
      name: string | null;
      avatar_url: string | null;
      id: IdRequest;
      object: "user";
    };
  } | {
    type: "date";
    date: {
      start: string;
      end: string | null;
    };
  } | {
    type: "link_preview";
    link_preview: {
      url: TextRequest;
    };
  } | {
    type: "page";
    page: {
      id: IdRequest;
    };
  } | {
    type: "database";
    database: {
      id: IdRequest;
    };
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background";
  };
  plain_text: string;
  href: string | null;
} | {
  type: "equation";
  equation: {
    expression: TextRequest;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background";
  };
  plain_text: string;
  href: string | null;
}>

export interface Post {
  id: string
  date: string
  title: string
  contents?: Content[]
}

export interface Report {
  id: string
  date: string
  title: string
  contents?: Content[]
  categories?: Category[]
}

export interface Category {
  id: string
  name: string
  color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red"
}

export type Meta = {
  url: string
  title: string
  description: string
  image: string
}
