<template>
  <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative transform md:-translate-y-4">
      <h3 class="text-xl font-bold text-slate-800 text-center mb-2">Paket 1 Sesi</h3>
      <p class="text-sm text-slate-500 text-center mb-6">Cocok untuk mencoba curhat pertama kali</p>
      
      <div class="text-center mb-8">
        <span class="text-4xl font-black text-teal-600">Rp 45.000</span>
      </div>
      
      <button class="w-full py-3 bg-white text-teal-600 font-bold rounded-xl border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-400 transition-colors mb-8">
        Pilih Paket
      </button>
      
      <ul class="space-y-4 text-sm text-slate-600 mt-auto">
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> 1x Sesi Konsultasi</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Durasi 60 Menit</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Pilih Persona Bebas</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Riwayat Chat Tersimpan</li>
      </ul>
    </div>

    <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all flex flex-col relative transform md:-translate-y-4">
      <h3 class="text-xl font-bold text-slate-800 text-center mb-2">Paket 3 Sesi</h3>
      <p class="text-sm text-slate-500 text-center mb-6">Lebih hemat untuk sesi berkelanjutan</p>
      
      <div class="text-center mb-8 flex flex-col items-center">
        <span class="text-sm text-slate-400 line-through font-medium mb-1">Rp 135.000</span>
        <span class="text-4xl font-black text-teal-600">Rp 120.000</span>
      </div>
      
      <button class="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-md shadow-teal-200 transition-colors mb-8">
        Pilih Paket
      </button>
      
      <ul class="space-y-4 text-sm text-slate-600 mt-auto">
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> 3x Sesi Konsultasi</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Durasi 60 Menit / Sesi</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Pilih Persona Bebas</li>
        <li class="flex items-center gap-3"><span class="text-teal-500 text-lg">✓</span> Riwayat Chat Tersimpan</li>
      </ul>
    </div>

    <div class="bg-gradient-to-br from-teal-500 to-teal-700 rounded-[2.5rem] p-8 shadow-xl shadow-teal-600/30 transition-all flex flex-col relative transform md:-translate-y-4">
      <div class="absolute -top-4 right-6 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wide">
        Paling Populer
      </div>
      
      <h3 class="text-xl font-bold text-white text-center mb-2">Paket 5 Sesi</h3>
      <p class="text-sm text-teal-100 text-center mb-6">Perjalanan penuh menuju ketenangan</p>
      
      <div class="text-center mb-8 flex flex-col items-center">
        <span class="text-sm text-teal-200/70 line-through font-medium mb-1">Rp 225.000</span>
        <span class="text-4xl font-black text-white">Rp 175.000</span>
      </div>
      
      <button class="w-full py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors mb-8 shadow-inner">
        Pilih Paket
      </button>
      
      <ul class="space-y-4 text-sm text-teal-50 mt-auto">
        <li class="flex items-center gap-3"><span class="text-yellow-400 font-bold text-lg">✓</span> 5x Sesi Konsultasi</li>
        <li class="flex items-center gap-3"><span class="text-yellow-400 font-bold text-lg">✓</span> Durasi 60 Menit / Sesi</li>
        <li class="flex items-center gap-3"><span class="text-yellow-400 font-bold text-lg">✓</span> Pilih Persona Bebas</li>
        <li class="flex items-center gap-3"><span class="text-yellow-400 font-bold text-lg">✓</span> Riwayat Chat Tersimpan</li>
      </ul>
    </div>

  </div>
</template>