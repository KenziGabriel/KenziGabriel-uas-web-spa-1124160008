  // Ambil tema dari localStorage, default false (light)
  let dark = localStorage.getItem('theme') === 'dark';

  // Set kelas dark di html saat awal load
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Atur icon sesuai tema saat awal load
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
  updateIcon();

  // Fungsi toggle tema
  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    updateIcon();
  }

function showPage(page) {
  document.getElementById('form-page').classList.add('hidden');
  document.getElementById('riwayat-page').classList.add('hidden');
  document.getElementById(`${page}-page`).classList.remove('hidden');
}
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

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    dark = true;
    document.documentElement.classList.add('dark');
  }

  updateTotal();

  const form = document.getElementById('paymentForm');
  form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const produk = document.getElementById('product').selectedOptions[0].text;
  const qty = parseInt(document.getElementById('quantity').value);
  const total = document.getElementById('total').textContent;
  const metode = document.querySelector('input[name="payment"]:checked').value;

  const totalValue = parseInt(total.replace(/[^\d]/g, ''));

  transaksiCount++;
  totalPendapatan += totalValue;

  document.getElementById('transaksi-count').textContent = transaksiCount;
  document.getElementById('total-income').textContent = `Rp ${totalPendapatan.toLocaleString()}`;
  document.getElementById('avg-income').textContent = `Rp ${(totalPendapatan / transaksiCount).toLocaleString()}`;

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

  document.getElementById('no-transaction').style.display = 'none';
  document.getElementById('transaksi-table').classList.remove('hidden');

  form.reset();
  updateTotal();

  // ✅ Tambahkan notifikasi setelah submit
  showToast('Transaksi berhasil ditambahkan!');
    });


  document.getElementById('product').addEventListener('input', updateTotal);
  document.getElementById('quantity').addEventListener('input', updateTotal);
});

let transaksiCount = 0;
let totalPendapatan = 0;

function applyPromo() {
  const promo = document.getElementById('promo').value;
  if (promo === 'DISKON50') {
    updateTotal(0.5);
  } else {
    updateTotal(1);
  }
}

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

