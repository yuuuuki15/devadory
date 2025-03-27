'use client';

import { useEffect, useState } from 'react';
import Parse from 'parse';
import ProjectForm from '@/components/ProjectForm/ProjectForm';
import { use } from 'react';

interface Project {
    name: string;
    description: string;
    dueDate: string;
    status: string;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [initialData, setInitialData] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const currentUser = Parse.User.current();
                if (!currentUser) {
                    setError('Please sign in to edit project');
                    setLoading(false);
                    return;
                }

                const query = new Parse.Query('Project');
                query.equalTo('objectId', resolvedParams.id);
                query.equalTo('owner', currentUser);

                const result = await query.first();
                if (!result) {
                    setError('Project not found');
                    setLoading(false);
                    return;
                }

                setInitialData({
                    name: result.get('name') || '',
                    description: result.get('description') || '',
                    dueDate: result.get('dueDate') ? new Date(result.get('dueDate')).toISOString().split('T')[0] : '',
                    status: result.get('status') || 'To Do',
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

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                    <h1 className="text-2xl font-bold text-gray-300 mb-8">Edit Project</h1>
                    {initialData && (
                        <ProjectForm
                            initialData={initialData}
                            projectId={resolvedParams.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
