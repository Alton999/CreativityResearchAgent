import { X } from "lucide-react";
import React, { ReactNode } from "react";

type Props = {
	title: string;
	children: ReactNode;
	closeModal: () => void;
};

const ModalLayout = ({ title, children, closeModal }: Props) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-gray-800 opacity-75"
				onClick={closeModal}
			/>

			{/* Modal Container */}
			<div className="relative w-full max-w-2xl mx-4 md:mx-auto">
				<div className="bg-white w-full min-h-[200px] max-h-[800px] rounded-lg shadow-lg overflow-hidden flex flex-col">
					{/* Header */}
					<div className="flex justify-between items-center p-4 border-b">
						<h4 className="text-lg font-bold truncate">{title}</h4>
						<button
							className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
							onClick={closeModal}
							aria-label="Close modal"
						>
							<X size={24} />
						</button>
					</div>

					{/* Scrollable Content Area */}
					<div className="overflow-y-auto p-6 space-y-4">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default ModalLayout;
