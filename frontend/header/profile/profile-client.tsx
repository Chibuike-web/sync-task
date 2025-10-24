export default function ProfileClient({ data }: { data: { name: string } }) {
	return (
		<button className="bg-foreground rounded-full size-10 text-white font-semibold">
			{data.name
				.split(" ")
				.map((n) => n[0])
				.join("")}
		</button>
	);
}
