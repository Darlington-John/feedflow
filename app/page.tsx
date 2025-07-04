"use client";
import Link from "next/link";
import { useUtilsContext } from "./context/utils-context";
import { useAuthContext } from "./context/auth-context";

export default function Home() {
  const { toggleAuthPopup } = useUtilsContext();
  const { user } = useAuthContext();
  return (
    <div className="relative min-h-screen w-full bg-dark-navy flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full filter blur-3xl animate-pulse -z-10 " />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-pulse -z-10" />

      {/* Hero Section */}
      <section className="w-full max-w-3xl text-center mt-30 mb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
          Collect, Upvote, and <span className="text-blue-400">Act</span> on
          Feedback
        </h1>
        <p className="text-xl md:text-2xl text-silver-blue mb-8">
          The modern way to gather team members feedback, prioritize features,
          and build better products. Real-time, collaborative, and beautiful.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition"
            >
              Try the Dashboard
            </Link>
          ) : (
            <button
              onClick={toggleAuthPopup}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition"
            >
              Get started
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition">
          <div className="bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl">
            📝
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Submit Feedback</h3>
          <p className="text-silver-blue text-center">
            Team members can easily submit bugs, feature requests, or ideas,
            which can then be labeled by admins with tags.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition">
          <div className="bg-purple-500 text-white w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl">
            👍
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upvote & Filter</h3>
          <p className="text-silver-blue text-center">
            Team members upvotes help you prioritize. Filter feedback by tags
            and status in real time.
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition">
          <div className="bg-green-500 text-white w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl">
            🚀
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Admin Controls</h3>
          <p className="text-silver-blue text-center">
            Mark feedback as &apos; under review, &apos; &apos; in progress,
            &apos; , &apos; completed &apos; , &apos; declined &apos; and keep
            users in the loop.
          </p>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="w-full text-center py-6 text-silver-blue text-sm">
        &copy; {new Date().getFullYear()} Feedflow &mdash; Inspired by Canny.io
      </footer>
    </div>
  );
}
