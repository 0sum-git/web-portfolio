import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return { title: `project: ${name}` };
}

export default async function ProjectPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const project = await prisma.project.findFirst({
    where: { title: name },
    include: { files: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 md:pt-20 pb-16 md:pb-32">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>back to projects</span>
          </Link>
          
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>view on github</span>
            </Link>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{project.title}</h1>
        <div className="text-xs text-zinc-400 mb-4">Created: {new Date(project.createdAt).toLocaleString()}</div>
        <div className="mb-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src = '', alt, ...props }) => {
                  const isLocal = !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/');
                  const finalSrc = isLocal ? `/uploads/${src}` : src;
                  
                  return (
                    <img
                      src={finalSrc}
                      alt={alt}
                      className="rounded shadow max-w-full h-auto my-4"
                      style={{ display: 'block', marginLeft: 0, marginRight: 0 }}
                      {...props}
                    />
                  );
                },
                h1: (props) => <h1 className="text-4xl mt-8 mb-4 pb-2 border-b border-muted font-bold" {...props} />,
                h2: (props) => <h2 className="text-3xl mt-8 mb-4 pb-2 border-b border-muted font-bold" {...props} />,
                h3: (props) => <h3 className="text-2xl mt-6 mb-3 font-bold" {...props} />,
                ul: ({ children, ...props }) => (
                  <ul className="list-disc pl-6 my-4" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal pl-6 my-4" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="my-2" {...props}>
                    {children}
                  </li>
                ),
                code: (props) => (
                  <code className="bg-zinc-800 text-green-400 px-1 py-0.5 rounded" {...props} />
                ),
                pre: (props) => (
                  <pre className="bg-zinc-900 text-white p-4 rounded my-4 overflow-x-auto" {...props} />
                ),
                table: (props) => (
                  <table className="table-auto border-collapse my-4" {...props} />
                ),
                th: (props) => (
                  <th className="border px-2 py-1 bg-zinc-800 text-white" {...props} />
                ),
                td: (props) => (
                  <td className="border px-2 py-1" {...props} />
                ),
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
