/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ComponentPropsWithoutRef } from 'react';

interface ProjectMarkdownProps {
  content: string;
}

interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
}

export function ProjectMarkdown({ content }: ProjectMarkdownProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
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
