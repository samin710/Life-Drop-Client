import React from "react";
import { useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg text-center bg-white p-8 shadow-md rounded-lg">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
