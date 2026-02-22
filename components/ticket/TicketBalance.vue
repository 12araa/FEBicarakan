<script setup>
import { ref, onMounted } from 'vue';

const ticketBalance = ref(0);
const isLoading = ref(true);

onMounted(async () => {
	try {
		const response = await useApiFetch('/tickets/balance');

		if (response && response.ticket_balance !== undefined) {
			ticketBalance.value = response.ticket_balance;
		} else if (response?.data?.ticket_balance !== undefined) {
			ticketBalance.value = response.data.ticket_balance;
		}
	} catch (error) {
		console.error("Gagal mengambil sisa tiket:", error);
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div
		class="bg-gradient-to-br from-teal-500 to-teal-700 rounded-[2rem] p-6 text-white shadow-xl shadow-teal-200/50 relative overflow-hidden max-w-sm">

		<div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
		<div class="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

		<div class="relative z-10 flex items-center justify-between mb-6">
			<div class="flex items-center gap-4">
				<div
					class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm border border-white/20 shadow-inner">
					🎫
				</div>
				<div>
					<p class="text-teal-100 text-xs font-bold uppercase tracking-widest mb-1">Sisa Tiket Sesi</p>
					<div class="flex items-baseline gap-1">
						<h3 class="text-4xl font-black leading-none">
							{{ isLoading ? '...' : ticketBalance }}
						</h3>
						<span class="text-teal-100 font-medium">Tiket</span>
					</div>
				</div>
			</div>
		</div>

		<div class="relative z-10 bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
			<p class="text-sm text-teal-50 mb-5 leading-relaxed">
				1 Tiket berlaku untuk 1x sesi curhat (60 Menit) dengan persona pilihanmu.
			</p>

			<div class="flex gap-3">
				<NuxtLink :to="{ path: '/tickets', query: { tab: 'offering' } }"
					class=" w-full flex-1 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:scale-[1.02] active:scale-95 transition shadow-sm text-center flex justify-center items-center">
					Beli Tiket
				</NuxtLink>

				<!-- <button
					class="w-12 h-12 bg-teal-600/50 text-white rounded-xl hover:bg-teal-600 flex items-center justify-center transition border border-teal-500">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
						class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</button> -->
			</div>
		</div>

	</div>
</template>