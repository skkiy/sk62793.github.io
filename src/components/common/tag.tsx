import { Badge, Box } from "@chakra-ui/react";
import { Category } from "model";

export const CategoryTag: React.FC<Category> = ({ id, name, color }) => {
  return (
    <Badge colorScheme={color} variant={"subtle"}>{name}</Badge>
  )
}