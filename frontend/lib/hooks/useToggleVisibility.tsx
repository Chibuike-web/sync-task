"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useToggleVisibility = () => {
	const [toggleVisibility, setToggleVisibility] = useState(false);
	const handleToggleVisibility = () => {
		setToggleVisibility((prev) => !prev);
	};

	return {
		toggleVisibility,
		handleToggleVisibility,
	};
};
