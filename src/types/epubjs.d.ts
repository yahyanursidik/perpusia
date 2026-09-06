declare module "epubjs" {
  export interface Rendition {
    destroy(): void;
    display(target?: string | Element): Promise<unknown>;
    next(): Promise<unknown>;
    prev(): Promise<unknown>;
    on(event: "relocated", callback: (location: { atStart?: boolean; atEnd?: boolean; start?: { displayed?: { page?: number; total?: number } } }) => void): void;
    themes: { fontSize(size: string): void };
  }

  export interface Book {
    destroy(): void;
    renderTo(target: string | Element, options?: Record<string, unknown>): Rendition;
  }

  export default function ePub(input: string | ArrayBuffer): Book;
}
