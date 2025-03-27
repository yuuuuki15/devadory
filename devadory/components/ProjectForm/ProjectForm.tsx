'use client';

import { useState } from 'react';
import Parse from 'parse';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
    initialData?: {
        name: string;
        description: string;
        dueDate: string;
        status: string;
    };
    projectId?: string;
}

export default function ProjectForm({ initialData, projectId }: ProjectFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        dueDate: initialData?.dueDate || '',
        status: initialData?.status || 'To Do'
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const currentUser = Parse.User.current();
            if (!currentUser) {
                throw new Error('Please sign in to create a project');
            }

            const Project = Parse.Object.extend('Project');
            const project = projectId ? new Project({ id: projectId }) : new Project();

            project.set('name', formData.name);
            project.set('description', formData.description);
            project.set('dueDate', new Date(formData.dueDate));
            project.set('status', formData.status);
            project.set('owner', currentUser);

            await project.save();
            router.push('/projects');
        } catch (err) {
            setError(projectId ? 'Failed to update project' : 'Failed to create project');
            console.error('Error saving project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Project Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">
                    Due Date
                </label>
                <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            {error && (
                <div className="rounded-md bg-red-500/10 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-400">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-4">
                <a
                    href="/projects"
                    className="rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (projectId ? 'Updating...' : 'Creating...') : (projectId ? 'Update Project' : 'Create Project')}
                </button>
            </div>
        </form>
    );
}
