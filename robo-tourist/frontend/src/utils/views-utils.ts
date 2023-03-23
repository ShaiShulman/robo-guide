import { RefObject } from "react";

export const ensureElementVisible = (
  componentRef: RefObject<HTMLElement | null>
) => {
  if (componentRef.current) {
    componentRef.current.scrollIntoView({ behavior: "smooth" });
  }
};
