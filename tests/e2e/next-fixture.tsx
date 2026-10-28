import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";

export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} />; }
export function Image({ priority: _priority, fill: _fill, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; fill?: boolean }) {
  // The browser harness cannot provide Next image optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt ?? ""} />;
}
export const useRouter = () => ({ replace: (path: string) => window.location.assign(path), push: (path: string) => window.location.assign(path), refresh() {} });
export default Image;
