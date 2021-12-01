import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Content = ArrayElement<ListBlockChildrenResponse["results"]>
export interface Post {
  id: string
  date: string
  title: string
  contents?: Content[]
}
