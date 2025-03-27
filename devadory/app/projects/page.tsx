// app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Parse from 'parse';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Project {
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    status: 'To Do' | 'In Progress' | 'Done';
    owner: Parse.User;
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoading } = useAuth(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const currentUser = Parse.User.current();
                if (!currentUser) {
                    setError('Please sign in to view your projects');
                    setLoading(false);
                    return;
                }

                const query = new Parse.Query('Project');
                query.equalTo('owner', currentUser);
                query.include('owner');
                query.descending('createdAt');

                const results = await query.find();
                const projectsData = results.map(project => ({
                    id: project.id || '',
                    name: project.get('name') || '',
                    description: project.get('description') || '',
                    dueDate: project.get('dueDate') || new Date(),
                    status: project.get('status') || 'To Do',
                    owner: project.get('owner'),
                }));

                setProjects(projectsData);
            } catch (err) {
                setError('Failed to load projects');
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) {
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

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-300">My Projects</h1>
                    <a
                        href="/projects/new"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        New Project
                    </a>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden shadow-lg mt-10">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 h-10 text-center">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Project Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Owner
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Due Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 h-10 text-center hover:bg-indigo-500/10 cursor-pointer transition-all duration-200"
                                >
                                    <td className="px-6 py-4 text-left">
                                        <div className="">
                                            {project.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            project.status === 'To Do' ? 'bg-yellow-500/20 text-yellow-400' :
                                            project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="">
                                            {project.owner.get('username')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="">
                                            {new Date(project.dueDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No projects found. Create your first project!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
