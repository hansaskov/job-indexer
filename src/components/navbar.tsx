import { ThemeController } from "./themeController";

export function Navbar() {
    return (
        <div
            class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur bg-base-100 text-base-content shadow-sm"
        >
            <div class="navbar">
                <div class="navbar-start">

                </div>
                <div class="navbar-center">
                    <a class="btn btn-ghost normal-case text-xl" href="/">Job-Matcher</a>
                </div>
                <div class="navbar-end">
                    <ThemeController />
                </div>
            </div>
        </div>
    )
}