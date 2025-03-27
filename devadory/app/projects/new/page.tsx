'use client';

import ProjectForm from '@/components/ProjectForm/ProjectForm';

export default function NewProjectPage() {
    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                    <h1 className="text-2xl font-bold text-gray-300 mb-8">New Project</h1>
                    <ProjectForm />
                </div>
            </div>
        </div>
    );
}
