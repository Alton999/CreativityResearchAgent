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
			<div
				className="fixed inset-0 bg-gray-800 opacity-75"
				onClick={closeModal}
			></div>
			<div className="bg-white w-[600px] h-150 p-6 rounded-lg shadow-lg z-10">
				<div className="flex w-full flex-col gap-4">
					<div className="flex justify-between">
						<h4 className="text-lg font-bold">Generate experiments</h4>

						<button className="cursor-pointer hover:bg-slate-100">
							<X size={24} onClick={closeModal} />
						</button>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export default ModalLayout;
