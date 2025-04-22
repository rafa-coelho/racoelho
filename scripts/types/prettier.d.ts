declare module 'prettier' {
  interface PrettierOptions {
    parser?: string;
    tabWidth?: number;
    useTabs?: boolean;
    semi?: boolean;
    singleQuote?: boolean;
    trailingComma?: 'none' | 'es5' | 'all';
    bracketSpacing?: boolean;
    jsxBracketSameLine?: boolean;
    arrowParens?: 'avoid' | 'always';
    printWidth?: number;
    proseWrap?: 'preserve' | 'always' | 'never';
    htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
    endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr';
    embeddedLanguageFormatting?: 'auto' | 'off';
  }

  function format(code: string, options?: PrettierOptions): string;
  function resolveConfig(filePath: string): Promise<PrettierOptions | null>;

  export { format, resolveConfig };
  export default { format, resolveConfig };
} 