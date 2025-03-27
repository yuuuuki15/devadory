import RegisterForm from '@/components/RegisterForm/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-300">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white/10 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-white/20">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
