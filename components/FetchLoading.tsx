import React from "react";
import { Skeleton } from "./ui/skeleton";

const FetchLoading = () => {
	return (
		<div className="space-y-2">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<Skeleton className="h-4 w-4/6" />
			<Skeleton className="h-4 w-5/6" />
			<Skeleton className="h-4 w-6/6" />
		</div>
	);
};

export default FetchLoading;
