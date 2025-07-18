"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";

// admin code should be validated on the server side, not in client code

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  files: FileImage[];
  technologies: string[];
  githubUrl?: string;
}

interface FileImage {
  id: string;
  url: string;
  createdAt: string;
  projectId: string;
}

function AdminProjectCard({ project, onEdit }: { project: Project, onEdit: (project: Project) => void }) {
  return (
    <motion.div
      className="border rounded-lg p-4 bg-background dark:bg-zinc-800 shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-2 cursor-pointer"
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onEdit(project)}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold truncate" title={project.title}>{project.title}</h3>
        <span className="text-xs text-zinc-400">{new Date(project.createdAt).toLocaleDateString('en-US')}</span>
      </div>
      <p className="text-sm text-muted mb-1 truncate" title={project.description}>{project.description}</p>
      {project.githubUrl && (
        <p className="text-xs text-blue-500 truncate" title={project.githubUrl}>
          GitHub: {project.githubUrl}
        </p>
      )}
      {Array.isArray(project.technologies) && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-0">
          {project.technologies.map((tech, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        {project.files.length === 0 && <span className="text-zinc-400 text-xs">No images</span>}
        {project.files.map(file => (
          <img
            key={file.id}
            src={file.url}
            alt="project image"
            className="w-14 h-14 object-cover rounded border"
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [technologies, setTechnologies] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedProject, setSelectedProject] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuth) fetchProjects();
    // eslint-disable-next-line
  }, [isAuth]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
        setError("Failed to fetch projects");
      }
    } catch (e) {
      setError("Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setIsAuth(true);
        setError("");
      } else {
        setError("Invalid code");
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setContent(project.content);
    setTechnologies(project.technologies.join(", "));
    setGithubUrl(project.githubUrl || "");
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setContent("");
    setTechnologies("");
    setGithubUrl("");
    setIsEditing(false);
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const techArray = technologies.split(",").map(t => t.trim()).filter(Boolean);
      const projectData = { 
        title, 
        description, 
        content, 
        technologies: techArray,
        githubUrl: githubUrl.trim() || undefined
      };
      
      let res;
      if (isEditing && editingProject) {
        res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: editingProject,
            ...projectData
          }),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      }
      
      if (!res.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} project`);
      
      setTitle("");
      setDescription("");
      setContent("");
      setTechnologies("");
      setGithubUrl("");
      setEditingProject(null);
      setIsEditing(false);
      fetchProjects();
    } catch (e) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleUploadImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || imageFiles.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("projectId", selectedProject);
      imageFiles.forEach((file) => formData.append("images", file));
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload images");
      setImageFiles([]);
      setSelectedProject("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProjects();
    } catch (e) {
      setError("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <PageTransition>
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm bg-background">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4">admin login</h2>
            <form onSubmit={handleLogin}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <input
                  type="password"
                  placeholder="admin code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3 bg-background"
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-foreground text-background p-2 rounded-lg hover:bg-muted transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                login
              </motion.button>
            </form>
            {error && (
              <motion.p
                className="text-red-500 mt-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground pt-16 md:pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted mb-8">manage your projects and images quickly and easily.</p>
          {error && <motion.p className="text-red-500 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}

          {/* project creation/editing form */}
          <section className="mb-10">
            <h3 className="font-semibold mb-2 text-lg">{isEditing ? "edit project" : "new project"}</h3>
            <form onSubmit={handleSubmitProject} className="flex flex-col gap-3 bg-background/80 border border-muted rounded-lg p-4 shadow-sm">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="p-2 border border-muted rounded-lg focus:border-foreground transition-colors bg-background"
                required
              />
              <input
                type="text"
                placeholder="Descrição curta"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="p-2 border border-muted rounded-lg focus:border-foreground transition-colors bg-background"
                required
              />
              <input
                type="text"
                placeholder="Tecnologias (separe por vírgula)"
                value={technologies}
                onChange={e => setTechnologies(e.target.value)}
                className="p-2 border border-muted rounded-lg focus:border-foreground transition-colors bg-background"
              />
              <input
                type="text"
                placeholder="GitHub URL (opcional)"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="p-2 border border-muted rounded-lg focus:border-foreground transition-colors bg-background"
              />
              <textarea
                placeholder="Conteúdo em Markdown"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="p-2 border border-muted rounded-lg min-h-[120px] font-mono focus:border-foreground transition-colors bg-background"
                required
              />
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <span className="block text-xs text-zinc-500 mb-1">Preview Markdown:</span>
                  <div className="border rounded p-2 min-h-[120px] bg-zinc-50 dark:bg-zinc-800 prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "_Nada para pré-visualizar_"}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isEditing && (
                  <motion.button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-gray-600 transition-colors font-bold flex-1"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  className={`${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg mt-2 transition-colors font-bold flex-1`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isEditing ? 'Update Project' : 'Add Project'}
                </motion.button>
              </div>
            </form>
          </section>

          {/* Formulário de upload de imagens */}
          <section className="mb-10">
            <h3 className="font-semibold mb-2 text-lg">Upload de Imagens</h3>
            <form onSubmit={handleUploadImages} className="flex flex-col gap-3 bg-background/80 border border-muted rounded-lg p-4 shadow-sm">
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="p-2 border border-muted rounded-lg focus:border-foreground transition-colors bg-background"
                required
              >
                <option value="">Selecione o projeto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="p-2 border border-muted rounded-lg bg-background"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {imageFiles.map((file, idx) => (
                  <span key={idx} className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                    {file.name}
                  </span>
                ))}
              </div>
              <motion.button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-700 transition-colors font-bold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Enviar Imagens
              </motion.button>
            </form>
          </section>

          {/* Lista de projetos */}
          <section>
            <h3 className="font-semibold mb-4 text-lg">Projetos</h3>
            {loading ? (
              <motion.p className="text-muted">Carregando...</motion.p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.length === 0 && <span className="text-zinc-400">Nenhum projeto cadastrado</span>}
                {projects.map(project => (
                  <AdminProjectCard key={project.id} project={project} onEdit={handleEditProject} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
} 
