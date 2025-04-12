declare namespace React {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  interface ReactPortal extends ReactElement {
    children: ReactNode;
  }

  type ReactNode = ReactElement | ReactFragment | ReactPortal | string | number | boolean | null | undefined;
} 