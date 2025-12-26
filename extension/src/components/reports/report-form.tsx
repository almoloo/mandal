import { Input } from '@/components/ui/base/input/input';
import { TextArea } from '@/components/ui/base/textarea/textarea';
import { ReportTypeLabels, ReportTypes } from '@/lib/types';
import { Select } from '@/components/ui/base/select/select';
import { Button } from '@/components/ui/base/buttons/button';
import { useEffect, useState } from 'react';
import { getContractAddressFromUrl, getUserIdentifier } from '@/lib/utils';
import { useCurrentTab } from '@/hooks/use-current-tab';
import { API_BASE_URL } from '@/lib/constants';
import { Loading02 } from '@untitledui/icons';
import { useQueryClient } from '@tanstack/react-query';

export default function ReportForm() {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const [address, setAddress] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const { currentUrl } = useCurrentTab();

	useEffect(() => {
		if (currentUrl) {
			const addr = getContractAddressFromUrl(currentUrl);
			setAddress(addr);
		}
	}, [currentUrl]);

	const reportTypeOptions = Object.entries(ReportTypeLabels).map(
		([id, label]) => ({
			id,
			label,
		})
	);

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		const browserUserEmail = await getUserIdentifier();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = {
			title: formData.get('title'),
			reportType: formData.get('reportType'),
			description: formData.get('description'),
			userAddress: browserUserEmail,
			contractAddress: address,
		};

		setSubmitting(true);
		try {
			const response = await fetch(`${API_BASE_URL}/reviews`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				setIsOpen(false);
				form.reset();
				setSubmitSuccess(true);
				await queryClient.invalidateQueries({
					queryKey: ['contract', address],
				});
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to submit report');
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setSubmitting(false);
		}
	}
	if (submitSuccess) {
		return (
			<div className="bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-950 p-3 rounded-xl">
				<div className="text-center">
					<h2 className="text-lg font-bold mb-2">Report Submitted</h2>
					<p className="text-sm">Thank you for your report!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-950 p-3 rounded-xl">
			{isOpen ? (
				<>
					<div className="mb-3">
						<h2 className="text-sm font-bold mb-1">Report Form</h2>
						<p className="text-sm">
							Please fill out the form below to submit a report.
						</p>
					</div>
					<form
						className="flex flex-col gap-2"
						onSubmit={handleSubmit}
					>
						<Input
							isRequired
							label="Title"
							name="title"
							isDisabled={submitting}
						/>
						<Select
							isRequired
							label="Type of Report"
							items={reportTypeOptions}
							defaultValue={ReportTypes.OTHER}
							name="reportType"
							isDisabled={submitting}
						>
							{(item) => (
								<Select.Item id={item.id}>
									{item.label}
								</Select.Item>
							)}
						</Select>
						<TextArea
							label="Description"
							placeholder="Describe the issue..."
							rows={3}
							isRequired
							name="description"
							isDisabled={submitting}
						/>

						{error && (
							<p className="text-sm bg-rose-100/50 border-rose-200 text-rose-700 rounded-md px-2 py-1">
								{error}
							</p>
						)}

						<Button
							type="submit"
							isDisabled={submitting}
						>
							{submitting ? (
								<Loading02 className="animate-spin" />
							) : (
								<>Submit Report</>
							)}
						</Button>
					</form>
				</>
			) : (
				<Button
					onClick={() => setIsOpen(true)}
					color="secondary"
					className="w-full"
				>
					Open Report Form
				</Button>
			)}
		</div>
	);
}
