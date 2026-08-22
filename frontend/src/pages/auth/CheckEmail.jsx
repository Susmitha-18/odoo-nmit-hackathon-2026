import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

export default function CheckEmail() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
          <MailCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          We've sent a verification link to your email address.
          Click the link to activate your account and sign in.
        </p>
        <Link to="/login" className="btn-primary btn w-full">
          Back to Sign in
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Didn't receive an email? Check your spam folder or contact your HR team.
        </p>
      </div>
    </div>
  );
}
