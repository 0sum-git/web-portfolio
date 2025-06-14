import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { ComponentPropsWithoutRef, CSSProperties } from 'react';

interface ProjectMarkdownProps {
  content: string;
}

// Define a type for the style object from react-syntax-highlighter
// This is a common pattern for these style objects which contain nested CSSProperties
type SyntaxHighlighterStyle = Record<string, CSSProperties | Record<string, CSSProperties>>;

export default function ProjectMarkdown({ content }: ProjectMarkdownProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-blue-400 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-muted prose-pre:rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...rest }: Omit<ComponentPropsWithoutRef<'code'>, 'style'>) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as SyntaxHighlighterStyle}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: '1.5em 0',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgb(17, 17, 17)',
                }}
                {...rest}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-900 px-1.5 py-0.5 rounded text-sm" {...rest}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-4xl mt-8 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-3xl mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-2xl mt-6 mb-3">{children}</h3>,
          p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
          li: ({ children }) => <li className="my-2">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted pl-4 my-4 italic">{children}</blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
