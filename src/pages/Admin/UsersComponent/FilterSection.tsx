import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Input,
	DropdownSection,
} from "@heroui/react";

import {
	SearchIcon,
	FilterIcon,
	SoloUserIcon,
	KeyIcon,
	GroupUserIcon,
	SortIcon,
} from "@/components/icons";
import useIsMobile from "@/lib/isMobile";
import { SortConfig } from "@/data/supabase/Admin/Users/fetchAllUsers";
import { useMemo } from "react";

interface FilterSectionProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	sortConfig: SortConfig;
	setSortConfig: (config: SortConfig) => void;
	selectedRoles: string[];
	setSelectedRoles: (roles: string[]) => void;
	selectedStatuses: string[];
	setSelectedStatuses: (statuses: string[]) => void;
}

export function FilterSection({
	searchTerm,
	setSearchTerm,
	sortConfig,
	setSortConfig,
	selectedRoles,
	setSelectedRoles,
	selectedStatuses,
	setSelectedStatuses,
}: FilterSectionProps) {
	const isMobile = useIsMobile();

	const sortOptions = [
		{
			key: "name_asc",
			label: "Alphabetical (A-Z)",
			column: "user_name",
			ascending: true,
		},
		{
			key: "name_desc",
			label: "Alphabetical (Z-A)",
			column: "user_name",
			ascending: false,
		},
		{
			key: "date_desc",
			label: "Newest First",
			column: "created_at",
			ascending: false,
		},
		{
			key: "date_asc",
			label: "Oldest First",
			column: "created_at",
			ascending: true,
		},
	];

	const roleMapping: Record<string, string> = {
		individual: "Individual",
		cooperative: "Cooperative",
		admin: "Admin",
	};

	const statusMapping: Record<string, string> = {
		Approved: "Approved",
		"For Approval": "For Approval",
		Suspended: "Suspended",
		Rejected: "Rejected",
	};

	const currentSortOption =
		sortOptions.find(
			(opt) =>
				opt.column === sortConfig.column &&
				opt.ascending === sortConfig.ascending,
		) || sortOptions[2];

	const selectedRoleKeys = useMemo(() => {
		return new Set(
			Object.entries(roleMapping)
				.filter(([_, value]) => selectedRoles.includes(value))
				.map(([key]) => key),
		);
	}, [selectedRoles]);

	const selectedStatusKeys = useMemo(() => {
		return new Set(
			Object.entries(statusMapping)
				.filter(([_, value]) => selectedStatuses.includes(value))
				.map(([key]) => key),
		);
	}, [selectedStatuses]);

	return (
		<div className="flex flex-row justify-between w-full">
			<Input
				className="w-1/2 sm:w-1/4"
				placeholder="Search user"
				startContent={<SearchIcon />}
				value={searchTerm}
				onValueChange={setSearchTerm}
				isClearable
				onClear={() => setSearchTerm("")}
			/>
			<div className="flex flex-row gap-2 justify-end">
				<Dropdown>
					<DropdownTrigger>
						<Button
							className="capitalize"
							isIconOnly={isMobile}
							startContent={<FilterIcon className="w-5" />}
						>
							{isMobile ? "" : "Filter Users"}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Filter Users"
						closeOnSelect={false}
						selectionMode="multiple"
						onSelectionChange={(keys) => {
							const selectedKeys = Array.from(keys) as string[];

							// Separate role and status keys
							const roleKeys = Object.keys(roleMapping);
							const statusKeys = Object.keys(statusMapping);

							const nextRoles = selectedKeys
								.filter((key) => roleKeys.includes(key))
								.map((key) => roleMapping[key]);

							const nextStatuses = selectedKeys
								.filter((key) => statusKeys.includes(key))
								.map((key) => statusMapping[key]);

							setSelectedRoles(nextRoles);
							setSelectedStatuses(nextStatuses);
						}}
						selectedKeys={
							new Set([
								...Array.from(selectedRoleKeys),
								...Array.from(selectedStatusKeys),
							])
						}
					>
						<DropdownSection title="Filter Role">
							<DropdownItem key="individual">
								<div className="flex items-center gap-2">
									<SoloUserIcon className="w-5" />
									<span>Individual</span>
								</div>
							</DropdownItem>
							<DropdownItem key="cooperative">
								<div className="flex items-center gap-2">
									<GroupUserIcon className="w-5" />
									<span>Cooperative</span>
								</div>
							</DropdownItem>
							<DropdownItem key="admin">
								<div className="flex items-center gap-2">
									<KeyIcon className="w-5" />
									<span>Admin</span>
								</div>
							</DropdownItem>
						</DropdownSection>
						<DropdownSection title="Filter Status">
							<DropdownItem key="Approved">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-green-400" />
									<span>Approved</span>
								</div>
							</DropdownItem>
							<DropdownItem key="For Approval">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-yellow-400" />
									<span>For Approval</span>
								</div>
							</DropdownItem>
							<DropdownItem key="Suspended">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-default-400" />
									<span>Suspended</span>
								</div>
							</DropdownItem>
							<DropdownItem key="Rejected">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-red-400" />
									<span>Rejected</span>
								</div>
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
				<Dropdown>
					<DropdownTrigger>
						<Button
							isIconOnly={isMobile}
							startContent={<SortIcon className="w-5" />}
							className="capitalize"
							color={
								sortOptions.length > 0 ? "success" : "default"
							}
						>
							{isMobile ? "" : "Sort By"}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Sort Options"
						onAction={(key) => {
							const option = sortOptions.find(
								(opt) => opt.key === key,
							);
							if (option) {
								setSortConfig({
									column: option.column,
									ascending: option.ascending,
								});
							}
						}}
						selectedKeys={[currentSortOption.key]}
						selectionMode="single"
					>
						{sortOptions.map((option) => (
							<DropdownItem key={option.key}>
								{option.label}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	);
}
