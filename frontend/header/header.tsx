import Notification from "./components/notification";
import SearchBar from "./components/search-bar";
import Profile from "./components/profile";

export default function Header() {
	return (
		<header className="py-6 border-b border-sidebar-border">
			<nav className="flex items-center justify-between max-w-[700px] mx-auto px-6 xl:px-0">
				<h1 className="tracking-[-0.05em] text-[20px] font-bold">SyncTask</h1>
				<div className="flex gap-6 items-center">
					<div className="flex items-center gap-2">
						<SearchBar />
						<Notification />
					</div>

					<Profile />
				</div>
			</nav>
		</header>
	);
}
