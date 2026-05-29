'use client';

import { useEffect, useMemo, useState } from 'react';

import Footer from './footer';

import {
    Check,
    Moon,
    Plus,
    Search,
    Sun,
    Trash2,
} from 'lucide-react';

import {
    checklistData,
    type ChecklistItem,
} from './checklist-data';

type Project = {
    websiteUrl: string;
    checklist: ChecklistItem[];
};

const STORAGE_KEY = 'tcj-projects';

export default function Checklist() {
    const [darkMode, setDarkMode] =
        useState(true);

    const [projects, setProjects] =
        useState<Record<string, Project>>({});

    const [websiteUrl, setWebsiteUrl] =
        useState('');

    const [search, setSearch] = useState('');

    const [activeProject, setActiveProject] =
        useState('');

    const [checklist, setChecklist] =
        useState<ChecklistItem[]>(
            structuredClone(checklistData)
        );

    const [activeTab, setActiveTab] =
        useState<string>('Website Development');

    // LOAD SAVED PROJECTS
    useEffect(() => {
        const savedProjects =
            localStorage.getItem(STORAGE_KEY);

        if (savedProjects) {
            const parsedProjects =
                JSON.parse(savedProjects);

            setProjects(parsedProjects);

            const firstProject =
                Object.keys(parsedProjects)[0];

            if (firstProject) {
                setActiveProject(firstProject);

                setChecklist(
                    structuredClone(
                        parsedProjects[firstProject]
                            .checklist
                    )
                );
            }
        }
    }, []);

    // SAVE PROJECTS
    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projects)
        );
    }, [projects]);

    // CREATE PROJECT
    const createProject = () => {
        if (!websiteUrl.trim()) return;

        const normalizedUrl = websiteUrl
            .replace('https://', '')
            .replace('http://', '')
            .trim();

        // LOAD IF EXISTS
        if (projects[normalizedUrl]) {
            loadProject(normalizedUrl);

            setWebsiteUrl('');

            return;
        }

        const newProject: Project = {
            websiteUrl: normalizedUrl,
            checklist: structuredClone(checklist),
        };

        setProjects((prev) => ({
            ...prev,
            [normalizedUrl]: newProject,
        }));

        setActiveProject(normalizedUrl);

        setWebsiteUrl('');
    };

    // LOAD PROJECT
    const loadProject = (url: string) => {
        setActiveProject(url);

        setChecklist(
            structuredClone(projects[url].checklist)
        );
    };

    // DELETE PROJECT
    const deleteProject = (url: string) => {
        const updatedProjects = { ...projects };

        delete updatedProjects[url];

        setProjects(updatedProjects);

        if (activeProject === url) {
            setActiveProject('');

            setChecklist(
                structuredClone(checklistData)
            );
        }
    };

    // TOGGLE CHECKLIST
    const toggleChecklist = (id: number) => {
        const updatedChecklist = checklist.map(
            (item) =>
                item.id === id
                    ? {
                        ...item,
                        completed: !item.completed,
                    }
                    : item
        );

        setChecklist(updatedChecklist);

        if (activeProject) {
            setProjects((prev) => ({
                ...prev,
                [activeProject]: {
                    ...prev[activeProject],
                    checklist:
                        structuredClone(
                            updatedChecklist
                        ),
                },
            }));
        }
    };

    // FILTERED CHECKLIST
    const filteredChecklist = useMemo(() => {
        return checklist.filter(
            (item) =>
                item.category === activeTab &&
                item.task
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );
    }, [checklist, search, activeTab]);

    // CATEGORIES
    const categories: string[] = [
        ...new Set(
            checklist.map(
                (item) => item.category
            )
        ),
    ];

    // PROGRESS
    const completedTasks = checklist.filter(
        (item) => item.completed
    ).length;

    const progress = Math.round(
        (completedTasks / checklist.length) * 100
    );

    return (
        <main
            className={`min-h-screen transition-colors duration-200 ${darkMode
                ? 'bg-[#0f1115] text-white'
                : 'bg-[#f5f7fa] text-[#111827]'
                }`}
        >
            {/* HEADER */}
            <header
                className={`sticky top-0 z-50 border-b backdrop-blur ${darkMode
                    ? 'border-white/5 bg-[#0f1115]/90'
                    : 'border-black/5 bg-white/90'
                    }`}
            >
                <div className="mx-auto flex min-h-14 max-w-7xl flex-col gap-3 px-3 py-3 lg:h-14 lg:flex-row lg:items-center lg:justify-between lg:px-4 lg:py-0">
                    <div>
                        <h1 className="text-[16px] font-semibold">
                            TCJ Checklist
                        </h1>

                        <p className="text-[12px] text-zinc-500">
                            WordPress Deployment Tracker
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-normal">
                        <div
                            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${darkMode
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-emerald-100 text-emerald-700'
                                }`}
                        >
                            {progress}% Complete
                        </div>

                        <button
                            onClick={() =>
                                setDarkMode(
                                    !darkMode
                                )
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${darkMode
                                ? 'border-white/10 bg-[#181b21]'
                                : 'border-black/10 bg-white'
                                }`}
                        >
                            {darkMode ? (
                                <Sun size={16} />
                            ) : (
                                <Moon size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 py-3 lg:grid-cols-[260px_1fr] lg:px-4 lg:py-4">
                {/* SIDEBAR */}
                <aside
                    className={`order-2 rounded-2xl border p-3 lg:order-1 lg:p-4 ${darkMode
                        ? 'border-white/10 bg-[#181b21]'
                        : 'border-black/10 bg-white'
                        }`}
                >
                    {/* ADD WEBSITE */}
                    <div className="mb-4">
                        <div className="mb-2 text-[12px] font-semibold uppercase text-zinc-500">
                            Add Website
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="clientwebsite.com"
                                value={websiteUrl}
                                onChange={(e) =>
                                    setWebsiteUrl(
                                        e.target.value
                                    )
                                }
                                className={`h-10 w-full rounded-lg border px-3 text-[12px] outline-none ${darkMode
                                    ? 'border-white/10 bg-[#14171d]'
                                    : 'border-black/10 bg-zinc-50'
                                    }`}
                            />

                            <button
                                onClick={
                                    createProject
                                }
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-[12px] font-medium text-white"
                            >
                                <Plus size={14} />
                                Add Website
                            </button>
                        </div>
                    </div>

                    {/* PROJECTS */}
                    <div className="space-y-2">
                        {Object.keys(projects).map(
                            (url) => {
                                const projectChecklist =
                                    projects[url]
                                        .checklist;

                                const completed =
                                    projectChecklist.filter(
                                        (
                                            item
                                        ) =>
                                            item.completed
                                    ).length;

                                const projectProgress =
                                    Math.round(
                                        (completed /
                                            projectChecklist.length) *
                                        100
                                    );

                                return (
                                    <div
                                        key={url}
                                        className={`rounded-xl border p-3 ${activeProject ===
                                            url
                                            ? 'border-blue-500'
                                            : darkMode
                                                ? 'border-white/10'
                                                : 'border-black/10'
                                            }`}
                                    >
                                        <button
                                            onClick={() =>
                                                loadProject(
                                                    url
                                                )
                                            }
                                            className="w-full text-left"
                                        >
                                            <p className="truncate text-[12px] font-medium">
                                                {url}
                                            </p>

                                            <p className="mt-1 text-[11px] text-zinc-500">
                                                {
                                                    projectProgress
                                                }
                                                % Complete
                                            </p>
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteProject(
                                                    url
                                                )
                                            }
                                            className="mt-2 flex items-center gap-1 text-[11px] text-red-500"
                                        >
                                            <Trash2 size={11} />
                                            Delete
                                        </button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </aside>

                {/* CONTENT */}
                <section className="order-1 lg:order-2">
                    {/* SEARCH */}
                    <div
                        className={`mb-3 flex h-10 items-center gap-2 rounded-xl border px-3 lg:mb-4 ${darkMode
                            ? 'border-white/10 bg-[#181b21]'
                            : 'border-black/10 bg-white'
                            }`}
                    >
                        <Search
                            size={14}
                            className="text-zinc-500"
                        />

                        <input
                            type="text"
                            placeholder="Search checklist..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full bg-transparent text-[12px] outline-none"
                        />
                    </div>

                    {/* TABS */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                        {categories.map(
                            (category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setActiveTab(
                                            category
                                        )
                                    }
                                    className={`whitespace-nowrap rounded-lg border px-3 py-2 text-[12px] ${activeTab ===
                                        category
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : darkMode
                                            ? 'border-white/10 bg-[#181b21]'
                                            : 'border-black/10 bg-white'
                                        }`}
                                >
                                    {category}
                                </button>
                            )
                        )}
                    </div>

                    {/* CHECKLIST */}
                    <div
                        className={`overflow-hidden rounded-xl border lg:rounded-2xl ${darkMode
                            ? 'border-white/10 bg-[#181b21]'
                            : 'border-black/10 bg-white'
                            }`}
                    >
                        {filteredChecklist.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-3 border-b px-3 py-3 lg:px-4 ${darkMode
                                        ? 'border-white/5'
                                        : 'border-black/5'
                                        }`}
                                >
                                    <button
                                        onClick={() =>
                                            toggleChecklist(
                                                item.id
                                            )
                                        }
                                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border ${item.completed
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : darkMode
                                                ? 'border-white/10 bg-[#14171d]'
                                                : 'border-black/10'
                                            }`}
                                    >
                                        {item.completed && (
                                            <Check
                                                size={
                                                    12
                                                }
                                            />
                                        )}
                                    </button>

                                    <p
                                        onClick={() =>
                                            toggleChecklist(
                                                item.id
                                            )
                                        }
                                        className={`select-text cursor-pointer text-[13px] leading-relaxed ${item.completed
                                            ? 'text-zinc-500 line-through'
                                            : darkMode
                                                ? 'text-zinc-200'
                                                : 'text-zinc-800'
                                            }`}
                                    >
                                        {item.task}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>

            <Footer darkMode={darkMode} />
        </main>
    );
}