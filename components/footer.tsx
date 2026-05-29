type FooterProps = {
    darkMode: boolean;
};

export default function Footer({
    darkMode,
}: FooterProps) {
    return (
        <footer
            className={`border-t transition-colors duration-200 ${darkMode
                ? 'border-white/5 bg-[#0f1115]'
                : 'border-black/5 bg-white'
                }`}
        >
            <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
                {/* LEFT */}
                <div>
                    <p
                        className={`text-[12px] font-medium ${darkMode
                            ? 'text-zinc-300'
                            : 'text-zinc-700'
                            }`}
                    >
                        TCJ Checklist
                    </p>

                    <p
                        className={`text-[11px] ${darkMode
                            ? 'text-zinc-500'
                            : 'text-zinc-500'
                            }`}
                    >
                        WordPress Deployment Tracker
                    </p>
                </div>

                {/* RIGHT */}
                <div
                    className={`flex items-center gap-3 text-[11px] ${darkMode
                        ? 'text-zinc-500'
                        : 'text-zinc-500'
                        }`}
                >
                    <span>
                        Built with Jayfel Pareja
                    </span>

                    <span
                        className={`h-3 w-px ${darkMode
                            ? 'bg-white/10'
                            : 'bg-zinc-300'
                            }`}
                    />

                    <span>
                        © {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </footer>
    );
}