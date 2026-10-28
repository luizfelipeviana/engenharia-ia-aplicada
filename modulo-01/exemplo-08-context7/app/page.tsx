"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Hello World
      </h1>

      {isPending ? (
        <p className="text-zinc-500 dark:text-zinc-400">Carregando...</p>
      ) : session ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-700 dark:text-zinc-300">
            Logado como{" "}
            <span className="font-medium text-black dark:text-white">
              {session.user.name ?? session.user.email}
            </span>
          </p>
          <button
            onClick={() => signOut()}
            className="rounded-full border border-black/[.08] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Sair
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-500 dark:text-zinc-400">
            Você não está logado
          </p>
          <button
            onClick={() =>
              signIn.social({ provider: "github", callbackURL: "/" })
            }
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            <GitHubIcon />
            Entrar com GitHub
          </button>
        </div>
      )}
    </div>
  );
}
