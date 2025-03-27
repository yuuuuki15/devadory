'use client';

import { useEffect, useState } from 'react';
import Parse from 'parse';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface Project {
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    status: 'To Do' | 'In Progress' | 'Done';
    owner: Parse.User;
    createdAt: Date;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const currentUser = Parse.User.current();
                if (!currentUser) {
                    setError('Please sign in to view project details');
                    setLoading(false);
                    return;
                }

                const query = new Parse.Query('Project');
                query.equalTo('objectId', resolvedParams.id);
                query.equalTo('owner', currentUser);
                query.include('owner');

                const result = await query.first();
                if (!result) {
                    setError('Project not found');
                    setLoading(false);
                    return;
                }

                setProject({
                    id: result.id || '',
                    name: result.get('name') || '',
                    description: result.get('description') || '',
                    dueDate: result.get('dueDate') || new Date(),
                    status: result.get('status') || 'To Do',
                    owner: result.get('owner'),
                    createdAt: result.get('createdAt') || new Date(),
                });
            } catch (err) {
                setError('Failed to load project');
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [resolvedParams.id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const query = new Parse.Query('Project');
            const project = await query.get(resolvedParams.id);
            await project.destroy();
            router.push('/projects');
        } catch (err) {
            setError('Failed to delete project');
            console.error('Error deleting project:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-300">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            project.status === 'To Do' ? 'bg-yellow-500/20 text-yellow-400' :
                            project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                        }`}>
                            {project.status}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-300">
                            {project.name}
                        </h1>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="text-sm text-gray-400">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex gap-4">
                            <a
                                href={`/projects/${project.id}/edit`}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Edit Project
                            </a>
                            <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-gray-400">
                            Created by {project.owner.get('username')}
                        </div>
                        <div className="text-sm text-gray-400">
                            Created on {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-400 whitespace-pre-wrap mt-2">
                            {project.description}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <a
                        href="/projects"
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                        ← Back to Projects
                    </a>
                </div>
            </div>
        </div>
    );
}
