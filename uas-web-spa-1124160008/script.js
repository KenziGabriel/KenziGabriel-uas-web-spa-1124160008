// Ambil preferensi tema dari localStorage (true jika 'dark')
let dark = localStorage.getItem('theme') === 'dark';

// Atur class 'dark' di elemen <html> berdasarkan preferensi tema
if (dark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Fungsi untuk mengatur ikon tema (light/dark) saat awal load atau saat toggle
function updateIcon() {
  const iconLight = document.getElementById('iconLight');
  const iconDark = document.getElementById('iconDark');
  if (dark) {
    iconLight.classList.add('hidden');
    iconDark.classList.remove('hidden');
  } else {
    iconLight.classList.remove('hidden');
    iconDark.classList.add('hidden');
  }
}
updateIcon(); // Panggil fungsi untuk mengatur ikon saat awal load

// Fungsi untuk toggle antara tema terang dan gelap
function toggleTheme() {
  dark = !dark; // toggle boolean
  document.documentElement.classList.toggle('dark', dark); // toggle class di <html>
  localStorage.setItem('theme', dark ? 'dark' : 'light'); // simpan ke localStorage
  updateIcon(); // perbarui ikon
}

// Fungsi untuk menampilkan halaman tertentu berdasarkan id
function showPage(page) {
  document.getElementById('form-page').classList.add('hidden');
  document.getElementById('riwayat-page').classList.add('hidden');
  document.getElementById(`${page}-page`).classList.remove('hidden');
}

// Fungsi untuk menampilkan notifikasi (toast) selama 3 detik
function showToast(message = 'Berhasil') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('opacity-100');

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('opacity-100');
  }, 3000);
}

// Event saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  // Pastikan tema diterapkan ulang saat reload halaman
  if (localStorage.getItem('theme') === 'dark') {
    dark = true;
    document.documentElement.classList.add('dark');
  }

  updateTotal(); // Hitung total awal

  const form = document.getElementById('paymentForm');

  // Event listener saat form pembayaran disubmit
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Hindari reload halaman

    // Ambil data dari form
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const produk = document.getElementById('product').selectedOptions[0].text;
    const qty = parseInt(document.getElementById('quantity').value);
    const total = document.getElementById('total').textContent;
    const metode = document.querySelector('input[name="payment"]:checked').value;

    // Konversi nilai total (hilangkan Rp, titik, dan spasi)
    const totalValue = parseInt(total.replace(/[^\d]/g, ''));

    // Update statistik transaksi
    transaksiCount++;
    totalPendapatan += totalValue;

    document.getElementById('transaksi-count').textContent = transaksiCount;
    document.getElementById('total-income').textContent = `Rp ${totalPendapatan.toLocaleString()}`;
    document.getElementById('avg-income').textContent = `Rp ${(totalPendapatan / transaksiCount).toLocaleString()}`;

    // Tambahkan baris transaksi ke tabel
    const tbody = document.getElementById('transaksi-body');
    const row = `<tr class="border-t dark:border-gray-700">
      <td class="p-2">${nama}</td>
      <td class="p-2">${email}</td>
      <td class="p-2">${produk}</td>
      <td class="p-2">${qty}</td>
      <td class="p-2">${total}</td>
      <td class="p-2">${metode}</td>
    </tr>`;
    tbody.insertAdjacentHTML('beforeend', row);

    // Sembunyikan pesan "belum ada transaksi"
    document.getElementById('no-transaction').style.display = 'none';
    document.getElementById('transaksi-table').classList.remove('hidden');

    // Reset form & hitung ulang
    form.reset();
    updateTotal();

    // Tampilkan toast sukses
    showToast('Transaksi berhasil ditambahkan!');
  });

  // Event listener: hitung ulang total saat product atau quantity berubah
  document.getElementById('product').addEventListener('input', updateTotal);
  document.getElementById('quantity').addEventListener('input', updateTotal);
});

// Inisialisasi variabel global untuk hitungan
let transaksiCount = 0;
let totalPendapatan = 0;

// Fungsi untuk menerapkan promo diskon
function applyPromo() {
  const promo = document.getElementById('promo').value;
  if (promo === 'DISKON50') {
    updateTotal(0.5); // diskon 50%
  } else {
    updateTotal(1); // tanpa diskon
  }
}

// Fungsi untuk menghitung subtotal dan total berdasarkan input dan diskon
function updateTotal(diskon = 1) {
  const hargaRaw = document.getElementById('product').value;
  const qtyRaw = document.getElementById('quantity').value;

  const harga = parseInt(hargaRaw) || 0;
  const qty = parseInt(qtyRaw) || 1;

  const subtotal = harga * qty;
  const total = subtotal * (isNaN(diskon) ? 1 : diskon);

  document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
  document.getElementById('total').textContent = `Rp ${total.toLocaleString()}`;
}
